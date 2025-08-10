<template>
  <div>
    <div class="back-icon float-left" @click="backHome"><el-icon><back /></el-icon></div>
    <div class="project-icon float-left" @click="listProjects()" title="Project List"></div>
    <div v-if="ideInfo.nodeSelected !== null && ideInfo.nodeSelected.type === 'dir'" class="file-icon float-left" @click="newFile()" title="New File"></div>
    <div v-else class="file-icon float-left disable-icon" title="New File"></div>
    <div v-if="ideInfo.nodeSelected !== null && ideInfo.nodeSelected.type === 'dir'" class="folder-icon float-left" @click="newFolder()" title="New Folder"></div>
    <div v-else class="folder-icon float-left disable-icon" title="New Folder"></div>
    <div v-if="ideInfo.nodeSelected !== null" class="rename-icon float-left" @click="rename()" title="Rename"></div>
    <div v-else class="rename-icon float-left disable-icon" title="Rename"></div>
    <div v-if="ideInfo.nodeSelected !== null && ideInfo.nodeSelected.path !== '/'" class="del-icon float-left" @click="delFile()" title="Delete"></div>
    <div v-else class="del-icon float-left disable-icon" title="Delete"></div>
    <div class="status-icon float-left" title="Status" :class="{'el-icon-circle-check': wsInfo.connected, 'el-icon-circle-close': !wsInfo.connected}" :style="{color: wsInfo.connected ? '#52bf53' : '#e15960'}"></div>
    <!-- Bug Report Button -->
    <div class="bug-report-icon float-right" @click="showBugReport = true" title="Report a Bug"></div>
    <!-- Theme Toggle Button -->
    <div class="theme-toggle float-right " @click="toggleTheme" :title="isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'">
      <el-icon v-if="isDarkMode"><moon /></el-icon>
      <el-icon v-else><sunny /></el-icon>
    </div>
    <span>
      <div class="float-right stop-icon" @click="stopAll()" v-if="hasRunProgram" title="Stop all running scripts"></div>
      <!-- <div class="float-right stop-icon-disabled" v-if="!hasRunProgram" title="Stop all running scripts"></div> -->
    </span>
    <span>
      <div class="run-icon float-right" v-if="isPythonFile && !consoleLimit" @click="$emit('run-item')" title="Run current selected script"></div>
      <div class="run-icon-disabled float-right" v-if="!isPythonFile && !consoleLimit" title="Cannot run, current selected file is not a Python file"></div>
    </span>
    <!-- Bug Report Modal -->
    <BugReportModal v-model="showBugReport" />
  </div>
</template>

<script>
import { Back, Moon, Sunny } from '@element-plus/icons';
import BugReportModal from './BugReportModal.vue';
// import * as types from '../../../../store/mutation-types';
const path = require('path');

