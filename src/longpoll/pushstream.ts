
import { Ajax } from "./ajax";
import { clearTimer, dateToUTCString, escapeText, getPublisherUrl, isCrossDomainUrl, isDate, linker } from "./common";
import Log4js from "./Log4js";
import { LongPollingWrapper } from "./longpollingwrapper";

/**
 * Represents a PushStream instance.
 */
const  PushStreamManager:Array<any> = [];

class PushStream {
  id: number;
  useSSL: boolean;
  host: string;
  port: number;
  timeout: number;
  pingtimeout: number;
  reconnectOnTimeoutInterval: number;
  reconnectOnChannelUnavailableInterval: number;
  lastEventId: any;
  messagesPublishedAfter: any;
  messagesControlByArgument: boolean;
  tagArgument: string;
  timeArgument: string;
  eventIdArgument: string;
  useJSONP: boolean;
  _reconnecttimer: any;
  _etag: number;
  _lastModified: string | null;
  _lastEventId: string | null;
  urlPrefixPublisher: string;
  urlPrefixStream: string;
  urlPrefixEventsource: string;
  urlPrefixLongpolling: string;
  urlPrefixWebsocket: string;
  jsonIdKey: string;
  jsonChannelKey: string;
  jsonTextKey: string;
  jsonTagKey: string;
  jsonTimeKey: string;
  jsonEventIdKey: string;
  modes: string[];
  //wrappers: PushStreamWrapper[];
  wrapper:any;
  onchanneldeleted: ((channel: any) => void) | null;
  onmessage: ((text: string, id: number, channel: string, eventid: string, isLastMessageFromBatch: boolean) => void) | null;
  onerror: ((error: any) => void) | null;
  onstatuschange: ((state: number) => void) | null;
  extraParams: (() => {}) | null;
  channels: { [channel: string]: any };
  channelsCount: number;
  channelsByArgument: boolean;
  channelsArgument: string;
  _crossDomain: boolean;
  readyState: number;
  private _keepConnected: boolean | undefined;
  static CONNECTING: number; 
  private _lastUsedMode: number | undefined;
  times:number;
  
  constructor(settings: any) {
    settings = settings || {};

    this.id = PushStreamManager.push(this) - 1;
    this.useSSL = settings.useSSL || false;
    this.host = settings.host || window.location.hostname;
    this.port = Number(settings.port || (this.useSSL ? 443 : 80));
    this.timeout = settings.timeout || 30000;
    this.pingtimeout = settings.pingtimeout || 30000;
    this.reconnectOnTimeoutInterval = settings.reconnectOnTimeoutInterval || 3000;
    this.reconnectOnChannelUnavailableInterval = settings.reconnectOnChannelUnavailableInterval || 60000;
    this.lastEventId = settings.lastEventId || null;
    this.messagesPublishedAfter = settings.messagesPublishedAfter;
    this.messagesControlByArgument = settings.messagesControlByArgument || false;
    this.tagArgument = settings.tagArgument || 'tag';
    this.timeArgument = settings.timeArgument || 'time';
    this.eventIdArgument = settings.eventIdArgument || 'eventid';
    this.useJSONP = settings.useJSONP || false;
    this._reconnecttimer = null;
    this._etag = 0;
    this._lastModified = null;
    this._lastEventId = null;
    this.urlPrefixPublisher = settings.urlPrefixPublisher || '/pub';
    this.urlPrefixStream = settings.urlPrefixStream || '/sub';
    this.urlPrefixEventsource = settings.urlPrefixEventsource || '/ev';
    this.urlPrefixLongpolling = settings.urlPrefixLongpolling || '/lp';
    this.urlPrefixWebsocket = settings.urlPrefixWebsocket || '/ws';
    this.jsonIdKey = settings.jsonIdKey || 'id';
    this.jsonChannelKey = settings.jsonChannelKey || 'channel';
    this.jsonTextKey = settings.jsonTextKey || 'text';
    this.jsonTagKey = settings.jsonTagKey || 'tag';
    this.jsonTimeKey = settings.jsonTimeKey || 'time';
    this.jsonEventIdKey = settings.jsonEventIdKey || 'eventid';
    this.modes = settings.modes || ['longpolling'];
    //this.wrappers = [];
    this.wrapper = null;
    this.onchanneldeleted = settings.onchanneldeleted || null;
    this.onmessage = settings.onmessage || null;
    this.onerror = settings.onerror || null;
    this.onstatuschange = settings.onstatuschange || null;
    this.extraParams = settings.extraParams || function() { return {}; };
    this.channels = {};
    this.channelsCount = 0;
    this.channelsByArgument = settings.channelsByArgument || false;
    this.channelsArgument = settings.channelsArgument || 'channels';
    this._crossDomain = isCrossDomainUrl(getPublisherUrl(this));
    this.readyState = 0;
    this.times = 0

    // for (let i = 0; i < this.modes.length; i++) {
    //   try {
    //     //let wrapper = null;
    //     switch (this.modes[i]) {
    //       // case 'websocket':
    //       //   wrapper = new WebSocketWrapper(this);
    //       //   break;
    //       // case 'eventsource':
    //       //   wrapper = new EventSourceWrapper(this);
    //       //   break;
    //       case 'longpolling':
    //         this.wrapper = new LongPollingWrapper(this);
    //         break;
    //       // case 'stream':
    //       //   wrapper = new StreamWrapper(this);
    //       //   break;
    //     }
    //     // if (wrapper) {
    //     //   this.wrappers.push(wrapper);
    //     // }
    //   } catch (e) {
    //     Log4js.info(e);
    //   }
    // }
  }

