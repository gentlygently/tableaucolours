<template>
  <div
    class="palettetypes"
    @keyup.down.exact.stop.prevent="arrowDown"
    @keyup.up.exact.stop.prevent="arrowUp"
    @keyup.enter.exact.stop.prevent="toggleList"
    @click.stop
  >
    <div ref="select" class="palettetypes-select" :tabindex="tabIndex >= 0 ? tabIndex : ''" @click="toggleList">
      <div class="palettetypes-selectedtype">
        <palette-type :type="selectedType" />
      </div>
      <div class="palettetypes-selectindicator">
        <span class="fas fa-chevron-down"></span>
      </div>
    </div>
    <ul class="palettetypes-list" :class="listClass">
      <li
        v-for="type in types"
        :key="type.name"
        class="palettetypes-type"
        :class="type.isSelected ? 'palettetypes-type--selected' : ''"
        @click="typeClicked(type)"
      >
        <palette-type :type="type" />
      </li>
    </ul>
  </div>
</template>

<script>
import PaletteType from './PaletteType.vue'

export default {
  name: 'PaletteTypes',
  components: {
    PaletteType,
  },
  props: {
    selectedTypeName: {
      type: String,
      required: true,
    },
    tabIndex: {
      type: Number,
      required: false,
      default: -1,
    },
  },
  data: function () {
    return {
      isListOpen: false,
      types: [
        this.createType('regular', 'regular', 'Regular'),
        this.createType('ordered-sequential', 'sequential', 'Sequential'),
        this.createType('ordered-diverging', 'diverging', 'Diverging'),
      ],
    }
  },
  computed: {
    listClass() {
      return this.isListOpen ? 'palettetypes-list--open' : ''
    },
    selectedType() {
      return this.types.find(x => x.isSelected)
    },
    selectedTypeValue: {
      get() {
        return this.selectedTypeName
      },
      set(newValue) {
        this.$emit('type-selected', newValue)
      },
    },
  },
  watch: {
    selectedTypeName(newValue) {
      this.types.forEach(x => (x.isSelected = x.name === newValue))
    },
    isListOpen(newValue) {
      if (newValue) {
        window.addEventListener('click', this.closeList, false)
      } else {
        window.removeEventListener('click', this.closeList)
      }
    },
  },
  methods: {
    arrowDown() {
      let selectedIndex = this.types.findIndex(x => x.isSelected)
      if (selectedIndex < this.types.length - 1) {
        this.typeSelected(this.types[selectedIndex + 1].name)
      }
    },
    arrowUp() {
      let selectedIndex = this.types.findIndex(x => x.isSelected)
      if (selectedIndex > 0) {
        this.typeSelected(this.types[selectedIndex - 1].name)
      }
    },
    createType(name, classModifier, displayName) {
      return {
        name: name,
        classModifier: classModifier,
        displayName: displayName,
        isSelected: name === this.selectedTypeName,
      }
    },
    closeList() {
      this.isListOpen = false
    },
    toggleList() {
      this.isListOpen = !this.isListOpen
    },
    typeClicked(type) {
      this.typeSelected(type.name)
      this.closeList()
      this.$refs.select.focus()
    },
    typeSelected(typeName) {
      this.$emit('type-selected', typeName)
    },
  },
}
</script>

<style scoped lang="less">
@import '../variables.less';

.palettetypes {
  display: block;
  position: relative;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  height: 3.4rem;
  overflow: visible;

  &-select {
    position: relative;
    background-color: #fff;
    border-radius: 0.2rem;
    box-shadow: @box-shadow;
    z-index: 100;
    user-select: none;

    &:hover {
      box-shadow: @box-shadow-hover;
    }

    &:focus,
    &:focus:hover {
      box-shadow: @box-shadow-active;
    }
  }

  &-selectedtype {
    margin-right: 3rem;
  }

  &-selectindicator {
    position: absolute;
    box-sizing: border-box;
    width: 3rem;
    text-align: center;
    top: 0.6rem;
    right: 0.2rem;
    font-size: 1.8rem;
    color: @tool-colour;
  }

  &-list {
    display: none;
    position: relative;
    list-style: none;
    padding: 0;
    margin: 0;
    border: @border;
    border-radius: 0.2rem;
    background-color: #fff;
    box-shadow: @box-shadow;
    z-index: 99;

    &--open {
      display: block;
    }
  }

  &-type {
    border-top: @border;
    padding-right: 3rem;
    background-color: #fff;

    &:hover {
      background-color: #fafafa;
    }

    &--selected,
    &--selected:hover {
      background-color: @background-colour-selected;
    }
  }
}
</style>
