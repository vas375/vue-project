import Log4js from "./Log4js";
import { PushStream } from "./pushstream2";

// 定义星期和月份数组
const days: string[] = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// 将数值转换为两位数格式
export const valueToTwoDigits = function (value: number): string {
  return ((value < 10) ? '0' : '') + value;
};

// 将日期转换为 UTC 字符串格式
export const dateToUTCString = function (date: any): string {
  const time = valueToTwoDigits(date.getUTCHours()) + ':' + valueToTwoDigits(date.getUTCMinutes()) + ':' + valueToTwoDigits(date.getUTCSeconds());
  return days[date.getUTCDay()] + ', ' + valueToTwoDigits(date.getUTCDate()) + ' ' + months[date.getUTCMonth()] + ' ' + date.getUTCFullYear() + ' ' + time + ' GMT';
};

// 扩展对象属性
export const extend = function (...args: any[]): any {
  const object = args[0] || {};
  for (let i = 0; i < args.length; i++) {
    const settings = args[i];
    for (const attr in settings) {
      if (!settings.hasOwnProperty || settings.hasOwnProperty(attr)) {
        object[attr] = settings[attr];
      }
    }
  }
  return object;
};

/**
 * 正则表达式：用于验证JSON字符串中的有效字符
 */
export const validChars = /^[\],:{}\s]*$/;

/**
 * 正则表达式：用于匹配转义字符
 */