  /**
   * Sets the state of the PushStream instance.
   * @param state - The state to set.
   */
  _setState(state: number): void {
    if (this.readyState !== state) {
      Log4js.info("status changed", state);
      this.readyState = state;
      if (this.onstatuschange) {
        this.onstatuschange(this.readyState);
      }
    }
  }

  removeAllChannels():void{
    console.log("removing all channels");
    this.channels = {};
    this.channelsCount = 0;
  }
  addChannel(channel:any, options?: any):void {
    if (escapeText(channel) !== channel) {
      throw new Error("Invalid channel name! Channel has to be a set of [a-zA-Z0-9]");
    }
    console.log("entering addChannel");
    if (typeof this.channels[channel] !== "undefined") {
      throw new Error(`Cannot add channel ${channel}: already subscribed`);
    }
    options = options || {};
    console.log("adding channel", channel, options);
    this.channels[channel] = options;
    this.channelsCount++;
    if (this.readyState !== this.CLOSED) {
      this.connect();
    }
    console.log("leaving addChannel");
  }

  /**
   * Connects to the PushStream server.
   */
  connect(): void {
    console.log("entering connect");
    if (!this.host) {
      throw new Error("PushStream host not specified");
    }
    if (isNaN(this.port)) {
      throw new Error("PushStream port not specified");
    }
    if (!this.channelsCount) {
      throw new Error("No channels specified");
    }
    // if (this.wrappers.length === 0) {
    //   throw new Error("No available support for this browser");
    // }

    this._keepConnected = true;
    this._lastUsedMode = 0;
    this._connect();
    console.log("leaving connect")
    this.times = 0
    //Log4js.debug("leaving connect");
  }

   CLOSED = 0
   CONNECTING = 1
   OPEN = 2
   LOG_LEVEL = 'error'
   LOG_OUTPUT_ELEMENT_ID = 'Log4jsLogOutput'
  /**
 * 断开与 PushStream 服务器的连接。
 * 设置 `_keepConnected` 属性为 `false`，表示不再保持连接。
 * 调用 `_disconnect` 方法，关闭当前连接。
 * 调用 `_setState` 方法，将 `readyState` 属性设置为 `CLOSED`，表示连接状态为已关闭。
 * 输出日志信息，表示已断开连接。
 */
disconnect(): void {
  // 输出调试信息，表示进入了 disconnect 方法
  //Log4js.debug("进入 disconnect 方法");

  // 设置 _keepConnected 属性为 false，表示不再保持连接
  this._keepConnected = false;

  // 调用 _disconnect 方法，关闭当前连接
  this._disconnect();

  // 调用 _setState 方法，将 readyState 属性设置为 CLOSED，表示连接状态为已关闭
  this._setState(this.CLOSED);

  // 输出日志信息，表示已断开连接
  console.log("已断开连接");

  // 输出调试信息，表示离开了 disconnect 方法
  //Log4js.debug("离开 disconnect 方法");
}


