<template>
    <div>
        <div class="palette-name">
            <input type="text" v-model="palette.name" placeholder="Enter a palette name" @keyup.enter="blurName" />
        </div>
        <colour-list 
            :colours="palette.colours"
            @select-colour="selectColour"
            @remove-colour="removeColour" />
        <ul class="palette-actions">
            <li class="import">
                <a @click.prevent.stop class="button fas fa-file-import" title="Import XML" href="#"></a>
            </li>
            <li class="code">
                <a @click.prevent.stop class="button fas fa-code" title="Get code" href="#"></a>
            </li>
            <li class="discard">
                <a @click.prevent.stop="discard" class="button fas fa-trash-alt" title="Delete palette" href="#"></a>
            </li>
            <li class="add">
                <a @click.prevent.stop="add" class="button fas fa-plus" title="Add colour" href="#"></a>
            </li>
        </ul>
    </div>
</template>

<script>
import ColourList from './ColourList.vue'

export default {
  name: 'ColourPalette',
  props: {
    //msg: String
  },
  props: {
      palette: {
          type: Object,
          required: true
      }
  },
  computed: {
      selectedColourIndex () {
          return this.palette.colours.findIndex(x => x.isSelected);
      }
  },
  components: {
      ColourList
  },
  methods: {
      add () {
          this.$emit('add-colour');
      },
      blurName (event) {
          event.target.blur();
      },
      selectColour (colour) {
          this.$emit('select-colour', colour);
      },
      removeColour (colour) {
          this.$emit('remove-colour', colour);
      },
      discard () {
          this.$emit('discard-palette');
      },
      keyUp (event) {
          if (event.target.tagName.toLowerCase() !== 'body')  {
              return;
          }

          let index = -1;

          switch (event.key) {
              case '+':
                this.add();
                return;

                case 'Down':
                case 'ArrowDown':
                    index = this.selectedColourIndex;
                    if (index < this.palette.colours.length - 1) {
                        this.selectColour(this.palette.colours[index + 1]);
                    }
                    return;

                case 'Up':
                case 'ArrowUp':
                    index = this.selectedColourIndex;
                    if (index > 0) {
                        this.selectColour(this.palette.colours[index - 1]);
                    }
                    return;
          }
      }
  },
  created: function() {
      window.addEventListener('keyup', this.keyUp, false);
  },
  destroyed () {
      window.removeEventListener('keyup', this.keyUp);
  }
}
</script>

<style scoped lang="less">
@import "./../variables.less";

.palette-name {
    border-bottom: @border;
    padding: 1rem;
    box-sizing: border-box;
    height: 5rem;
    font-size: 2rem;

    input { 
        width: 100%; 
        border: none;
        background-color: transparent;
        font-weight: bold;
        font-size: 1.5rem;
    }
    input:focus {
        font-weight: normal;
        background-color: #fff;
        border: @border;
    }
}
ul.palette-actions {
    display: block;
    list-style: none;
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 3rem;
    line-height: 2.9rem;
    border-bottom: @border;
    text-align: right;
    overflow: hidden;

    > li {
        display: inline-block;
        height: 2.9rem;
        border-left: @border;
        width: 3rem;
        text-align: center;
        font-size: 1.7rem;

        &.add {
            font-size: 1.9rem;
            padding-top: 0.1rem;
        }
    }
}

</style>