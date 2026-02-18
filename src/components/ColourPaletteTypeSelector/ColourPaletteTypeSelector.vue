<script setup>
import { computed, ref, watch } from 'vue'
import ColourPaletteTypeSelectorItem from '../ColourPaletteTypeSelectorItem/ColourPaletteTypeSelectorItem.vue'
import { PaletteTypes } from '@/PaletteTypes'
import { ColourPaletteTypeSelectorTestIds } from '@/test-ids/ColourPaletteTypeSelectorTestIds'

const props = defineProps({
  selectedTypeName: {
    type: String,
    required: true,
  },
  tabIndex: {
    type: Number,
    required: false,
    default: -1,
  },
})

const emit = defineEmits(['type-selected'])

const typeSelect = ref(null)
const isListOpen = ref(false)
const types = ref([
  createType(PaletteTypes.regular.id, 'regular', PaletteTypes.regular.name),
  createType(PaletteTypes.sequential.id, 'sequential', PaletteTypes.sequential.name),
  createType(PaletteTypes.diverging.id, 'diverging', PaletteTypes.diverging.name),
])

function createType(name, classModifier, displayName) {
  return {
    name,
    classModifier,
    displayName,
    isSelected: name === props.selectedTypeName,
  }
}

const listClass = computed(() => (isListOpen.value ? 'palettetypes-list--open' : ''))
const selectedType = computed(() => types.value.find(x => x.isSelected))
const selectedTypeName = computed(() => props.selectedTypeName)

function arrowDown() {
  const selectedIndex = types.value.findIndex(x => x.isSelected)
  if (selectedIndex < types.value.length - 1) {
    typeSelected(types.value[selectedIndex + 1].name)
  }
}

function arrowUp() {
  const selectedIndex = types.value.findIndex(x => x.isSelected)
  if (selectedIndex > 0) {
    typeSelected(types.value[selectedIndex - 1].name)
  }
}

function closeList() {
  isListOpen.value = false
}

function toggleList() {
  isListOpen.value = !isListOpen.value
}

function typeClicked(type) {
  typeSelected(type.name)
  closeList()
  typeSelect.value.focus()
}

function typeSelected(typeName) {
  emit('type-selected', typeName)
}

watch(selectedTypeName, newValue => types.value.forEach(x => (x.isSelected = x.name === newValue)))

watch(isListOpen, newValue => {
  if (newValue) {
    window.addEventListener('click', closeList, false)
  } else {
    window.removeEventListener('click', closeList)
  }
})
</script>

<template>
  <div
    class="palettetypes"
    :data-testid="ColourPaletteTypeSelectorTestIds.Self"
    @keyup.down.exact.stop.prevent="arrowDown"
    @keyup.up.exact.stop.prevent="arrowUp"
    @keyup.enter.exact.stop.prevent="toggleList"
    @click.stop
  >
    <div
      ref="typeSelect"
      class="palettetypes-select"
      :tabindex="props.tabIndex >= 0 ? props.tabIndex : ''"
      @click="toggleList"
    >
      <div class="palettetypes-selectedtype" :data-testid="ColourPaletteTypeSelectorTestIds.Selected">
        <ColourPaletteTypeSelectorItem :type="selectedType" />
      </div>
      <div class="palettetypes-selectindicator">
        <span class="fas fa-chevron-down"></span>
      </div>
    </div>
    <ul class="palettetypes-list" :class="listClass" :data-testid="ColourPaletteTypeSelectorTestIds.List">
      <li
        v-for="type in types"
        :key="type.name"
        class="palettetypes-type"
        :class="type.isSelected ? 'palettetypes-type--selected' : ''"
        @click="typeClicked(type)"
      >
        <ColourPaletteTypeSelectorItem :type="type" />
      </li>
    </ul>
  </div>
</template>

<style scoped lang="less">
@import '../../variables.less';

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
    border: @border;
    border-radius: 0.2rem;
    z-index: 100;
    user-select: none;

    &:hover {
      box-shadow: @box-shadow;
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
