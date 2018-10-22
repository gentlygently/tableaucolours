<template>
    <div class="colourpalette">
        <div class="colourpalette-name">
            <input type="text" v-model="palette.name" placeholder="Enter a palette name" @keyup.enter="blurName" />
        </div>
        <div class="colourpalette-type">
            <label for="type">Type</label>
            <select name="type" v-model="palette.type">
                <option>regular</option>
                <option>ordered-sequential</option>
                <option>ordered-diverging</option>
            </select>
        </div>
        <colour-list 
            :colours="palette.colours"
            @select-colour="selectColour"
            @remove-colour="removeColour" />
        <ul class="colourpalette-actions">
            <!-- TODO: Put these in a separate component? -->
            <li class="import">
                <button @click.prevent.stop class="icon-button fas fa-file-import" title="Import XML"></button>
            </li>
            <li class="code">
                <button @click.prevent.stop="codeModalOpen = true" class="icon-button fas fa-code" title="Get code"></button>
            </li>
            <li class="discard">
                <button @click.prevent.stop="discard" class="icon-button fas fa-trash-alt" title="Delete palette"></button>
            </li>
            <li class="add">
                <button @click.prevent.stop="add" class="icon-button fas fa-plus" title="Add colour"></button>
            </li>
        </ul>
        <modal v-if="codeModalOpen" width="54rem" @close="codeModalOpen = false">
            <get-code :palette="palette" />
        </modal>
    </div>
</template>

<script>
import ColourList from './ColourList.vue'
import GetCode from './GetCode.vue'
import Modal from './Modal.vue'

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
  data: function() {
      return {
          codeModalOpen: false
      };
  },
  computed: {
      selectedColourIndex () {
          return this.palette.colours.findIndex(x => x.isSelected);
      }
  },
  components: {
      ColourList, 
      GetCode,
      Modal
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
@import "../variables.less";

.colourpalette {
    &-name {
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
    &-type {
        padding: 1rem;
        display: flex;
        flex-flow: row nowrap;
        align-items: flex-start;
        align-content: stretch;
        border-bottom: @border;

        label {
            display: block;
            font-size: 1.2rem;
            font-weight: bold;
            margin-right: 0.5rem;
            flex-grow: 0;
            flex-shrink: 0;
            line-height: 2.3rem;
        }

        select {
            font-size: 1.2rem;
            border: @border;
            border-radius: 0.2rem;
            background-color: transparent;
            padding: 0.3rem;
            display: block;
            flex-grow: 1;
        }
    }
    &-actions {
        display: block;
        list-style: none;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
        height: 3rem;
        border-bottom: @border;
        text-align: right;
        overflow: hidden;

        > li {
            display: inline-block;
            height: 2.9rem;
            border-left: @border;
            width: 3rem;
            text-align: center;
            white-space: nowrap;

            .icon-button {
                font-size: 1.7rem;
                line-height: 2.9rem;
            }

            &.add {
                padding-top: 0.1rem;
                .icon-button {
                    font-size: 1.9rem;
                }
            }
        }
    }
}


</style>