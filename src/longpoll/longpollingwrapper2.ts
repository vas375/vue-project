import { Ajax } from "./ajax";
import { clearTimer, extend, getControlParams, getSubscriberUrl, isArray, linker, onopenCallback, parseMessage } from "./common";
import Log4js from "./Log4js";
import { PushStream } from "./pushstream";

/**
 * 长轮询包装器
 * @param pushstream PushStream对象
 */
export const LongPollingWrapper = function(this: any, pushstream: any) {
  this.type = LongPollingWrapper.TYPE;
  this.pushstream = pushstream;
  this.connection = null;
  this.opentimer = null;
  this.messagesQueue = [];
  this._linkedInternalListen = linker(this._internalListen, this);
  this.xhrSettings = {
    timeout: this.pushstream.timeout,
    data: {},
    url: null,
    success: linker(this.onmessage, this),
    error: linker(this.onerror, this),
    load: linker(this.onload, this),
    beforeSend: linker(this.beforeSend, this),
    afterReceive: linker(this.afterReceive, this)
  };
};

LongPollingWrapper.TYPE = "LongPolling";

LongPollingWrapper.prototype = {
  /**
   * 连接
   */
  connect: function() {
    this.messagesQueue = [];
    this._closeCurrentConnection();
    this.urlWithBacktrack = getSubscriberUrl(this.pushstream, this.pushstream.urlPrefixLongpolling, {}, true);
    this.urlWithoutBacktrack = getSubscriberUrl(this.pushstream, this.pushstream.urlPrefixLongpolling, {}, false);
    this.xhrSettings.url = this.urlWithBacktrack;
    this.useJSONP = this.pushstream._crossDomain || this.pushstream.useJSONP;
    this.xhrSettings.scriptId = "PushStreamManager_" + this.pushstream.id;
    if (this.useJSONP) {
      this.pushstream.messagesControlByArgument = true;
    }
    this._listen();
    this.opentimer = window.setTimeout(linker(onopenCallback, this), 150);
    Log4js.info("[LongPolling] 连接到:", this.xhrSettings.url);
  },

  /**
   * 监听
   */
  _listen: function() {
    if (this._internalListenTimeout) { clearTimer(this._internalListenTimeout); }
    this._internalListenTimeout = window.setTimeout(this._linkedInternalListen, 100);
  },

  /**
   * 内部监听
   */
  _internalListen: function() {
    if (this.pushstream._keepConnected) {
      this.xhrSettings.url = this.pushstream._useControlArguments() ? this.urlWithoutBacktrack : this.urlWithBacktrack;
      this.xhrSettings.data = extend({}, this.pushstream.extraParams(), this.xhrSettings.data, getControlParams(this.pushstream));
      if (this.useJSONP) {
        this.connection = Ajax.jsonp(this.xhrSettings);
      } else if (!this.connection) {
        this.connection = Ajax.load(this.xhrSettings);
      }
    }
  },

  /**
   * 断开连接
   */
  disconnect: function() {
    if (this.connection) {
      Log4js.debug("[LongPolling] 关闭连接:", this.xhrSettings.url);
      this._closeCurrentConnection();
      this.pushstream._onclose();
    }
  },

  /**
   * 关闭当前连接
   */
  _closeCurrentConnection: function() {
    this.opentimer = clearTimer(this.opentimer);
    if (this.connection) {
      try { this.connection.abort(); } catch (e) {
        try { Ajax.clear(this.connection); } catch (e1) { /* 忽略关闭时的错误 */ }
      }
      this.connection = null;
      this.xhrSettings.url = null;
    }
  },

  /**
   * 发送前
   * @param xhr XMLHttpRequest对象
   */
  beforeSend: function(xhr: XMLHttpRequest) {
    if (!this.pushstream.messagesControlByArgument) {
      xhr.setRequestHeader("If-None-Match", this.pushstream._etag);
      xhr.setRequestHeader("If-Modified-Since", this.pushstream._lastModified);
    }
  },

  /**
   * 接收后
   * @param xhr XMLHttpRequest对象
   */
  afterReceive: function(xhr: XMLHttpRequest) {
    if (!this.pushstream.messagesControlByArgument) {
      this.pushstream._etag = xhr.getResponseHeader('Etag');
      this.pushstream._lastModified = xhr.getResponseHeader('Last-Modified');
    }
    this.connection = null;
  },

  /**
   * 错误处理
   * @param status 状态码
   */
  onerror: function(status: number) {
    this._closeCurrentConnection();
    if (this.pushstream._keepConnected) { /* abort() 由 disconnect() 调用，会调用此回调函数，但应该被忽略 */
      if (status === 304) {
        this._listen();
      } else {
        Log4js.info("[LongPolling] 错误（由服务器断开连接）:", status);
        this.pushstream._onerror({type: ((status === 403) || (this.pushstream.readyState === PushStream.CONNECTING)) ? "load" : "timeout"});
      }
    }
  },

  /**
   * 加载完成
   */
  onload: function() {
    this._listen();
  },

  /**
   * 接收消息
   * @param responseText 响应文本
   */
  onmessage: function(responseText: string) {
    if (this._internalListenTimeout) { clearTimer(this._internalListenTimeout); }
    Log4js.info("[LongPolling] 收到消息", responseText);
    let lastMessage: any = null;
    const messages = isArray(responseText) ? responseText : responseText.replace(/\}\{/g, "}\r\n{").split("\r\n");
    for (let i = 0; i < messages.length; i++) {
      if (messages[i]) {
        lastMessage = parseMessage(messages[i], this.pushstream);
        this.messagesQueue.push(lastMessage);
        if (this.pushstream.messagesControlByArgument && lastMessage.time) {
          this.pushstream._etag = lastMessage.tag;
          this.pushstream._lastModified = lastMessage.time;
        }
      }
    }

    this._listen();

    while (this.messagesQueue.length > 0) {
      const message = this.messagesQueue.shift();
      this.pushstream._onmessage(message.text, message.id, message.channel, message.eventid, (this.messagesQueue.length === 0));
    }
  }
};
