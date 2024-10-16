//@ts-nocheck
import { NO_ERROR_MSG_CODE, ERROR_MSG_DURATION } from '@/config';
import { consoleWarn } from '../common';
import i18n from '../../language';
import mitter from '../bus';

/** 错误消息栈，防止同一错误同时出现 */
const errorMsgStack = new Map<string | number, string>([]);

function addErrorMsg(error: Service.RequestError) {
  errorMsgStack.set(error.code, error.msg);
}
function removeErrorMsg(error: Service.RequestError) {
  errorMsgStack.delete(error.code);
}
function hasErrorMsg(error: Service.RequestError) {
  return errorMsgStack.has(error.code);
}

/**
 * 显示错误信息
 * @param error
 */
export function showErrorMsg(error: Service.RequestError) {
  if (!error.code) return;
  if (!NO_ERROR_MSG_CODE.includes(error.code)) {
    if (!hasErrorMsg(error)) {
      addErrorMsg(error);
      consoleWarn(error.code, error.msg);
      if (error.code === 1020) {
        mitter.emit('loginOut');
        return;
      }
      if(error.code === 901){ //特殊处理
        window.$message?.error(i18n.global.t(9011), { duration: ERROR_MSG_DURATION });
        return
      }
      if(error.code === 30323){
        window.$message?.error(i18n.global.t(30323), { duration: ERROR_MSG_DURATION });
        return
      }
      window.$message?.error(i18n.global.t(error.msg), { duration: ERROR_MSG_DURATION });
      setTimeout(() => {
        removeErrorMsg(error);
      }, ERROR_MSG_DURATION);
    }
  }
}
