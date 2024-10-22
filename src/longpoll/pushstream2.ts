import { Ajax } from "./ajax";
import { clearTimer, dateToUTCString, escapeText, getPublisherUrl, isCrossDomainUrl, isDate, linker } from "./common";
import Log4js from "./Log4js";
import { LongPollingWrapper } from "./longpollingwrapper";

interface PushStreamSettings {
  useSSL?: boolean;
  host?: string;
  port?: number;
  timeout?: number;
  pingtimeout?: number;
  reconnectOnTimeoutInterval?: number;
  reconnectOnChannelUnavailableInterval?: number;
  lastEventId?: any;
  messagesPublishedAfter?: any;
  messagesControlByArgument?: boolean;
  tagArgument?: string;
  timeArgument?: string;
  eventIdArgument?: string;
  useJSONP?: boolean;
  urlPrefixPublisher?: string;
  urlPrefixStream?: string;
  urlPrefixEventsource?: string;
  urlPrefixLongpolling?: string;
  urlPrefixWebsocket?: string;
  jsonIdKey?: string;
  jsonChannelKey?: string;
  jsonTextKey?: string;
  jsonTagKey?: string;
  jsonTimeKey?: string;
  jsonEventIdKey?: string;
  modes?: string[];
  onchanneldeleted?: any;
  onmessage?: any;
  onerror?: any;
  onstatuschange?: any;
  extraParams?: () => any;
  channelsByArgument?: boolean;
  channelsArgument?: string;
}

interface PushStreamWrapper {
  // Wrapper properties and methods
}
const PushStreamManager:any = [];


// interface PushStream {
//   id: number;
//   useSSL: boolean;
//   host: string;
//   port: number;
//   timeout: number;
//   pingtimeout: number;
//   reconnectOnTimeoutInterval: number;
//   reconnectOnChannelUnavailableInterval: number;
//   lastEventId: any;
//   messagesPublishedAfter: any;
//   messagesControlByArgument: boolean;
//   tagArgument: string;
//   timeArgument: string;
//   eventIdArgument: string;
//   useJSONP: boolean;
//   _reconnecttimer: any;
//   _etag: number;
//   _lastModified: any;
//   _lastEventId: any;
//   urlPrefixPublisher: string;
//   urlPrefixStream: string;
//   urlPrefixEventsource: string;
//   urlPrefixLongpolling: string;
//   urlPrefixWebsocket: string;
//   jsonIdKey: string;
//   jsonChannelKey: string;
//   jsonTextKey: string;
//   jsonTagKey: string;
//   jsonTimeKey: string;
//   jsonEventIdKey: string;
//   modes: string[];
//   wrappers: PushStreamWrapper[];
//   wrapper: PushStreamWrapper | null;
//   onchanneldeleted: any;
//   onmessage: any;
//   onerror: any;
//   onstatuschange: any;
//   extraParams: () => any;
//   channels: { [channel: string]: any };
//   channelsCount: number;
//   channelsByArgument: boolean;
//   channelsArgument: string;
//   _crossDomain: boolean;
//   readyState: number;
//   removeAllChannels:any;
//   addChannel:any;
  
// }

