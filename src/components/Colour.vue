<template>
    <li class="colour" :class="activeClass" @click="click">
        <colour-swatch :colour="colour.colour" class="colour-swatch"/>
        <colour-picker :colour="colour.colour" class="colour-picker"/>
        <button
            @click.prevent.stop="remove"
            class="colour-remove icon-button fas fa-times"
            title="Delete colour"
        ></button>
    </li>
</template>

<script>
import ColourPicker from "./ColourPicker.vue";
import ColourSwatch from "./ColourSwatch.vue";

export default {
  name: "Colour",
  props: {
    colour: {
      type: Object,
      required: true
    }
  },
  computed: {
    activeClass() {
      return this.colour.isSelected ? "colour--active" : "";
    }
  },
  components: {
    ColourPicker,
    ColourSwatch
  },
  methods: {
    click() {
      this.$emit("select", this.colour);
    },
    remove() {
      this.$emit("remove", this.colour);
    }
  }
};
</script>

<style scoped lang="less">
@import "../variables.less";

.colour {
  border-bottom: @border;
  padding: 0.5rem 1rem 0.5rem 1.5rem;
  margin: 0;
  list-style: none;
  line-height: 3.5rem;

  &--active {
    background-color: #d7d5d3;
    border-color: #c7c5c3;
  }

  &:hover .colour-remove {
    display: block;
  }

  &-swatch {
    display: inline-block;
    width: 3.5rem;
    height: 3.5rem;
    box-sizing: border-box;
  }

  &-picker {
    display: inline-block;
    margin-left: 1rem;
  }

  &-remove {
    display: none;
    float: right;
    width: 1.5rem;
    font-size: 2rem;
    line-height: 3.5rem;
  }
}
</style>