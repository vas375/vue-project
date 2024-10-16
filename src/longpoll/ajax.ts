import {addParamsToUrl, clearTimer, currentTimestampParam, extend, getTime, objectToUrlParams} from './common'
// interface AjaxSettings {
//   url: string;
//   timeout?: number;
//   crossDomain?: boolean;
//   data?: any;
//   beforeSend?: (xhr: XMLHttpRequest) => void;
//   beforeOpen?: (xhr: XMLHttpRequest) => void;
//   afterReceive?: (xhr: XMLHttpRequest) => void;
//   success?: (response: any) => void;
//   error?: (status: number) => void;
//   load?: () => void;
//   scriptId?: any;
//   timeoutId?: number;
//   xhr?: XMLHttpRequest;
//   afterSuccess?: boolean;
// }
export const Ajax: any = {
  _getXHRObject(crossDomain: boolean): XMLHttpRequest | false {
    let xhr: XMLHttpRequest | false = false;
    if (crossDomain) {
      try {
        //xhr = new window.XDomainRequest();
        xhr = new XMLHttpRequest();
      } catch (e) { /* empty */ }
      if (xhr) {
        return xhr;
      }
    }

    try {
      xhr = new window.XMLHttpRequest();
    } catch (e1) {
      // try {
      //   xhr = new window.ActiveXObject("Msxml2.XMLHTTP");
      // } catch (e2) {
      //   try {
      //     xhr = new window.ActiveXObject("Microsoft.XMLHTTP");
      //   } catch (e3) {
      //     xhr = false;
      //   }
      // }
    }
    return xhr;
  },

  _send(settings: any, post: boolean): XMLHttpRequest | undefined {
    settings = settings || {};
    settings.timeout = settings.timeout || 30000;
    const xhr: XMLHttpRequest | undefined = Ajax._getXHRObject(settings.crossDomain);
    if (!xhr || !settings.url) {
      return;
    }

    Ajax.clear(settings);

    settings.xhr = xhr;

    // if (window.XDomainRequest && xhr instanceof window.XDomainRequest) {
    //   xhr.onload = function() {
    //     if (settings.afterReceive) {
    //       settings.afterReceive(xhr);
    //     }
    //     if (settings.success) {
    //       settings.success(xhr.responseText);
    //     }
    //   };

    //   xhr.onerror = xhr.ontimeout = function() {
    //     if (settings.afterReceive) {
    //       settings.afterReceive(xhr);
    //     }
    //     if (settings.error) {
    //       settings.error(xhr.status);
    //     }
    //   };
    // } else {
      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
          Ajax.clear(settings);
          if (settings.afterReceive) {
            settings.afterReceive(xhr);
          }
          if (xhr.status === 200) {
            if (settings.success) {
              settings.success(xhr.responseText);
            }
          } else {
            if (settings.error) {
              settings.error(xhr.status);
            }
          }
        }
      };
    //}

    if (settings.beforeOpen) {
      settings.beforeOpen(xhr);
    }

    let params: any = {};
    let body: string | null = null;
    let method: string = "GET";
    if (post) {
      body = objectToUrlParams(settings.data);
      method = "POST";
    } else {
      params = settings.data || {};
    }

    // var addParamsToUrl = function(url, params) {
    //   return url + ((url.indexOf('?') < 0) ? '?' : '&') + objectToUrlParams(params);
    // };

    xhr.open(
      method,
      addParamsToUrl(settings.url, extend({}, params, currentTimestampParam())),
      true
    );

    if (settings.beforeSend) {
      settings.beforeSend(xhr);
    }

    const onerror = function() {
      Ajax.clear(settings);
      try {
        xhr.abort();
      } catch (e) {
        /* ignore error on closing */
      }
      settings.error(304);
    };

    if (post) {
      if (xhr.setRequestHeader) {
        xhr.setRequestHeader("Accept", "application/json");
        xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      }
    } else {
      settings.timeoutId = window.setTimeout(onerror, settings.timeout + 2000);
    }

    xhr.send(body);
    return xhr;
  },

  _clear_xhr(xhr: XMLHttpRequest | undefined): void {
    if (xhr) {
      xhr.onreadystatechange = null;
    }
  },

  _clear_script(script: any): void {
    if (script) {
      script.onerror = script.onload = script.onratechange = null; //script.onreadystatechange = null;
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    }
  },

  _clear_timeout(settings: any) {
    settings.timeoutId = clearTimer(settings.timeoutId);
  },

  _clear_jsonp(settings: any) {
    const callbackFunctionName = settings.data.callback;
    if (callbackFunctionName) {
      (window as any)[callbackFunctionName] = function() {
        (window as any)[callbackFunctionName] = null;
      };
    }
  },

  clear(settings:any) {
    Ajax._clear_timeout(settings);
    Ajax._clear_jsonp(settings);
    Ajax._clear_script(document.getElementById(settings.scriptId));
    Ajax._clear_xhr(settings.xhr);
  },

  jsonp(settings:any) {
    settings.timeout = settings.timeout || 30000;
    Ajax.clear(settings);

    const head = document.head || document.getElementsByTagName("head")[0];
    const script = document.createElement("script");
    const startTime = getTime();

    const onerror = function() {
      Ajax.clear(settings);
      const endTime = getTime();
      settings.error((endTime - startTime) > settings.timeout / 2 ? 304 : 403);
    };

    const onload = function() {
      Ajax.clear(settings);
      settings.load();
    };

    const onsuccess = function() {
      settings.afterSuccess = true;
      settings.success.apply(null, arguments);
    };

    script.onerror = onerror;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    script.onload = function(eventLoad: any) {
        if (settings.afterSuccess) {
          onload();
        } else {
          onerror();
        }
    };

    if (settings.beforeOpen) {
      settings.beforeOpen({});
    }
    if (settings.beforeSend) {
      settings.beforeSend({});
    }

    settings.timeoutId = window.setTimeout(onerror, settings.timeout + 2000);
    settings.scriptId = settings.scriptId || getTime();
    settings.afterSuccess = null;

    settings.data.callback = settings.scriptId + "_onmessage_" + getTime();
    (window as any)[settings.data.callback] = onsuccess;

    script.setAttribute("src", addParamsToUrl(settings.url, extend({}, settings.data, currentTimestampParam())));
    script.setAttribute("async", "async");
    script.setAttribute("id", settings.scriptId);

    head.insertBefore(script, head.firstChild);
    return settings;
  },

  load(settings:any): XMLHttpRequest | undefined {
    return Ajax._send(settings, false);
  },

  post(settings: any): XMLHttpRequest | undefined {
    return Ajax._send(settings, true);
  }
};
