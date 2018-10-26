<template>
  <li
    class="colour"
    :class="activeClass"
    @click="click"
    :title="colour.colour"
    :style="{ 'grid-column': column, 'grid-row': row }"
  >
    <div class="colour-swatch" :style="{ 'background-color': colour.colour }"></div>
    <div class="colour-remove" @click.prevent.stop="remove">
      <span class="fas fa-times"></span>
    </div>
  </li>
</template>

<script>
export default {
  name: 'Colour',
  props: {
    colour: {
      type: Object,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  computed: {
    activeClass () {
      return this.colour.isSelected ? 'colour--selected' : ''
    },
    column () {
      return Math.floor(this.index / 5) + 1
    },
    row () {
      return (this.index % 5) + 1
    }
  },
  methods: {
    click () {
      this.$emit('select', this.colour)
    },
    remove () {
      console.log('remove')
      this.$emit('remove', this.colour)
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.colour {
  display: block;
  box-sizing: border-box;
  width: 5rem;
  height: 5rem;
  padding: 0.5rem;
  list-style: none;
  background-color: #fff;
  border-radius: 0.2rem;
  box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour;
  position: relative;

  &:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour-hover;
  }

  &--selected,
  &--selected:hover {
    box-shadow: 0rem 0rem 0.2rem 0.2rem @border-colour-active;
  }

  &:hover .colour-remove {
    display: block;
  }

  &--dragging .colour-remove,
  &--dragging:hover .colour-remove {
    display: none;
  }

  &-swatch {
    border: @border;
    border-radius: 0.2rem;
    height: 100%;
    box-sizing: border-box;
  }

  &-remove {
    display: none;
    position: absolute;
    top: -0.75rem;
    right: -0.75rem;
    width: 2rem;
    height: 2rem;
    border-radius: 50%;
    font-size: 1.5rem;
    line-height: 1.9rem;
    text-align: center;
    padding-left: 0.1rem;
    color: #fff;
    background-color: #e94544;
    box-sizing: border-box;
    box-shadow: 0rem 0rem 0.1rem 0.1rem #fff;
    z-index: 1;
  }
}
</style>
