<template>
  <div class="palettetype" :class="'palettetype--' + type.classModifier">
    <div :class="'palettetype-example--' + type.classModifier">&nbsp;</div>
    <label class="palettetype-label">{{ type.displayName }}</label>
  </div>
</template>

<script>
export default {
  name: 'PaletteType',
  props: {
    type: {
      type: Object,
      required: true
    }
  }
}
</script>

<style scoped lang="less">
@import '../variables.less';

.palettetype {
  padding: 0.5rem;

  &-label {
    padding-top: 0.2rem;
    display: block;
  }

  &-example {
    box-sizing: border-box;
    width: 100%;
    height: 2rem;
    border: @border;
    font-size: 0;

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
