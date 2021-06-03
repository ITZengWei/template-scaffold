import styled from 'styled-components'
import { SettingStyle, ToolStyle } from '../../styles/index'

/** 容器盒子样式 */
export const ContainerWrapper = styled.div``

/** 头部容器盒子内部样式 */
export const ContainerHeaderInner = styled.div`
  .top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    line-height: 50px;
    overflow-x: hidden;
    overflow-y: hidden;
    border-bottom: 1px solid ${SettingStyle['theme-color']};
    font-size: 14px;
    user-select: none;

    .toggle {
      font-size: 20px;
      cursor: pointer;
      margin-right: 24px;
      ${ToolStyle.extendClick()};

      &:hover {
        color: ${SettingStyle['theme-color']};
      }
    }

    .options {
      display: flex;
      /* flex: 1; */
      justify-content: flex-end;
      align-items: center;

      min-width: 105px;
      flex-shrink: 0;
      .nickname {
        user-select: text;
        color: ${SettingStyle['theme-color']};
        cursor: pointer;
      }

      .avatar {
        margin: 0 3px;
      }
    }
  }
  .bottom {
    height: 40px;
    line-height: 40px;

    .routerHistory__inner {
      box-sizing: content-box;
      display: flex;
      align-items: center;
      padding-right: 10px;
    }

    .date {
      font-size: 13px;
      cursor: pointer;
      text-align: right;
    }
  }

  &::after {
    content: '';
    position: absolute;
    left: 60px;
    bottom: -24px;
    border: 12px solid transparent;
    border-top-color: ${SettingStyle['highlight-background-color']};
  }
`

/** 侧边栏容器盒子内部样式 */
export const ContainerAsideInner = styled.div`
  height: 100%;
  .info {
    &__logo {
      display: block;
      width: 100%;
      max-height: 105px;
    }

    &__title {
      font-size: 18px;
      color: ${SettingStyle['theme-color']};
      line-height: 50px;
      font-weight: bold;
      margin: 0;
      text-align: center;
      background-color: #001529;
      cursor: pointer;

      &--light {
        background-color: #fff;
      }
    }
  }
  /** 菜单占位 */
  .menu-placeholder {
    display: flex;
    flex-wrap: wrap;
    padding-left: 24px;
    padding-right: 20px;
    line-height: 40px;

    .text {
      flex: 1;
      margin-left: 3px;
      height: 18px;
    }
  }
`

/** 面包屑盒子内部样式 */
export const ContainerBreadcrumbInner = styled.div`
  flex: 1;
  .ant-breadcrumb {
    white-space: nowrap;
  }
`

/** 主容器盒子内部样式 */
export const ContainerMainInner = styled.div`
  /* position: absolute;
  left: 0;
  top: 0;
  right: 0; */
  margin: 24px 16px;
  min-height: 360px;
`

/** 底部容器盒子内部样式 */
export const ContainerFooterInner = styled.div`
  text-align: center;
  line-height: 20px;

  span {
    margin: 5px;
  }

  a {
    color: inherit;
  }
`
