import { createGlobalStyle } from 'styled-components'

/** 基础样式 */
const basicStyle = createGlobalStyle`
  html::-webkit-scrollbar {
    width: 8px;
    height: 1px;
  }
  html::-webkit-scrollbar-thumb {

    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #999;
  }

  html::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
    
  }

  body{
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    font-size: 16px;
    color: #363636;
    background-color: #fff;
  }

  /** 控制侧边栏显示与隐藏的抽屉 */
  .ctr-aside-drawer {
    .ant-drawer-body {
      padding: 0 !important;
    }
  }

    /** 滚动的 */
  
  /* 滚动组件容器 */
  .scroll-container {
    width: 100%;
    height: 100%;
    overflow: hidden;

    /* 上拉加载组件 */
    .pull-up-loading {
      position: absolute;
      left: 0;
      right: 0;
      bottom: 5px;
      width: 60px;
      height: 60px;
      margin: auto;
      z-index: 100;
    }

    /* 下拉加载组件 */
    .pull-down-loading {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      height: 30px;
      margin: auto;
      z-index: 100;
    }
  }

  /** 拖拽 */
  .row-dragging {
    background: #fafafa;
    border: 1px solid #ccc;
  }

  .row-dragging td {
    padding: 16px;
    visibility: hidden;
  }

  .row-dragging .drag-visible {
    visibility: visible;
  }
`

export default basicStyle
