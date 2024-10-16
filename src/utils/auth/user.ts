import { setLocal, getLocal, removeLocal } from '../storage';

/** 设置token */
export function setToken(token: string) {
	console.log('设置token');
	console.log(token);
  setLocal('token', token);
}

/** 获取token */
export function getToken() {
  const token = getLocal<string>('token') || '';
  return token;
}

/** 去除token */
export function removeToken() {
  removeLocal('token');
}

/** 获取refresh token */
// export function getRefreshToken() {
//   return getLocal<string>(EnumStorageKey['refresh-token']) || '';
// }

/** 设置refresh token */
// export function setRefreshToken(token: string) {
//   setLocal(EnumStorageKey['refresh-token'], token);
// }

/** 去除refresh token */
// export function removeRefreshToken() {
//   removeLocal(EnumStorageKey['refresh-token']);
// }

/** 获取用户信息 */
export function getUserInfo() {
  const emptyInfo: Auth.UserInfo = {
    id: '',
    account: '',
    addr: '',
    token: '',
    userRole: 'normal',
    avatar: '1'
  };
  const userInfo: Auth.UserInfo = getLocal<Auth.UserInfo>('user-info') || emptyInfo;
  console.log('getUserInfo:',userInfo)
  return userInfo;
}

/** 设置用户信息 */
export function setUserInfo(userInfo: Auth.UserInfo) {
  setLocal('user-info', userInfo);
}

/** 去除用户信息 */
export function removeUserInfo() {
  removeLocal('user-info');
}

/** 去除用户相关缓存 */
export function clearAuthStorage() {
  removeToken();
  //removeRefreshToken();
  removeUserInfo();
}