export const validEscape = /\\(?:["\\\\/bfnrt]|u[0-9a-fA-F]{4})/g;

/**
 * 正则表达式：用于匹配JSON字符串中的有效标记
 */
export const validTokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g;

/**
 * 正则表达式：用于匹配JSON字符串中的有效大括号
 */
export const validBraces = /(?:^|:|,)(?:\s*\[)+/g;

/**
 * 去除字符串两端的空格
 * @param value 要去除空格的字符串
 * @returns 去除空格后的字符串
 */
export const trim = function(value: string): string {
  return value.replace(/^\s*/, "").replace(/\s*$/, "");
};


/**
 * 解析JSON数据
 * @param data 要解析的JSON数据
 * @returns 解析后的JSON对象
 * @throws 如果数据不是有效的JSON格式，则抛出异常
 */
export const parseJSON = function(data: string): any {
  if (!data || !isString(data)) {
    return null;
  }

  // 去除前导和尾随空格（IE不支持）
  data = trim(data);

  // 首先尝试使用原生的JSON解析器进行解析
  if (window.JSON && window.JSON.parse) {
    try {
      return window.JSON.parse(data);
    } catch(e) {
      throw "无效的JSON数据：" + data;
    }
  }

  // 确保传入的数据是有效的JSON格式
  // 逻辑参考自 http://json.org/json2.js
  if (validChars.test(data.replace(validEscape, "@").replace(validTokens, "]").replace(validBraces, ""))) {
    return (new Function("return " + data))();
  }

  throw "无效的JSON数据：" + data;
};


/**
 * 获取控制参数
 * @param pushstream PushStream对象
 * @returns 控制参数对象
 */
export const getControlParams = function(pushstream: any): any {
  const data: any = {};
  data[pushstream.tagArgument] = "";
  data[pushstream.timeArgument] = "";
  data[pushstream.eventIdArgument] = "";
  if (pushstream.messagesControlByArgument) {
    data[pushstream.tagArgument] = Number(pushstream._etag);
    if (pushstream._lastModified) {
      data[pushstream.timeArgument] = pushstream._lastModified;
    } else if (pushstream._lastEventId) {
      data[pushstream.eventIdArgument] = pushstream._lastEventId;
    }
  }
  return data;
};

/**
 * 获取当前时间戳
 * @returns 当前时间戳
 */
export const getTime = function(): number {
  return (new Date()).getTime();
};

/**
 * 获取当前时间戳参数
 * @returns 当前时间戳参数对象
 */
export const currentTimestampParam = function(): any {
  return { "_" : getTime() };
};


/**
 * 将对象转换为URL参数字符串
 * @param settings 对象参数
 * @returns URL参数字符串
 */
export const objectToUrlParams = function(settings: any): string {
  let params = settings;
  if (typeof(settings) === 'object') {
    params = '';
    for (const attr in settings) {
      if (!settings.hasOwnProperty || settings.hasOwnProperty(attr)) {
        params += '&' + attr + '=' + encodeURIComponent(settings[attr]);
      }
    }
    params = params.substring(1);
  }

  return params || '';
};


/**
 * 将参数添加到URL中
 * @param url 原始URL
 * @param params 参数对象
 * @returns 添加参数后的URL
 */
export const addParamsToUrl = function(url: string, params: any): string {
  return url + ((url.indexOf('?') < 0) ? '?' : '&') + objectToUrlParams(params);
};

/**
 * 判断是否为数组
 * @param obj 要判断的对象
 * @returns 是否为数组
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isArray = Array.isArray || function(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Array]';
};

/**
 * 判断是否为字符串
 * @param obj 要判断的对象
 * @returns 是否为字符串
 */
export const isString = function(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object String]';
};

/**
 * 判断是否为日期对象
 * @param obj 要判断的对象
 * @returns 是否为日期对象
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isDate = function(obj: any): boolean {
  return Object.prototype.toString.call(obj) === '[object Date]';
};

/**
 * 对文本进行转义处理
 * @param text 要转义的文本
 * @returns 转义后的文本
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const escapeText = function(text: string): string {
  return (text) ? window.escape(text) : '';
};

/**
 * 对文本进行反转义处理
 * @param text 要反转义的文本
 * @returns 反转义后的文本
 */
export const unescapeText = function(text: string): string {
  return (text) ? window.unescape(text) : '';
};

/**
 * 解析推送消息
 * @param messageText 推送消息文本
 * @param keys 推送消息键值对
 * @returns 解析后的推送消息对象
 */
export const parseMessage = (messageText: string, keys: any): any => {
  let msg: any = messageText;
  if (typeof messageText === "string") {
    msg = parseJSON(messageText);
  }

  const message = {
    id: msg[keys.jsonIdKey], // 从消息对象中获取id属性值
    channel: msg[keys.jsonChannelKey], // 从消息对象中获取channel属性值
    text: isString(msg[keys.jsonTextKey]) ? unescapeText(msg[keys.jsonTextKey]) : msg[keys.jsonTextKey], // 从消息对象中获取text属性值，并进行转义
    tag: msg[keys.jsonTagKey], // 从消息对象中获取tag属性值
    time: msg[keys.jsonTimeKey], // 从消息对象中获取time属性值
    eventid: msg[keys.jsonEventIdKey] || "" // 从消息对象中获取eventid属性值，如果不存在则为空字符串
  };

  return message;
};


/**
 * 获取回溯路径
 * @param options 选项对象
 * @returns 回溯路径
 */
export const getBacktrack = function(options: any): string {
  return (options.backtrack) ? ".b" + Number(options.backtrack) : "";
};

/**
 * 获取通道路径
 * @param channels 通道对象
 * @param withBacktrack 是否包含回溯路径
 * @returns 通道路径
 */
export const getChannelsPath = function(channels: any, withBacktrack: boolean): string {
  let path = '';
  for (const channelName in channels) {
    if (!channels.hasOwnProperty || channels.hasOwnProperty(channelName)) {
      path += "/" + channelName + (withBacktrack ? getBacktrack(channels[channelName]) : "");
    }
  }
  return path;
};

/**
 * 获取订阅者URL
 * @param pushstream PushStream对象
 * @param prefix URL前缀
 * @param extraParams 额外参数对象
 * @param withBacktrack 是否包含回溯路径
 * @returns 订阅者URL
 */
export const getSubscriberUrl = function(pushstream: any, prefix: string, extraParams: any, withBacktrack: boolean): string {
  //const websocket = pushstream.wrapper.type === WebSocketWrapper.TYPE;
  const useSSL = pushstream.useSSL;
  const port = normalizePort(useSSL, pushstream.port);
  //let url = (websocket) ? ((useSSL) ? "wss://" : "ws://") : ((useSSL) ? "https://" : "http://");
  let url = (useSSL) ? "https://" : "http://";
  url += pushstream.host;
  url += (port ? (":" + port) : "");
  url += prefix;

  const channels = getChannelsPath(pushstream.channels, withBacktrack);
  if (pushstream.channelsByArgument) {
    const channelParam: any = {};
    channelParam[pushstream.channelsArgument] = channels.substring(1);
    extraParams = extend({}, extraParams, channelParam);
  } else {
    url += channels;
  }
  return addParamsToUrl(url, extraParams);
};

/**
 * 获取发布者URL
 * @param pushstream PushStream对象
 * @returns 发布者URL
 */
export const getPublisherUrl = function(pushstream: any): string {
  const port = normalizePort(pushstream.useSSL, pushstream.port);
  let url = (pushstream.useSSL) ? "https://" : "http://";
  url += pushstream.host;
  url += (port ? (":" + port) : "");
  url += pushstream.urlPrefixPublisher;
  url += "?id=" + getChannelsPath(pushstream.channels, false);

  return url;
};

/**
 * 提取 XSS 域名
 * @param domain 域名
 * @returns 提取后的域名
 */
export const extractXssDomain = function(domain: string): string {
  // 如果域名是 IP 地址，则直接返回
  if (domain.match(/^(\d{1,3}\.){3}\d{1,3}$/)) {
    return domain;
  }

  const domainParts = domain.split('.');
  // 如果域名以 3 个字符结尾，或者以 2 个字符结尾且前面有超过 4 个字符，
  // 则只保留最后 2 部分，否则至少保留 3 部分（或全部域名）
  const keepNumber = Math.max(domainParts.length - 1, (domain.match(/(\w{4,}\.\w{2}|\.\w{3,})$/) ? 2 : 3));

  return domainParts.slice(-1 * keepNumber).join('.');
};

/**
 * 标准化端口号
 * @param useSSL 是否使用SSL
 * @param port 端口号
 * @returns 标准化后的端口号
 */
export const normalizePort = function (useSSL: boolean, port: number| string | undefined): number | string {
  port = Number(port || (useSSL ? 443 : 80));
  return ((!useSSL && port === 80) || (useSSL && port === 443)) ? "" : port;
};


/**
 * 判断是否为跨域URL
 * @param url URL字符串
 * @returns 是否为跨域URL
 */
export const isCrossDomainUrl = function(url: string): boolean {
  if (!url) {
    return false;
  }

  const parser = document.createElement('a');
  parser.href = url;

  const srcPort = normalizePort(window.location.protocol === "https:", window.location.port);
  const dstPort = normalizePort(parser.protocol === "https:", parser.port);

  return (window.location.protocol !== parser.protocol) ||
         (window.location.hostname !== parser.hostname) ||
         (srcPort !== dstPort);
};


/**
 * 链接函数
 * @param method 方法
 * @param instance 实例
 * @returns 绑定了实例的方法
 */
export const linker = function(method: any, instance: any): any {
  return function() {
    // eslint-disable-next-line prefer-rest-params
    return method.apply(instance, arguments);
  };
};

/**
 * 清除定时器
 * @param timer 定时器
 * @returns 清除后的定时器
 */
export const clearTimer = function(timer: any): any {
  if (timer) {
    window.clearTimeout(timer);
  }
  return null;
};

/* 公共回调函数 */
export const onmessageCallback = function(this: any, event: any) {
  Log4js.info("[" + this.type + "] 收到消息", arguments);
  console.log(`--收到消息--`)
  const message = parseMessage(event.data, this.pushstream);
  if (message.tag) { this.pushstream._etag = message.tag; }
  if (message.time) { this.pushstream._lastModified = message.time; }
  if (message.eventid) { this.pushstream._lastEventId = message.eventid; }
  this.pushstream._onmessage(message.text, message.id, message.channel, message.eventid, true);
};

export const onopenCallback = function(this: any) {
  this.pushstream._onopen();
  console.log("[" + this.type + "] 连接已打开");
};

export const onerrorCallback = function(this: any, event: any) {
  console.error("[" + this.type + "] 错误（由服务器断开连接）：", event);
  // if ((this.pushstream.readyState === PushStream.OPEN) &&
  //     (this.type === EventSourceWrapper.TYPE) &&
  //     (event.type === 'error') &&
  //     (this.connection.readyState === window.EventSource.CONNECTING)) {
  //   // EventSource 已经有一个使用 last-event-id 头部的重新连接函数
  //   return;
  // }
  this._closeCurrentConnection();
  this.pushstream._onerror({type: ((event && ((event.type === "load") || (event.type === "close"))) || (this.pushstream.readyState === PushStream.CONNECTING)) ? "load" : "timeout"});
};


