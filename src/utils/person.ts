import { IUserType, IUserInfo, IAudit } from '../store/module/user/reducer'

/** 获取用户类型 */
export function getUserType(user: IUserInfo): IUserType {
  const { audit, type } = user
  /** 申请为超级管理员，并且审核通过 */
  if (audit === IAudit.agree && type === IUserType.superAdmin) {
    return IUserType.superAdmin
  }
  /** 申请为管理员，并且审核通过 */
  if (audit === IAudit.agree && type === IUserType.admin) {
    return IUserType.admin
  }

  return IUserType.common
}
