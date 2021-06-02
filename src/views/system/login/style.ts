import styled from 'styled-components'

/* 引入广告图片 */
import brandBg from '../../../asserts/images/brand_bg.jpg'

/** 登录注册容器 */
export const LoginWithRegisterContainer = styled.div`
  display: flex;
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-image: url(${brandBg});
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
`

/** 大图广告区域 */
export const BrandWra = styled.div`
  box-sizing: border-box;
  flex: 4;
  background-color: rgba(0, 0, 0, 0.4);
  padding: 30px 30px 30px 200px;
  .brandInfo__title {
    margin: 220px 0 22px 0;
    max-width: 688px;

    font-size: 48px;
    font-weight: 400;
    color: #fff;
    letter-spacing: 15px;
    text-transform: uppercase;
  }
  .brandInfo__subtitle {
    margin: 10px 0;
    font-size: 16px;
    max-width: 688px;

    color: #fff;
    line-height: 1.58;
    opacity: 0.6;
  }
`

/** 表单区域 */
export const FormAreaWra = styled.div`
  display: flex;
  justify-content: center;
  flex: 2;
  box-sizing: border-box;
  background-color: #fff;
  /* background-color: rgba(255, 255, 255, 0.6); */

  padding: 150px 10px 0;
  box-sizing: content-box;
  user-select: none;

  /** 表单标题样式 */
  .formArea__title {
    width: 350px;
    color: #303133;
    font-weight: bold;
    margin-bottom: 15px;
  }

  /** 表单内部字体颜色 */
  .site-form-item-icon {
    color: rgba(0, 0, 0, 0.25);
  }

  /** 表单项样式 */
  .formArea__item {
    margin-bottom: 25px;

    /** 验证码特殊 */
    /* &--code {
      display: flex;
      align-items: center;
    } */
  }

  /** 登录表单样式 */
  .login-form {
    width: 350px;
    .to-login {
      margin-top: -10px;
      margin-bottom: 10px;
      text-align: right;
    }
  }

  /** 注册表单样式 */
  .register-form {
    width: 350px;
    .to-register {
      margin-top: -10px;
      margin-bottom: 10px;
      text-align: right;
    }
  }
`
