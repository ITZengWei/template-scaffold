import { message } from 'antd'

/** 策略方法 */
type ValidatorFn = (value: string) => boolean

/** 策略集合 */
interface IStrategy {
  /* 验证非空 */
  notEmpty: ValidatorFn
  /* 验证整数 */
  validNumber: ValidatorFn
  /* 验证电话 */
  validTel: ValidatorFn
  /* 验证邮箱 */
  validEmail: ValidatorFn

  [validatorFn: string]: ValidatorFn
}

interface FormStrategyResult {
  /** 使用策略方法 */
  useStrategy: (type: string, val?: string) => boolean

  /** 添加策略方法 */
  addStrategy: (strategyName: string, validFn: ValidatorFn) => void
}

/** 表单策略 */
function FormStrategy(): FormStrategyResult {
  /* 验证手机的正则 */
  const telReg = /^\d{11}$/

  /* 数字正则 */
  const numReg = /^[0-9]+$/

  /* 邮箱正则 */
  const emailReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/

  /* 身份证正则 */
  // const idCardReg = /^\d{18}|\d{15}$/

  const strategy: IStrategy = {
    notEmpty(val) {
      return val !== ''
    },
    validNumber(num) {
      return numReg.test(num)
    },
    validTel(tel) {
      return telReg.test(tel)
    },
    validEmail(email) {
      return emailReg.test(email)
    },
  }

  /* 使用策略模式方法 */
  function useStrategy(type: string, val?: string) {
    /* 为 val 去除首尾空格 */
    val = val === undefined ? '' : String(val).trim()

    /* 如果有这个方法我们就调用 */
    return strategy[type] && strategy[type](val)
  }

  /* 添加策略 */
  function addStrategy(strategyName: string, validFn: ValidatorFn) {
    const oldStrategy = strategy[strategyName]
    /* 检查有没有这个策略 */
    if (typeof oldStrategy === 'function') {
      strategy[strategyName] = function (val) {
        /* 为 val 去除首尾空格 */
        val = val === undefined ? '' : String(val).trim()

        return oldStrategy.call(null, val) && validFn.call(null, val)
      }
    } else {
      strategy[strategyName] = validFn
    }
  }

  /* 将使用和添加策略的方法抛出 */
  return { useStrategy, addStrategy }
}

// const formStrategy = new FormStrategy()

const formStrategy = FormStrategy()

interface ValidatorFieldProps {
  type?: string
  value: any
  msg: string
}
export function handleValidatorFields(validatorFields: ValidatorFieldProps[]) {
  /** 验证结果默认为全部都验证成功 */
  let result = true
  const len = validatorFields.length
  for (let i = 0; i < len; i++) {
    const { type = 'notEmpty', value, msg } = validatorFields[i]
    if (formStrategy.useStrategy(type, value) === false) {
      message.warning(msg)
      result = false
      break
    }
  }

  return result
}

export default formStrategy
