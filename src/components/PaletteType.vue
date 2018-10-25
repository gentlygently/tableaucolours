<template>
  <li class="palettetype" :class="selectedClass" @click="$emit('type-selected', type.name)">
    <div :class="'palettetype--' + type.classModifier">
      <div :class="'palettetype-example--' + type.classModifier">&nbsp;</div>
      <label class="palettetype-label">{{ type.displayName }}</label>
    </div>
  </li>
</template>

<script>
export default {
  name: 'PaletteType',
  props: {
    type: {
      type: Object,
      required: true
    }
  },
  computed: {
    selectedClass () {
      return this.type.isSelected ? 'palettetype--selected' : ''
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.palettetype {
  border: @border;
  border-color: transparent;
  border-width: 0.2rem;
  padding: 0.5rem;
  background-color: #fff;
  border-radius: 0.2rem;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;

  &:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour-hover;
  }

  &--selected,
  &--selected:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour-active;
  }

  &-label {
    padding-top: 0.2rem;
    display: block;
  }

  &-example {
    box-sizing: border-box;
    height: 2rem;
    border: @border;

    &--regular {
      background: linear-gradient(
        to right,
        #000,
        #000 25%,
        #555 25%,
        #555 50%,
        #aaa 50%,
        #aaa 75%,
        #eee 75%,
        #eee 100%
      );
    }

    &--sequential {
      background: linear-gradient(to right, #eee, #000);
    }

    &--diverging {
      background: linear-gradient(to right, #000, #eee, #555);
    }
  }
}
</style>