export default {
  props: {
    consoleLimit: Boolean,
    hasRunProgram: Boolean,
  },
  data() {
    return {
      isRun: true,
      isDarkMode: localStorage.getItem('theme') === 'dark' || true, // Default to dark mode
      showBugReport: false,
    }
  },
  computed: {
    wsInfo() {
      return this.$store.getters['websocket/wsInfo']();
    },
    ideInfo() {
      return this.$store.state.ide.ideInfo;
    },
    isPythonFile() {
      return this.ideInfo.currProj.pathSelected !== null && this.ideInfo.codeItems.length > 0 && this.ideInfo.currProj.pathSelected.endsWith('.py');
      // return this.ideInfo.currProj.pathSelected !== null && this.ideInfo.codeItems.length > 0 && this.ideInfo.currProj.pathSelected.lastIndexOf('.py') === this.ideInfo.currProj.pathSelected.length - 3;
    },
  },
  components: {
    Back,
    Moon,
    Sunny,
    BugReportModal,
  },
  mounted() {
    // Initialize theme on mount
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.isDarkMode = savedTheme === 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
  },
  methods: {
    backHome() {
      this.$router.push('/');
    },
    listProjects() {
      this.$emit('setProjsDialog', {});
    },
    newFile() {
      this.$emit('setTextDialog', {
        type: 'create-file',
        title: 'New File',
        text: '',
        tips: ''
      });
    },
    newFolder() {
      this.$emit('setTextDialog', {
        type: 'create-folder',
        title: 'New Folder',
        text: '',
        tips: ''
      });
    },
    rename() {
      let dialogType = '';
      let dialogTitle = ''; 
      let dialogInputText = '';
      if (this.ideInfo.nodeSelected.path === '/') {
        dialogType = 'rename-project';
        dialogTitle = `Rename Project (${this.ideInfo.currProj.data.name})`
        dialogInputText = `${this.ideInfo.currProj.data.name}`;
      }
      else if (this.ideInfo.nodeSelected.type === 'dir') {
        const name = path.basename(this.ideInfo.nodeSelected.path);
        dialogType = 'rename-folder';
        dialogTitle = `Rename Folder (${this.ideInfo.nodeSelected.path})`
        dialogInputText = `${name}`;
      }
      else {
        const name = path.basename(this.ideInfo.currProj.pathSelected);
        dialogType = 'rename-file';
        dialogTitle = `Rename File (${this.ideInfo.currProj.pathSelected})`
        dialogInputText = `${name}`;
      }
      this.$emit('setTextDialog', {
        type: dialogType,
        title: dialogTitle,
        text: dialogInputText,
        tips: ''
      });
    },
    delFile() {
      this.$emit('setDelDialog', {
        type: '',
        title: `Delete ${path.basename(this.ideInfo.nodeSelected.path)}?`,
        text: '',
        tips: ''
      });
    },
    // run() {
    //   let selected = false;
    //   if (this.ideInfo.consoleSelected.run === false && this.ideInfo.consoleSelected.path === this.ideInfo.currProj.pathSelected) {
    //     selected = true;
    //     this.$store.commit('ide/assignConsoleSelected', {
    //       stop: false,
    //       resultList: []
    //     });
    //   }
    //   else {
    //     for (let i = 0; i < this.ideInfo.consoleItems.length; i++) {
    //       if (this.ideInfo.consoleItems[i].run === false && this.ideInfo.consoleItems[i].path === this.ideInfo.currProj.pathSelected) {
    //         this.$store.commit('ide/setConsoleSelected', this.ideInfo.consoleItems[i]);
    //         selected = true;
    //         this.$store.commit('ide/assignConsoleSelected', {
    //           stop: false,
    //           resultList: []
    //         });
    //         break;
    //       }
    //     }
    //   }
    //   if (selected === false) {
    //     for (let i = 0; i < this.ideInfo.consoleItems.length; i++) {
    //       if (this.ideInfo.consoleItems[i].run === false && !(this.ideInfo.consoleItems[i].name === 'Terminal' && this.ideInfo.consoleItems[i].path === 'Terminal')) {
    //         this.$store.commit('ide/spliceConsoleItems', {start: i, count: 1});
    //         break;
    //       }
    //     }
    //     const item = {
    //       name: path.basename(this.ideInfo.currProj.pathSelected),
    //       path: this.ideInfo.currProj.pathSelected,
    //       resultList: [],
    //       run: false,
    //       stop: false,
    //       id: this.ideInfo.consoleId,
    //     }
    //     this.$store.commit('ide/addConsoleItem', item);
    //     this.$store.commit('ide/setConsoleSelected', item);
    //   }
    //   else {
    //     this.$store.commit('ide/assignConsoleSelected', {
    //       id: this.ideInfo.consoleId
    //     });
    //   }
    //   // for (let i = 0; i < this.ideInfo.consoleItems.length; i++) {
    //   //   if (this.ideInfo.consoleItems[i].run === false && !(this.ideInfo.consoleItems[i].name === 'Terminal' && this.ideInfo.consoleItems[i].path === 'Terminal')) {
    //   //     this.$store.commit('ide/spliceConsoleItems', {start: i, count: 1});
    //   //     break;
    //   //   }
    //   // }
    //   // const item = {
    //   //   name: path.basename(this.ideInfo.currProj.pathSelected),
    //   //   path: this.ideInfo.currProj.pathSelected,
    //   //   resultList: [],
    //   //   run: false,
    //   //   stop: false,
    //   //   id: this.ideInfo.consoleId,
    //   // }
    //   // this.$store.commit('ide/addConsoleItem', item);
    //   // this.$store.commit('ide/setConsoleSelected', item);

    //   if (!this.ideInfo.consoleItems.includes(this.ideInfo.consoleSelected)) {
    //     this.$store.commit('ide/addConsoleItem', this.ideInfo.consoleSelected);
    //   }
    //   this.$store.dispatch(`ide/${types.IDE_RUN_PYTHON_PROGRAM}`, {
    //     msgId: this.ideInfo.consoleId,
    //     filePath: this.ideInfo.currProj.pathSelected,
    //     callback: {
    //       limits: -1,
    //       callback: (dict) => {
    //         this.$store.commit('ide/handleRunResult', dict);
    //       }
    //     }
    //   });
    //   this.$store.commit('ide/setConsoleId', this.ideInfo.consoleId + 1);
    // },
    // stop(consoleId) {
    //   this.$store.dispatch(`ide/${types.IDE_STOP_PYTHON_PROGRAM}`, {
    //     consoleId: consoleId,
    //     callback: {
    //       limits: -1,
    //       callback: (dict) => {
    //         this.$store.commit('ide/handleStopResult', {
    //           consoleId: consoleId,
    //           dict: dict
    //         });
    //       }
    //     }
    //   });
    // },
    stopAll() {
      for (let i = 0; i < this.ideInfo.consoleItems.length; i++) {
        if (this.ideInfo.consoleItems[i].run === true) {
          this.$emit('stop-item', this.ideInfo.consoleItems[i].id);
          // this.stop(this.ideInfo.consoleItems[i].id);
        }
      }
      this.$emit('stop-item', null);
      // this.stop(null);
    },
    toggleTheme() {
      this.isDarkMode = !this.isDarkMode;
      const theme = this.isDarkMode ? 'dark' : 'light';
      localStorage.setItem('theme', theme);
      document.documentElement.setAttribute('data-theme', theme);
      this.$emit('theme-changed', theme);
    }
  }
}
</script>

