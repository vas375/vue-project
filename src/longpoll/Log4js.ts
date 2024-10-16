import { PushStream } from "./pushstream2";

interface Logger{
  logger:any;
  debug(...args: any[]): void;
  info(...args: any[]): void;
  error(...args: any[]): void;
  _initLogger:any;
  _log:any;
}

const Log4js: Logger = {
  logger: null,
  debug: function(...args: any[]) {
    if (PushStream.LOG_LEVEL === 'debug') {
      Log4js._log(...args);
    }
  },
  info: function(...args: any[]) {
    if (PushStream.LOG_LEVEL === 'info' || PushStream.LOG_LEVEL === 'debug') {
      Log4js._log(...args);
    }
  },
  error: function(...args: any[]) {
    Log4js._log(...args);
  },
  _initLogger: function() {
    const console = window.console;
    if (console && console.log) {
        Log4js.logger = console.log;
       if (typeof console.log === 'object' && Function.prototype.bind) {
        Log4js.logger = Function.prototype.bind.call(console.log, console);
      } else if (typeof console.log === 'object' && Function.prototype.call) {
        Log4js.logger = function() {
          Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
        };
      }
    }
  },
  _log: function(...args: any[]) {
    if (!Log4js.logger) {
      Log4js._initLogger();
    }

    if (Log4js.logger) {
      try {
        Log4js.logger.apply(window.console, args);
      } catch (e) {
        Log4js._initLogger();
        if (Log4js.logger) {
          Log4js.logger.apply(window.console, args);
        }
      }
    }

    const logElement = document.getElementById(PushStream.LOG_OUTPUT_ELEMENT_ID);
    if (logElement) {
      let str = '';
      for (let i = 0; i < args.length; i++) {
        str += args[i] + ' ';
      }
      logElement.innerHTML += str + '\n';

      const lines = logElement.innerHTML.split('\n');
      if (lines.length > 100) {
        logElement.innerHTML = lines.slice(-100).join('\n');
      }
    }
  },
};

export default Log4js;
