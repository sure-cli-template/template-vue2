import { ref } from 'vue';
import axios from 'axios';
import { Message } from 'element-ui';

const defaultMsg = '网络错误，请稍后再试！';

const axiosInstance = axios.create({
  // 创建 axios 实例，这里可以设置请求的默认配置
  timeout: 5000,
  withCredentials: true
});

const httpCode = {
  400: '请求参数错误',
  401: '权限不足',
  403: '服务器拒绝本次访问',
  404: '请求资源未找到',
  500: '内部服务器错误',
  501: '服务器不支持该请求中使用的访问',
  502: '网关错误',
  504: '网关超时'
};

const useRequest = (url, config = {}) => {
  const loading = ref(false);
  const method = config.method?.toLocaleLowerCase();
  const { skipErrorTip, needCompleteRes } = config;
  const request = async (params = {}) => {
    loading.value = true;
    try {
      const response = await axiosInstance({
        url,
        params: method === 'get' ? params : null,
        data: method === 'post' ? params : null,
        ...config
      });
      const res = response.data;

      if (needCompleteRes) {
        // 需要完整的返回值，包括状态码等
        return Promise.resolve(res);
      }

      if (isDataSuccess(res)) {
        return Promise.resolve(getResultData(res));
      } else {
        if (!skipErrorTip) {
          // 如果没有跳过提示，则进行全局toast提示
          errorHandle(getResultMsg(res));
        }
        return Promise.reject(getResultMsg(res));
      }
    } catch (error) {
      if (error.response) {
        const tips = error.response.status in httpCode ? httpCode[error.response.status] : error.response.data.message;
        errorHandle(tips || defaultMsg);
        return Promise.reject(tips || defaultMsg);
      } else {
        errorHandle(defaultMsg);
        return Promise.reject(defaultMsg);
      }
    } finally {
      loading.value = false;
    }
  };
  return [request, loading];
};

// 统一判断接口状态
function isDataSuccess(data) {
  const codeKeys = ['code', 'status', 'bizCode'];
  const successCodeVal = [0, 200];
  for (const codeKey of codeKeys) {
    if (Object.prototype.hasOwnProperty.call(data, codeKey) && successCodeVal.includes(+data[codeKey])) {
      return true;
    }
  }
  return false;
}

/* 返回接口的数据 */
function getResultData(res) {
  const dataKeys = ['result', 'data'];
  for (const key of dataKeys) {
    if (res[key]) return res[key];
  }
  return res;
}

function getResultMsg(res) {
  const msgKeys = ['bizMsg', 'error_msg', 'message'];
  for (const key of msgKeys) {
    if (res[key]) return res[key];
  }
  return defaultMsg;
}

// 进行全局错误处理
function errorHandle(errMsg) {
  Message.error(errMsg || defaultMsg);
  return errMsg || defaultMsg;
}

export default useRequest;
