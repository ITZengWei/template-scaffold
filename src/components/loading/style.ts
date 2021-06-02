import styled from 'styled-components'

/** 初始化加载组件盒子 */
export const InitLayoutLoadingWrapper = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .logo {
    width: 66px;
    height: 66px;
  }

  .icon {
    margin: 100px 0;
  }

  .tip {
    color: rgba(0, 0, 0, 0.85);
    font-size: 24px;
  }
`