const PushStream: any = function(this: any, settings: any) {
  settings = settings || {};

  const pushStream: any = {
    id: PushStreamManager.push(this) - 1,
    useSSL: settings.useSSL || false,
    host: settings.host || window.location.hostname,
    port: Number(settings.port || (this.useSSL ? 443 : 80)),
    timeout: settings.timeout || 30000,
    pingtimeout: settings.pingtimeout || 30000,
    reconnectOnTimeoutInterval: settings.reconnectOnTimeoutInterval || 3000,
    reconnectOnChannelUnavailableInterval: settings.reconnectOnChannelUnavailableInterval || 60000,
    lastEventId: settings.lastEventId || null,
    messagesPublishedAfter: settings.messagesPublishedAfter,
    messagesControlByArgument: settings.messagesControlByArgument || false,
    tagArgument: settings.tagArgument || 'tag',
    timeArgument: settings.timeArgument || 'time',
    eventIdArgument: settings.eventIdArgument || 'eventid',
    useJSONP: settings.useJSONP || false,
    _reconnecttimer: null,
    _etag: 0,
    _lastModified: null,
    _lastEventId: null,
    urlPrefixPublisher: settings.urlPrefixPublisher || '/pub',
    urlPrefixStream: settings.urlPrefixStream || '/sub',
    urlPrefixEventsource: settings.urlPrefixEventsource || '/ev',
    urlPrefixLongpolling: settings.urlPrefixLongpolling || '/lp',
    urlPrefixWebsocket: settings.urlPrefixWebsocket || '/ws',
    jsonIdKey: settings.jsonIdKey || 'id',
    jsonChannelKey: settings.jsonChannelKey || 'channel',
    jsonTextKey: settings.jsonTextKey || 'text',
    jsonTagKey: settings.jsonTagKey || 'tag',
    jsonTimeKey: settings.jsonTimeKey || 'time',
    jsonEventIdKey: settings.jsonEventIdKey || 'eventid',
    modes: (settings.modes || ['longpolling']),
    wrappers: [],
    wrapper: null,
    onchanneldeleted: settings.onchanneldeleted || null,
    onmessage: settings.onmessage || null,
    onerror: settings.onerror || null,
    onstatuschange: settings.onstatuschange || null,
    extraParams: settings.extraParams || function() { return {}; },
    channels: {},
    channelsCount: 0,
    channelsByArgument: settings.channelsByArgument || false,
    channelsArgument: settings.channelsArgument || 'channels',
    _crossDomain: isCrossDomainUrl(getPublisherUrl(this)),
    readyState: 0,
    removeAllChannels:function(){
      Log4js.info("removing all channels");
      this.channels = {};
      this.channelsCount = 0;
    },
    addChannel:function(channel:any, options?: any):void {
      Log4js.info("entering addChannel");
      if (escapeText(channel) !== channel) {
        throw new Error("Invalid channel name!");
      }
      if (typeof this.channels[channel] !== "undefined") {
        throw new Error(`Cannot add channel ${channel}: already subscribed`);
      }
      options = options || {};
    },
  };

  PushStream.sendMessage = function(url: string, message: string, successCallback?: () => void, errorCallback?: () => void): void {
    Ajax.post({ url: url, data: escapeText(message), success: successCallback, error: errorCallback });
  };
  
  PushStream.register = function(iframe: any): void {
    const matcher = iframe.window.location.href.match(/streamid=([0-9]*)&?/);
    if (matcher[1] && PushStreamManager[matcher[1]]) {
      PushStreamManager[matcher[1]].wrapper.register(iframe);
    }
  };
  
  PushStream.unload = function(): void {
    for (let i = 0; i < PushStreamManager.length; i++) {
      try { PushStreamManager[i].disconnect(); } catch(e){ /* empty */ }
    }
  };

  for (let i = 0; i < pushStream.modes.length; i++) {
    try {
      let wrapper: PushStreamWrapper | null = null;
      switch (pushStream.modes[i]) {
        // case 'websocket':
        //   wrapper = new WebSocketWrapper(pushStream);
        //   break;
        // case 'eventsource':
        //   wrapper = new EventSourceWrapper(pushStream);
        //   break;
        case 'longpolling':
          wrapper = new LongPollingWrapper(pushStream);
          break;
        // case 'stream':
        //   wrapper = new StreamWrapper(pushStream);
        //   break;
      }
      if (wrapper) {
        pushStream.wrappers.push(wrapper);
      }
    } catch (e) {
      Log4js.info(e);
    }
  }
  
  return pushStream;
};

/* constants */
PushStream.LOG_LEVEL = 'error'; /* debug, info, error */
PushStream.LOG_OUTPUT_ELEMENT_ID = 'Log4jsLogOutput';

/* status codes */
PushStream.CLOSED = 0;
PushStream.CONNECTING = 1;
PushStream.OPEN = 2;

