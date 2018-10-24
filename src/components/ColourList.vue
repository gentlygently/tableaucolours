<template>
    <ul class="colourlist">
        <draggable v-model="colours">
            <Colour
                v-for="colour in colours"
                :key="colour.id"
                :colour="colour"
                @select="select"
                @remove="remove"
                class="colourlist-colour"
            />
        </draggable>
    </ul>
</template>

<script>
import Colour from "./Colour.vue";
import draggable from "vuedraggable";

export default {
  name: "ColourList",
  props: {
    colours: {
      type: Array,
      required: true
    }
  },
  components: {
    Colour,
    draggable
  },
  methods: {
    select(colour) {
      this.$emit("select-colour", colour);
    },
    remove(colour) {
      this.$emit("remove-colour", colour);
    }
  }
};
</script>

<style scoped lang="less">
.colourlist {
  margin: 0;
  padding: 0;

  &-colour {
    display: block;
    position: relative;
  }
}
</style>