<template>
    <div class="getcode">
        <div class="getcode-codecontainer">
            <pre class="getcode-code" ref="code">{{ xml }}</pre>
        </div>
        <transition>
            <button class="getcode-copy" @click.stop.prevent="copy" v-if="!copied">Copy to clipboard</button>
            <button class="getcode-copy getcode-copy--copied" @click.stop.prevent="copy" v-if="copied">Copied <span class="fas fa-check"></span></button>
        </transition>
    </div>
</template>

<script>
import he from 'he'

export default {
  name: 'GetCode',
  props: {
    palette: {
        type: Object,
        required: true
    }
  },
  data: function() {
    return  {
        copied: false
    }
  },
  computed: {
      xml () {
          let x = `<color-palette name="${he.encode(this.palette.name, { useNamedReferences: true })}" type="${this.palette.type}">\n`

            this.palette.colours.forEach(c => x += `    <color>${c.colour}</color>\n`);

          return x + '</color-palette>';
      }
  },
  methods: {
      copy () {
          if (document.body.createTextRange) {
                const range = document.body.createTextRange();
                range.moveToElementText(this.$refs.code);
                range.select();
            } else if (window.getSelection) {
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(this.$refs.code);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                console.log('Text selection not supported');
            }
            document.execCommand('copy');
            this.copied = true;
      },
      xmlEscape (s) {
        let el = document.createElement('textarea');
        el.value = s;
        return el.innerHTML;
      }
  },
  created: function() {
      this.copied = false
  }
}
</script>

<style scoped lang="less">
@import "../variables.less";

.getcode {
    &:after {
        content: " ";
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
        font-size: 1.3rem;
        width: 100%;
        height: 100%;
        border: @border;
        background-color: @background-colour;
        border-radius: 0.2rem;
        padding: 0.5rem;
        margin: 0;
        overflow: auto;
    }
    &-copy {
        border: none;
        outline: none;
        padding: 0.5rem;
        font-size: 1.5rem;
        color:#fff;
        background-color: @button-colour;
        text-align:center;
        width: 20rem;
        float: right;
        margin-top: 1rem;

        &:hover {
            background-color: @button-colour-hover;
        }

        &--copied {

            background-color: @button-special-colour;

             &:hover {
                background-color: @button-special-colour-hover;
            }
        }
    }
}


</style>