PushStream.prototype = {
  addChannel(channel: string, options?: any): void {
    console.log('js', channel, options);
    if (escapeText(channel) !== channel) {
      throw new Error("Invalid channel name! Channel has to be a set of [a-zA-Z0-9]");
    }
    Log4js.debug("entering addChannel");
    if (typeof this.channels[channel] !== "undefined") {
      throw new Error(`Cannot add channel ${channel}: already subscribed`);
    }
    options = options || {};
    Log4js.info("adding channel", channel, options);
    this.channels[channel] = options;
    this.channelsCount++;
    if (this.readyState !== PushStream.CLOSED) {
      this.connect();
    }
    Log4js.debug("leaving addChannel");
  },
  removeChannel(channel: string): void {
    if (this.channels[channel]) {
      Log4js.info("removing channel", channel);
      delete this.channels[channel];
      this.channelsCount--;
    }
  },

  removeAllChannels(): void {
    Log4js.info("removing all channels");
    this.channels = {};
    this.channelsCount = 0;
  },

  _setState(state: number): void {
    if (this.readyState !== state) {
      Log4js.info("status changed", state);
      this.readyState = state;
      if (this.onstatuschange) {
        this.onstatuschange(this.readyState);
      }
    }
  },

  connect(): void {
    Log4js.debug("entering connect");
    if (!this.host) {
      throw new Error("PushStream host not specified");
    }
    if (isNaN(this.port)) {
      throw new Error("PushStream port not specified");
    }
    if (!this.channelsCount) {
      throw new Error("No channels specified");
    }
    if (this.wrappers.length === 0) {
      throw new Error("No available support for this browser");
    }

    this._keepConnected = true;
    this._lastUsedMode = 0;
    this._connect();

    Log4js.debug("leaving connect");
  },

  disconnect(): void {
    Log4js.debug("entering disconnect");
    this._keepConnected = false;
    this._disconnect();
    this._setState(PushStream.CLOSED);
    Log4js.info("disconnected");
    Log4js.debug("leaving disconnect");
  },

  _useControlArguments(): boolean {
    return this.messagesControlByArgument && ((this._lastModified !== null) || (this._lastEventId !== null));
  },

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
    this.wrapper = this.wrappers[this._lastUsedMode++ % this.wrappers.length];

    try {
      this.wrapper.connect();
    } catch (e) {
      // each wrapper has a cleanup routine at disconnect method
      if (this.wrapper) {
        this.wrapper.disconnect();
      }
    }
  },

  _disconnect(): void {
    this._reconnecttimer = clearTimer(this._reconnecttimer);
    if (this.wrapper) {
      this.wrapper.disconnect();
    }
  },

  _onopen(): void {
    this._reconnecttimer = clearTimer(this._reconnecttimer);
    this._setState(PushStream.OPEN);
    if (this._lastUsedMode > 0) {
      this._lastUsedMode--; // use same mode on next connection
    }
  },

  _onclose(): void {
    this._reconnecttimer = clearTimer(this._reconnecttimer);
    this._setState(PushStream.CLOSED);
    this._reconnect(this.reconnectOnTimeoutInterval);
  },

  _onmessage(text: string, id: number, channel: string, eventid: string, isLastMessageFromBatch: boolean): void {
    Log4js.debug("message", text, id, channel, eventid, isLastMessageFromBatch);
    if (id === -2) {
      if (this.onchanneldeleted) {
        this.onchanneldeleted(channel);
      }
    } else if (id > 0) {
      if (this.onmessage) {
        this.onmessage(text, id, channel, eventid, isLastMessageFromBatch);
      }
    }
  },

  _onerror(error: any): void {
    console.log('streamError', error);
    this._setState(PushStream.CLOSED);
    this._reconnect((error.type === "timeout") ? this.reconnectOnTimeoutInterval : this.reconnectOnChannelUnavailableInterval);
    if (this.onerror) {
      this.onerror(error);
    }
  },

  _reconnect(timeout: number): void {
    if (this._keepConnected && !this._reconnecttimer && (this.readyState !== PushStream.CONNECTING)) {
      Log4js.info("trying to reconnect in", timeout);
      this._reconnecttimer = window.setTimeout(linker(this._connect, this), timeout);
    }
  },

  sendMessage(message: string, successCallback?: () => void, errorCallback?: () => void): void {
    message = escapeText(message);
    // if (this.wrapper.type === WebSocketWrapper.TYPE) {
    //   this.wrapper.sendMessage(message);
    //   if (successCallback) {
    //     successCallback();
    //   }
    // } else {
      Ajax.post({ url: getPublisherUrl(this), data: message, success: successCallback, error: errorCallback, crossDomain: this._crossDomain });
    //}
  }
};

export {PushStream}