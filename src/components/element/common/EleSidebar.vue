<template>
  <div class="v-sidebar">
    <el-menu
      class="v-sidebar-el-menu"
      :default-active="onRoutes"
      :collapse="collapse"
      background-color="#324157"
      text-color="#bfcbd9"
      active-text-color="#20a0ff"
      unique-opened
      router>
      <el-menu-item index="/">
        <el-icon><home-filled /></el-icon>
        <span>Home</span>
      </el-menu-item>

      <el-sub-menu index="base">
        <template #title>
          <el-icon><magic-stick /></el-icon>
          <span>Basic Components</span>
        </template>
        <el-menu-item :index="basePath + 'base'">
          <span>Basic Components</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="data">
        <template #title>
          <el-icon><data-board /></el-icon>
          <span>Data Display</span>
        </template>
        <el-menu-item :index="basePath + 'table'">
          <span>Basic Table</span>
        </el-menu-item>
        <el-menu-item :index="basePath + 'tree'">
          <span>Tree Control</span>
        </el-menu-item>
        <el-menu-item :index="basePath + 'timeline'">
          <span>Timeline</span>
        </el-menu-item>
        <el-menu-item :index="basePath + 'progress'">
          <span>Progress Bar</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="navigation">
        <template #title>
          <el-icon><location /></el-icon>
          <span>Navigation</span>
        </template>
        <el-menu-item :index="basePath + 'tabs'">
          <span>Tabs</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="forms">
        <template #title>
          <el-icon><document /></el-icon>
          <span>Form Components</span>
        </template>
        <el-menu-item :index="basePath + 'base-form'">
          <span>Basic Form</span>
        </el-menu-item>
        <el-menu-item :index="basePath + 'upload-file'">
          <span>File Upload</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="draggable">
        <template #title>
          <el-icon><rank /></el-icon>
          <span>Draggable Components</span>
        </template>
        <el-menu-item :index="basePath + 'draggable-list'">
          <span>Draggable List</span>
        </el-menu-item>
        <el-menu-item :index="basePath + 'draggable-dialog'">
          <span>Draggable Dialog</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="charts">
        <template #title>
          <el-icon><pie-chart /></el-icon>
          <span>Charts</span>
        </template>
        <el-menu-item :index="basePath + 'vue-schart'">
          <span>Vue-Schart</span>
        </el-menu-item>
      </el-sub-menu>

      <el-sub-menu index="editors">
        <template #title>
          <el-icon><edit /></el-icon>
          <span>Editors</span>
        </template>
        <el-menu-item :index="basePath + 'codemirror-editor'">
          <span title="CodeMirror-Editor">Code Editor</span>
        </el-menu-item>
        <el-menu-item :index="basePath + 'markdown-editor'">
          <span title="Markdown-Editor">Markdown Editor</span>
        </el-menu-item>
        <el-menu-item :index="basePath + 'quill-editor'">
          <span title="Quill-Editor">Rich Text Editor</span>
        </el-menu-item>
      </el-sub-menu>
      
    </el-menu>
  </div>
</template>

<script>
import { HomeFilled, DataBoard, MagicStick, Location, Edit, Document, Rank, PieChart } from '@element-plus/icons';

export default {
  props: {
    collapse: Boolean,
  },
  data() {
    return {
      basePath: '/element/'
    }
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  components: {
    HomeFilled,
    DataBoard,
    MagicStick,
    Location,
    Edit,
    Document,
    Rank,
    PieChart,
  }
}
</script>

<style scoped>
.v-sidebar {
  position: absolute;
  top: 70px;
  bottom: 0;
  left: 0;
  overflow-y: auto;
  overflow-x: hidden;
  text-align: left;
  display: block;
}
.v-sidebar::-webkit-scrollbar {
  width: 0;
}
.v-sidebar-el-menu {
  height: 100%;
}
.v-sidebar-el-menu:not(.el-menu--collapse) {
  width: 200px;
}
</style>