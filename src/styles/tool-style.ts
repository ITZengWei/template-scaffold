// 扩展点击范围
export const extendClick = () => {
  return `
    position: relative;
    &:before{
      content: '';
      position: absolute;
      top: -10px; bottom: -10px; left: -10px; right: -10px;
    };
  `
}

// 文本溢出省略号
export const noWrap = () => {
  return `
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  `
}

// 文本一处省略号(行数)
export const noWrapWithLine = (line: number) => {
  return `
  	display: -webkit-box; /* 必须结合的属性 ，将对象作为弹性伸缩盒子模型显示  */
    -webkit-line-clamp: ${line};  /* 用来限制在一个块元素显示的文本的行数 */
    -webkit-box-orient: vertical;  /* 必须结合的属性 ，设置或检索伸缩盒对象的子元素的排列方式  */
    overflow: hidden;
  `
}

// 背景铺满全屏
export const bgFull = () => {
  return `
    background-position: 50%;
    background-size: contain;
    background-repeat: no-repeat;
  `
}

/** 滚动条修饰 */
export const scrollDecorator = (height: number, width?: number) => {
  return `
  &::-webkit-scrollbar {
    width: ${width ?? 8}px;
    height: ${height}px;
  }
  &::-webkit-scrollbar-thumb {

    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #999;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    background: #ededed;
  }
  `
}
