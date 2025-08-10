<template>
  <div class="console-div">
    <div class="console-sidebar">
      <div class="run-icon float-right" v-if="item.run === false && !(item.name === 'Terminal' && item.path === 'Terminal')" @click="$emit('run-item')" title="Re-run the script pointed to by the current console"></div>
      <div class="stop-icon float-right" v-if="item.run === true" @click="$emit('stop-item', item.id)" title="Stop the script or command running in the current console"></div>
    </div>
    <textarea
      readonly="readonly"
      :id="'console-'+item.id"
      type="textarea"
      class="console-area"
      :value="content"
      @input="$emit('input', $event.target.value)">
    </textarea>
  </div>
</template>

<script>
export default {
  props: {
    item: Object,
  },
  mounted() {
    // this.resize();
    // window.addEventListener('resize', this.resize);
  },
  computed: {
    content() {
      if (this.item.run && this.item.resultList.length >= 20) {
        return this.item.resultList.slice(this.item.resultList.length - 20).join('\n') + '\n';
      }
      else {
        return this.item.resultList.join('\n') + '\n';
      }
    }
  },
  watch: {
    content(cur, old) {
      this.scroll();
    }
  },
  methods: {
    scroll() {
      const textArea = document.getElementById('console-' + this.item.id)
      if (textArea !== undefined && textArea !== null) {
        textArea.scrollTop = textArea.scrollHeight;
      }
    },
    resize() {
      const ele= document.getElementById('console-' + this.item.id)
      if (ele !== undefined && ele !== null) {
        ele.style.width = `${window.innerWidth - 225}px`;
      }
    }
  }
}
</script>

<style scoped>
.console-div {
  position: relative;
  width: 100%;
  height: calc(200px - 30px);
  left: 0px;
  bottom: 0px;
  display: flex;
  /* width: calc(100% - 205px); */
}
.console-sidebar {
  width: 20px;
  height: 100%;
  background: #3A3D41;
  flex-shrink: 0;
}
.console-area {
  /* background: #313131; */
  background: #232323;
  /* width: 70%; */
  color: white;
  /* width: 200px; */
  /* border: 1px #e1e4e8 solid; */
  border: 0px solid black;
  outline: none;
  resize: none;
  width: calc(100% - 20px);
  flex: 1;
  height: 100%;
  /* height: 100%; */
  /* bottom: 10px; */
  overflow-x: auto;
  overflow-y: auto;
  padding: 8px;
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 13px;
  line-height: 1.4;
  box-sizing: border-box;
}
.run-icon {
  margin-right: 3px;
  margin-top: 2px;
  width: 16px;
  height: 16px;
  background-image: url('./../../../../assets/img/ide/icon_running.svg');
  cursor: pointer;
}
.stop-icon {
  margin-right: 3px;
  margin-top: 2px;
  width: 16px;
  height: 16px;
  background-image: url('./../../../../assets/img/ide/icon_stop.svg');
  cursor: pointer;
}

.console-area::-webkit-scrollbar {/*scrollbar overall style*/
  width: 5px;     /* height and width correspond to horizontal and vertical scrollbar dimensions */
  height: 5px;
}
.console-area::-webkit-scrollbar-thumb {/*small block inside scrollbar*/
  /* background: #87939A; */
  background: #545a5e;
}
.console-area::-webkit-scrollbar-track {/*track inside scrollbar*/
  background: #2F2F2F;
}
</style>


