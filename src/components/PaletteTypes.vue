<template>
  <ul class="palettetypes">
    <palette-type
      v-for="type in types"
      :key="type.name"
      class="palettetypes-type"
      :type="type"
      @type-selected="typeSelected"
    />
  </ul>
</template>

<script>
import PaletteType from './PaletteType.vue'

export default {
  name: 'PaletteTypes',
  props: {
    selectedType: {
      type: String,
      required: true
    }
  },
  data: function () {
    return {
      types: [
        this.createType('regular', 'regular', 'Regular'),
        this.createType('ordered-sequential', 'sequential', 'Sequential'),
        this.createType('ordered-diverging', 'diverging', 'Diverging')
      ]
    }
  },
  components: {
    PaletteType
  },
  methods: {
    createType (name, classModifier, displayName) {
      return {
        name: name,
        classModifier: classModifier,
        displayName: displayName,
        isSelected: name === this.selectedType
      }
    },
    typeSelected (type) {
      this.$emit('type-selected', type)
    }
  },
  watch: {
    selectedType (newValue) {
      this.types.forEach(x => (x.isSelected = x.name === newValue))
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.palettetypes {
  display: block;
  list-style: none;
  margin: 0;
  padding: 0;

  &-type {
    display: block;
    margin-top: 0.7rem;

    &:first-child {
      margin: 0;
    }
  }
}
</style>