  /**
   * Internal method to establish a connection with the PushStream server.
   */
  _connect(): void {
    if (this._lastEventId === null) {
      this._lastEventId = this.lastEventId;
    }
    if (this._lastModified === null) {
      let date: Date | number = this.messagesPublishedAfter;
      if (!isDate(date)) {
        const messagesPublishedAfter: number = Number(this.messagesPublishedAfter);
        if (messagesPublishedAfter > 0) {
          date = new Date();
          date.setTime(date.getTime() - (messagesPublishedAfter * 1000));
        } else if (messagesPublishedAfter < 0) {
          date = new Date(0);
        }
      }

      if (isDate(date)) {
        this._lastModified = dateToUTCString(date);
      }
    }

    this._disconnect();
    this._setState(PushStream.CONNECTING);
    this.wrapper = new LongPollingWrapper(this);
    //this.wrapper = this.wrappers[this._lastUsedMode++ % this.wrappers.length];

    try {
      this.wrapper.connect();
    } catch (e) {
      // each wrapper has a cleanup routine at disconnect method
      if (this.wrapper) {
        this.wrapper.disconnect();
      }
    }
  }

  /**
   * Internal method to disconnect from the PushStream server.
   * 断开连接
   */
  _disconnect(): void {
    this._reconnecttimer = clearTimer(this._reconnecttimer);
    if (this.wrapper) {
      this.wrapper.disconnect();
    }
  }

  /**
 * 重新连接到PushStream服务器。
 * @param timeout - 重新连接的超时时间，单位为毫秒。
 * @remarks
 * 该方法用于在与PushStream服务器断开连接后尝试重新连接。在方法内部，首先会检查是否需要保持连接（`_keepConnected`为`true`），是否已经存在重新连接的定时器（`_reconnecttimer`为`null`），以及当前连接状态是否为非连接状态（`readyState`不为`PushStream.CONNECTING`）。
 * 如果满足上述条件，则会输出一条日志信息，表示正在尝试重新连接，并创建一个定时器，在指定的超时时间后调用`_connect`方法进行连接。
 * 通过调用该方法，可以在与PushStream服务器断开连接后自动尝试重新连接，以保持与服务器的持续通信。
 */
  _reconnect(timeout: number): void {
    if (this._keepConnected && !this._reconnecttimer && (this.readyState !== PushStream.CONNECTING)) {
      console.log("trying to reconnect in", timeout);
      this._reconnecttimer = window.setTimeout(linker(this._connect, this), timeout);
    }
  }


  _useControlArguments () {
    return this.messagesControlByArgument && ((this._lastModified !== null) || (this._lastEventId !== null));
  }

  _onopen() {
    this._reconnecttimer = clearTimer(this._reconnecttimer);
    this._setState(this.OPEN);
    // if (this._lastUsedMode > 0) {
    //   this._lastUsedMode--; //use same mode on next connection
    // }
  }
  /**
    * 处理接收到的消息的内部方法。
    * @param text - 消息文本。
    * @param id - 消息ID。
    * @param channel - 消息所属的频道。
    * @param eventid - 消息的事件ID。
    * @param isLastMessageFromBatch - 是否是批量消息中的最后一条消息。
    * @returns 无返回值。
  */
  _onmessage(text: string, id: number, channel: string, eventid: string, isLastMessageFromBatch: boolean): void {
      //Log4js.debug("message", text, id, channel, eventid, isLastMessageFromBatch);
      console.log("message", text, id, channel, eventid, isLastMessageFromBatch);

      // 如果消息ID为-2，表示频道已被删除
      if (id === -2) {
        // 调用 onchanneldeleted 回调函数
        if (this.onchanneldeleted) {
          this.onchanneldeleted(channel);
        }
      }
      // 如果消息ID大于0，表示正常的消息
      else if (id > 0) {
        // 调用 onmessage 回调函数
        if (this.onmessage) {
          this.onmessage(text, id, channel, eventid, isLastMessageFromBatch);
        }
      }
  }


  sendMessage(message: string, successCallback?: () => void, errorCallback?: () => void): void {
    message = escapeText(message);
    Ajax.post({ 
      url: getPublisherUrl(this), 
      data: message, 
      success: 
      successCallback, 
      error: errorCallback, 
      crossDomain: this._crossDomain 
    });
  }

  _onerror(error: any): void {
    console.log('streamError', error);
    this._setState(this.CLOSED);
    this._reconnect((error.type === "timeout") ? this.reconnectOnTimeoutInterval : this.reconnectOnChannelUnavailableInterval);
    if (this.onerror) {
      this.onerror(error);
    }
  }
  _onclose(): void {
    this._reconnecttimer = clearTimer(this._reconnecttimer);
    this._setState(this.CLOSED);
    this._reconnect(this.reconnectOnTimeoutInterval);
  }
}

export { PushStream };