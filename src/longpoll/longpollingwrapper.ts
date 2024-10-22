import { Ajax } from "./ajax";
import { clearTimer, extend, getControlParams, getSubscriberUrl, isArray, linker, onopenCallback, parseMessage } from "./common";
//import Log4js from "./Log4js";
import { PushStream } from "./pushstream";

/**
 * 长轮询包装器
 */
export class LongPollingWrapper {
  type: string;
  pushstream: any;
  connection: XMLHttpRequest | null;
  opentimer: any;
  messagesQueue: any[];
  _linkedInternalListen: () => void;
  xhrSettings: any;
  static TYPE: string;
  urlWithBacktrack: string | undefined;
  urlWithoutBacktrack: string | undefined;
  useJSONP: any;
  _internalListenTimeout: any;

  constructor(pushstream: any) {
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
  }

  /**
 * 连接到PushStream服务器。
 * @remarks
 * 该方法用于连接到PushStream服务器。在方法内部，首先会重置消息队列（`messagesQueue`），将其清空。
 * 然后调用`_closeCurrentConnection`方法，关闭当前连接。
 * 接着，根据服务器配置生成带有回溯参数和不带回溯参数的订阅者URL，
 * 并将其分别赋值给`urlWithBacktrack`和`urlWithoutBacktrack`属性。
 * 然后，根据服务器是否跨域或使用JSONP，设置XHR请求的URL和是否使用JSONP。
 * 如果使用JSONP，则��`messagesControlByArgument`属性设置为`true`，
 * 以便通过参数控制消息。接下来，调用`_listen`方法，开始监听服务器的消息。
 * 最后，创建一个定时器，在150毫秒后调用`onopenCallback`方法，
 * 并将定时器的ID赋值给`opentimer`属性。同时，输出一条日志信息，表示已连接到指定的URL。
 * 通过调用该方法，可以实现与PushStream服务器的连接，并进行消息的监听和处理。
 */
  connect(): void {
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
    this.opentimer = setTimeout(()=>linker(onopenCallback, this), 150);
    console.log('opentimer:', this.opentimer)
    console.log("[LongPolling] 连接到:", this.xhrSettings.url);
  }

  /**
 * 监听PushStream服务器的消息。
 * @remarks
 * 该方法用于监听PushStream服务器发送的消息。在方法内部，首先会检查是否存在内部监听定时器（`_internalListenTimeout`），如果存在则会清除该定时器。然后，创建一个新的定时器，在100毫秒后调用`_linkedInternalListen`方法进行内部监听。
 * 通过调用该方法，可以实现对PushStream服务器消息的监听，以便及时处理服务器发送的消息。
 */
  _listen(): void {
    if (this._internalListenTimeout) clearTimer(this._internalListenTimeout)
    this._internalListenTimeout = window.setTimeout(this._linkedInternalListen, 100);
  }

  /**
 * 内部监听PushStream服务器的消息。
 * @remarks
 * 该方法用于内部监听PushStream服务器发送的消息。
 * 在方法内部，首先会检查是否需要保持连接（`_keepConnected`为`true`）。
 * 如果需要保持连接，则根据服务器配置设置XHR请求的URL和数据。
 * 如果使用JSONP，则调用`Ajax.jsonp`方法创建一个JSONP请求；
 * 否则，如果连接不存在，则调用`Ajax.load`方法创建一个XHR请求。
 * 通过调用该方法，可以实现对PushStream服务器消息的内部监听，以便及时处理服务器发送的消息。
 */
  _internalListen(): void {
    if (this.pushstream._keepConnected) {
      this.xhrSettings.url = this.pushstream._useControlArguments() ? this.urlWithoutBacktrack : this.urlWithBacktrack;
      this.xhrSettings.data = extend({}, this.pushstream.extraParams(), this.xhrSettings.data, getControlParams(this.pushstream));
      if (this.useJSONP) {
        this.connection = Ajax.jsonp(this.xhrSettings);
      } else if (!this.connection) {
        this.connection = Ajax.load(this.xhrSettings);
      }
    }
  }

  /**
   * 断开连接
   */
  disconnect(): void {
    if (this.connection) {
      console.warn("[LongPolling] 关闭连接:", this.xhrSettings.url);
      this._closeCurrentConnection();
      this.pushstream._onclose();
    }
  }

  /**
   * 关闭当前连接
   */
  _closeCurrentConnection(): void {
    this.opentimer = clearTimer(this.opentimer);
    if (this.connection) {
      try { this.connection.abort(); } catch (e) {
        try { Ajax.clear(this.connection); } catch (e1) { /* 忽略关闭时的错误 */ }
      }
      this.connection = null;
      this.xhrSettings.url = null;
    }
  }

  /**
   * 发送前
   * @param xhr XMLHttpRequest对象
   */
  beforeSend(xhr: XMLHttpRequest): void {
    if (!this.pushstream.messagesControlByArgument) {
      xhr.setRequestHeader("If-None-Match", this.pushstream._etag);
      xhr.setRequestHeader("If-Modified-Since", this.pushstream._lastModified);
    }
  }

  /**
   * 接收后
   * @param xhr XMLHttpRequest对象
   */
  afterReceive(xhr: XMLHttpRequest): void {
    if (!this.pushstream.messagesControlByArgument) {
      this.pushstream._etag = xhr.getResponseHeader('Etag');
      this.pushstream._lastModified = xhr.getResponseHeader('Last-Modified');
    }
    this.connection = null;
  }

  /**
   * 错误处理
   * @param status 状态码
   */
  onerror(status: number): void {
    this._closeCurrentConnection();
    if (this.pushstream._keepConnected) { /* abort() 由 disconnect() 调用，会调用此回调函数，但应该被忽略 */
      if (status === 304) {
        this._listen();
      } else {
        console.error("[LongPolling] 错误（由服务器断开连接）:", status);
        this.pushstream._onerror({type: ((status === 403) || (this.pushstream.readyState === PushStream.CONNECTING)) ? "load" : "timeout"});
      }
    }
  }

  /**
   * 加载完成
   */
  onload(): void {
    this._listen();
  }

  /**
   * 接收消息
   * @param responseText 响应文本
   */
  onmessage(responseText: string): void {
    if (this._internalListenTimeout) { clearTimer(this._internalListen); }
    console.log("[LongPolling] 收到消息", responseText);
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
}

LongPollingWrapper.TYPE = "LongPolling";