<style scoped>
.back-icon {
  margin-top: 12px;
  margin-right: 10px;
  margin-left: 10px;
  font-size: 24px;
}
.project-icon {
  margin-left: 17px;
  margin-top: 17px;
  width: 32px;
  height: 32px;
  background-image: url('~@/assets/img/ide/btn_addproject.svg');
  background-size: 18px 16px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.folder-icon {
  margin-left: 20px;
  margin-top: 9px;
  width: 32px;
  height: 32px;
  background-image: url('~@/assets/img/ide/btn_addfolder.svg');
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.file-icon {
  margin-left: 10px;
  margin-top: 9px;
  width: 32px;
  height: 32px;
  background-image: url('~@/assets/img/ide/icon_addfile.svg');
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.rename-icon {
  margin-left: 20px;
  margin-top: 9px;
  width: 32px;
  height: 32px;
  background-image: url('~@/assets/img/ide/btn_rename.svg');
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.del-icon {
  margin-left: 20px;
  margin-top: 9px;
  width: 32px;
  height: 32px;
  background-image: url('~@/assets/img/ide/btn_trash.svg');
  background-size: 24px 24px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.status-icon {
  margin-left: 20px;
  margin-top: 15px;
  width: 32px;
  height: 32px;
  color: '#52bf53';
  font-size: 24px;
}
.disable-icon {
  opacity: 0.3;
  cursor: not-allowed;
}
.stop-icon {
  margin-right: 20px;
  margin-top: 13px;
  width: 24px;
  height: 24px;
  color: #656666;
  background-image: url('~@/assets/img/ide/icon_stop.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.stop-icon-disabled {
  margin-right: 20px;
  margin-top: 13px;
  width: 24px;
  height: 24px;
  background-image: url('~@/assets/img/ide/icon_stop_gray.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.run-icon {
  margin-right: 30px;
  margin-top: 13px;
  width: 24px;
  height: 24px;
  background-image: url('~@/assets/img/ide/icon_running.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.run-icon-disabled {
  margin-right: 30px;
  margin-top: 13px;
  width: 24px;
  height: 24px;
  background-image: url('~@/assets/img/ide/icon_running_gray.svg');
  background-size: 20px 20px;
  background-repeat: no-repeat;
  background-position: center;
  cursor: pointer;
}
.theme-toggle {
  margin-right: 15px;
  margin-top: 13px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #fff;
  font-size: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
}
.theme-toggle:hover {
  transform: scale(1.1);
  color: #409eff;
}
.bug-report-icon {
  margin-right: 15px;
  margin-top: 13px;
  width: 32px;
  height: 32px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 4px;
}
.bug-report-icon::before {
  content: '🐛';
  font-size: 24px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.bug-report-icon:hover {
  transform: scale(1.1);
}
.bug-report-icon:hover::before {
  content: '🔴';
}
</style>