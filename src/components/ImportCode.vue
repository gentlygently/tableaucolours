<template>
  <div class="importcode">
    <div class="importcode-codecontainer">
      <textarea
        class="importcode-code"
        :class="codeClasses"
        v-model.trim="xml"
        placeholder="Paste a &lt;color-palette&gt;"
        autocorrect="off"
        autocapitalize="off"
        spellcheck="false"
      ></textarea>
      <div
        class="importcode-validationmessage"
        v-show="hasValidationMessage"
      >{{ validationMessage }}</div>
    </div>
    <button
      class="importcode-button importcode-button--import"
      @click="importXml"
      :disabled="!isValid"
    >Import</button>
    <button class="importcode-button importcode-button--cancel" @click="$emit('close')">Cancel</button>
  </div>
</template>

<script>
const xmlParser = new DOMParser()
const colourPattern = /^#[0-9a-f]{3}(?:[0-9a-f]{3})?$/i

export default {
  name: 'ImportCode',
  data: function () {
    return {
      xml: '',
      isValid: false,
      validationMessage: '',
      palette: {}
    }
  },
  computed: {
    hasCode () {
      return !!this.xml
    },
    hasValidationMessage () {
      return !!this.validationMessage
    },
    codeClasses () {
      let classes = []

      if (this.hasCode && !this.isValid) {
        classes.push('importcode-code--invalid')
      }

      if (this.hasValidationMessage) {
        classes.push('importcode-code--validationmessage')
      }

      return classes
    }
  },
  methods: {
    invalid (message) {
      this.isValid = false
      this.validationMessage = message
      this.palette = {}
    },
    importXml (event) {
      this.$emit('import-palette', this.palette)
    }
  },
  watch: {
    xml (newValue) {
      if (!newValue) {
        return this.invalid('')
      }

      const doc = xmlParser.parseFromString(newValue, 'application/xml')
      const root = doc.documentElement

      if (root.getElementsByTagName('parsererror').length) {
        return this.invalid('Unable to parse XML')
      }

      if (root.tagName !== 'color-palette') {
        return this.invalid('Expected a root element of <color-palette>')
      }

      const colours = [...root.children]
        .filter(x => x.tagName === 'color')
        .map(x => x.innerHTML.trim())

      if (!colours.length) {
        return this.invalid('Expected one or more <color> elements')
      }

      if (colours.filter(x => !x).length > 0) {
        return this.invalid('All <color> elements must contain a valid colour')
      }

      const invalidColour = colours.find(x => !colourPattern.test(x))

      if (invalidColour) {
        return this.invalid(`'${invalidColour}' is not a valid colour`)
      }

      this.isValid = true
      this.validationMessage = ''
      this.palette = {
        name: root.getAttribute('name'),
        type: root.getAttribute('type'),
        colours: colours
      }
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.importcode {
  &:after {
    content: ' ';
    display: block;
    clear: both;
    width: 0;
    height: 0;
  }

  &-codecontainer {
    width: 50rem;
    height: 30rem;
  }

  &-code {
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    border: @border;
    background-color: @background-colour;
    border-radius: 0.2rem;
    padding: 0.5rem;
    margin: 0;
    overflow: auto;
    font-size: 1.3rem;
    outline: none;
    transition: height 0.2s;

    &--invalid {
      border-color: #f00;
      background-color: #ff000010;
    }

    &--validationmessage {
      height: 28rem;
    }
  }

  &-validationmessage {
    color: #f00;
    font-size: 1.5rem;
    margin-top: 0.5rem;
    height: 2rem;
    box-sizing: border-box;
    transition: height 0.2s;
  }

  &-button {
    border: none;
    outline: none;
    padding: 0.5rem;
    font-size: 1.5rem;
    color: #fff;
    background-color: @button-colour;
    text-align: center;
    width: 15rem;
    float: right;
    margin-top: 1rem;
    margin-left: 1rem;

    &:hover {
      background-color: @button-colour-hover;
    }

    &:disabled {
      background-color: @button-colour-disabled;
    }
  }
}
</style>
