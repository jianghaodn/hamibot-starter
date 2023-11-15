/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
var __webpack_exports__ = {};

;// CONCATENATED MODULE: ./src/lib/logger.ts
var __extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __spreadArray = undefined && undefined.__spreadArray || function (to, from, pack) {
  if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
    if (ar || !(i in from)) {
      if (!ar) ar = Array.prototype.slice.call(from, 0, i);
      ar[i] = from[i];
    }
  }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var FrameCollection = function () {
  function FrameCollection() {
    var frames = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      frames[_i] = arguments[_i];
    }
    this.frames = frames;
  }
  FrameCollection.prototype.clear = function () {
    this.frames.length = 0;
  };
  FrameCollection.prototype.push = function (frame) {
    this.frames.push(frame);
  };
  return FrameCollection;
}();
var TraceCollection = function (_super) {
  __extends(TraceCollection, _super);
  function TraceCollection() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  TraceCollection.prototype.filter = function (callbackFn) {
    var result = new TraceCollection();
    var tempFrame;
    for (var i = 0; i < this.frames.length; i++) {
      tempFrame = this.frames[i];
      if (callbackFn(tempFrame, i, this.frames)) {
        result.push(tempFrame);
      }
    }
    return result;
  };
  TraceCollection.prototype.toStringArray = function (format) {
    var trace = [];
    for (var _i = 0, _a = this.frames; _i < _a.length; _i++) {
      var frame = _a[_i];
      trace.push(frame.toString(format));
    }
    return trace;
  };
  TraceCollection.prototype.toString = function (format) {
    var trace = [];
    for (var _i = 0, _a = this.frames; _i < _a.length; _i++) {
      var frame = _a[_i];
      trace.push(frame.toString(format));
    }
    return trace.join("\n");
  };
  return TraceCollection;
}(FrameCollection);
var LogCollection = function (_super) {
  __extends(LogCollection, _super);
  function LogCollection() {
    return _super !== null && _super.apply(this, arguments) || this;
  }
  LogCollection.prototype.filter = function (callbackFn) {
    var result = new LogCollection();
    var tempFrame;
    for (var i = 0; i < this.frames.length; i++) {
      tempFrame = this.frames[i];
      if (callbackFn(tempFrame, i, this.frames)) {
        result.push(tempFrame);
      }
    }
    return result;
  };
  LogCollection.prototype.toHtmlString = function () {
    var stack = ["<div style=\"\n                font-size: 15px;\n                font-family: monospace;\n                word-wrap:break-word;\n            \">"];
    for (var i = 0; i < this.frames.length; i++) {
      stack.push(this.frames[i].toHtmlString());
    }
    stack.push('</div>');
    return stack.join('\n');
  };
  LogCollection.prototype.toStringArray = function () {
    var stack = [];
    for (var i = 0; i < this.frames.length; i++) {
      stack.push(this.frames[i].toString());
    }
    return stack;
  };
  LogCollection.prototype.toString = function () {
    var stack = [];
    for (var i = 0; i < this.frames.length; i++) {
      stack.push(this.frames[i].toString());
    }
    return stack.join('\n');
  };
  return LogCollection;
}(FrameCollection);
var TraceStackFrame = function () {
  function TraceStackFrame(line, callerName) {
    this.line = line;
    this.callerName = callerName;
  }
  TraceStackFrame.prototype.getLine = function () {
    return this.line;
  };
  TraceStackFrame.prototype.getCallerName = function () {
    return this.callerName;
  };
  TraceStackFrame.prototype.setCallerName = function (callerName) {
    this.callerName = callerName;
  };
  TraceStackFrame.prototype.toString = function (format) {
    return (format !== null && format !== void 0 ? format : defaultFormatter)(this.line, this.callerName);
  };
  return TraceStackFrame;
}();
var LogStackFrame = function () {
  function LogStackFrame(data, scheme) {
    this.data = data;
    this.scheme = scheme !== null && scheme !== void 0 ? scheme : LoggerSchemes.log;
  }
  LogStackFrame.prototype.getLevel = function () {
    return this.scheme.level;
  };
  LogStackFrame.prototype.getData = function () {
    return this.data;
  };
  LogStackFrame.prototype.toString = function () {
    return this.data;
  };
  LogStackFrame.prototype.toHtmlString = function () {
    var htmlArray = [];
    var startTag = "<span style='color: ".concat(this.scheme.color, ";'>");
    var endTag = "</span></br>";
    for (var _i = 0, _a = this.data.split('\n'); _i < _a.length; _i++) {
      var line = _a[_i];
      line = line.replace(/[<>&"'`\/]/g, function (c) {
        return {
          '<': '&lt;',
          '>': '&gt;',
          '&': '&amp;',
          '"': '&quot;',
          '\'': '&#39;',
          '`': '&#96',
          '\/': '&#x2F'
        }[c];
      });
      htmlArray.push([startTag, line, endTag].join(''));
    }
    return htmlArray.join('\n');
  };
  return LogStackFrame;
}();
var LogLevel;
(function (LogLevel) {
  LogLevel[LogLevel["Debug"] = 0] = "Debug";
  LogLevel[LogLevel["Log"] = 1] = "Log";
  LogLevel[LogLevel["Info"] = 2] = "Info";
  LogLevel[LogLevel["Warn"] = 3] = "Warn";
  LogLevel[LogLevel["Error"] = 4] = "Error";
})(LogLevel || (LogLevel = {}));
var LoggerSchemes = function () {
  function LoggerSchemes() {}
  LoggerSchemes.trace = {
    'displayName': 'TRACE',
    'logFunction': console.verbose,
    'color': 'lightgrey',
    'level': LogLevel.Debug
  };
  LoggerSchemes.debug = {
    'displayName': 'DEBUG',
    'logFunction': console.verbose,
    'color': 'lightgrey',
    'level': LogLevel.Debug
  };
  LoggerSchemes.log = {
    'displayName': ' LOG ',
    'logFunction': console.log,
    'color': 'black',
    'level': LogLevel.Log
  };
  LoggerSchemes.info = {
    'displayName': 'INFO',
    'logFunction': console.info,
    'color': 'green',
    'level': LogLevel.Info
  };
  LoggerSchemes.warn = {
    'displayName': 'WARN',
    'logFunction': console.warn,
    'color': 'yellow',
    'level': LogLevel.Warn
  };
  LoggerSchemes.error = {
    'displayName': 'ERROR',
    'logFunction': console.error,
    'color': 'red',
    'level': LogLevel.Error
  };
  return LoggerSchemes;
}();

var LOG_STACK = new LogCollection();
var _token = null;
function getCallerName(index) {
  if (index === void 0) {
    index = 0;
  }
  var trace = sliceStackFrames(getRawStackTrace(), 1, 0);
  var stackFrames = parseTrace(trace);
  if (index < 0) index = 0;
  if (index > stackFrames.length - 1) index = stackFrames.length - 1;
  return stackFrames[index].getCallerName();
}
function getRawStackTrace(endFunction) {
  var stackTrace = {
    stack: ''
  };
  Error.captureStackTrace(stackTrace, endFunction);
  return sliceStackFrames(stackTrace.stack, 1, -2);
}
function getStackTrace(endFunction) {
  var trace = sliceStackFrames(getRawStackTrace(endFunction), 1, 0);
  return new (TraceCollection.bind.apply(TraceCollection, __spreadArray([void 0], parseTrace(trace), false)))();
}
var DEFAULT_LOG_RECORD_CONFIG = {
  needPrint: true,
  needRecord: true,
  skipCallerNumber: 1
};
var Record = function () {
  function Record() {}
  Record.setRecordLevel = function (level) {
    Record.RECORD_LEVEL = level;
  };
  Record.setDisplayLevel = function (level) {
    Record.DISPLAY_LEVEL = level;
  };
  Record.log = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return Record.recLog(LoggerSchemes.log, DEFAULT_LOG_RECORD_CONFIG, util.format.apply(util, __spreadArray([message], args, false)));
  };
  Record.verbose = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return Record.recLog(LoggerSchemes.debug, DEFAULT_LOG_RECORD_CONFIG, util.format.apply(util, __spreadArray([message], args, false)));
  };
  Record.info = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return Record.recLog(LoggerSchemes.info, DEFAULT_LOG_RECORD_CONFIG, util.format.apply(util, __spreadArray([message], args, false)));
  };
  Record.warn = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return Record.recLog(LoggerSchemes.warn, DEFAULT_LOG_RECORD_CONFIG, util.format.apply(util, __spreadArray([message], args, false)));
  };
  Record.error = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    return Record.recLog(LoggerSchemes.error, DEFAULT_LOG_RECORD_CONFIG, util.format.apply(util, __spreadArray([message], args, false)));
  };
  Record.trace = function (message) {
    var args = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      args[_i - 1] = arguments[_i];
    }
    var trace = sliceStackFrames(getRawStackTrace(), 1, 0);
    var parsedTrace = new (TraceCollection.bind.apply(TraceCollection, __spreadArray([void 0], parseTrace(trace), false)))();
    message = util.format.apply(util, __spreadArray([message], args, false));
    return Record.recLog(LoggerSchemes.trace, DEFAULT_LOG_RECORD_CONFIG, "".concat(message, "\n").concat(parsedTrace.toString()));
  };
  Record.traceWithCustomFormatter = function (formatter, message) {
    var args = [];
    for (var _i = 2; _i < arguments.length; _i++) {
      args[_i - 2] = arguments[_i];
    }
    var trace = sliceStackFrames(getRawStackTrace(), 1, 0);
    var parsedTrace = new (TraceCollection.bind.apply(TraceCollection, __spreadArray([void 0], parseTrace(trace), false)))();
    message = util.format.apply(util, __spreadArray([message], args, false));
    return Record.recLog(LoggerSchemes.trace, DEFAULT_LOG_RECORD_CONFIG, "".concat(message, "\n").concat(parsedTrace.toString(formatter)));
  };
  Record.customLog = function (scheme, config, message) {
    var args = [];
    for (var _i = 3; _i < arguments.length; _i++) {
      args[_i - 3] = arguments[_i];
    }
    return Record.recLog(scheme, config, util.format.apply(util, __spreadArray([message], args, false)));
  };
  Record.recLog = function (scheme, config, logMessage) {
    var _a, _b, _c, _d;
    logMessage = "[".concat(scheme.displayName, "] [").concat(getCallerName(config.skipCallerNumber), "]: ").concat(logMessage);
    var needRecord = (_b = (_a = config.needRecord) !== null && _a !== void 0 ? _a : scheme.needRecord) !== null && _b !== void 0 ? _b : true;
    if (needRecord && scheme.level >= Record.RECORD_LEVEL) {
      LOG_STACK.push(new LogStackFrame(logMessage, scheme));
    }
    var needPrint = (_d = (_c = config.needPrint) !== null && _c !== void 0 ? _c : scheme.needPrint) !== null && _d !== void 0 ? _d : true;
    if (needPrint && scheme.level >= Record.DISPLAY_LEVEL) {
      scheme.logFunction(logMessage);
    }
    return logMessage;
  };
  Record.RECORD_LEVEL = LogLevel.Debug;
  Record.DISPLAY_LEVEL = LogLevel.Debug;
  Record.debug = Record.verbose;
  return Record;
}();

function setToken(token) {
  if (token.length !== 32 || /^\d*$/.test(token)) {
    return false;
  }
  _token = token;
  return true;
}
function sendMessage(title, data) {
  var args = [];
  for (var _i = 2; _i < arguments.length; _i++) {
    args[_i - 2] = arguments[_i];
  }
  data = util.format.apply(util, __spreadArray([data], args, false));
  return sendToRemote(title, data);
}
function sendLog(logs, title, clear) {
  logs = logs !== null && logs !== void 0 ? logs : LOG_STACK;
  title = title !== null && title !== void 0 ? title : 'logger';
  clear = clear !== null && clear !== void 0 ? clear : true;
  var isSend = sendToRemote(title, logs.toHtmlString());
  if (isSend && clear) {
    logs.clear();
  }
  return isSend;
}
function sliceStackFrames(stackTrace, start, end) {
  if (start === void 0) {
    start = 0;
  }
  if (end === void 0) {
    end = 0;
  }
  if (stackTrace === '') return '';
  var temp = stackTrace.split('\n');
  if (end <= 0) end = temp.length + end;
  if (start < 0) {
    start = 0;
  } else if (start > temp.length - 1) {
    start = temp.length - 1;
  }
  if (end > temp.length) {
    end = temp.length;
  } else if (end <= start) {
    return '';
  }
  temp = temp.slice(start, end);
  return temp.join('\n');
}
function parseTrace(originTrace) {
  var _a;
  var stack = [];
  var originStack = originTrace.split('\n');
  for (var _i = 0, originStack_1 = originStack; _i < originStack_1.length; _i++) {
    var item = originStack_1[_i];
    var result = /\:(\d+)(?: \((.*)\))?/.exec(item);
    stack.push(new TraceStackFrame(Number(result[1]) - 3, (_a = result[2]) !== null && _a !== void 0 ? _a : 'Anonymous functions'));
  }
  stack[stack.length - 1].setCallerName("Outer");
  return stack;
}
function sendToRemote(title, message) {
  if (_token === null) {
    return false;
  }
  var res = http.post("http://www.pushplus.plus/send", {
    title: title,
    token: _token,
    content: message,
    template: 'html'
  });
  return res.statusCode === 200;
}
function defaultFormatter(line, callerName) {
  return "  | at line ".concat(line, ", in <").concat(callerName, ">");
}
;// CONCATENATED MODULE: ./src/lib/exception.ts
var exception_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var ERROR_EVENTS = events.emitter();
ERROR_EVENTS.on("error", function errorListener(err) {
  Record.customLog(LoggerSchemes.error, {
    needPrint: false,
    needRecord: true,
    skipCallerNumber: 2
  }, err.toString());
});
var BaseException = function (_super) {
  exception_extends(BaseException, _super);
  function BaseException(message) {
    var _this = _super.call(this) || this;
    _this.exceptionType = 'BaseException';
    _this.traceFilter = undefined;
    _this.traceFormatter = undefined;
    _this.message = message;
    var trace = getStackTrace();
    if (_this.traceFilter) {
      trace = trace.filter(_this.traceFilter);
    }
    _this.traceBack = trace.toString(_this.traceFormatter);
    ERROR_EVENTS.emit("error", _this);
    return _this;
  }
  BaseException.prototype.toString = function () {
    return "Traceback (most recent call last):\n" + this.traceBack + "\n" + this.exceptionType + (this.message ? ": " + this.message : "") + "\n";
  };
  return BaseException;
}(Error);

function __isExceptionType(error, targetException) {
  var exceptionType = Object.getOwnPropertyDescriptor(error, "exceptionType");
  if (exceptionType === undefined) {
    return false;
  }
  return exceptionType.value === targetException;
}
function isBaseException(error) {
  return __isExceptionType(error, "BaseException");
}
var PermissionException = function (_super) {
  exception_extends(PermissionException, _super);
  function PermissionException() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.exceptionType = "PermissionException";
    return _this;
  }
  return PermissionException;
}(BaseException);

function isPermissionException(error) {
  return __isExceptionType(error, 'PermissionException');
}
var ServiceNotEnabled = function (_super) {
  exception_extends(ServiceNotEnabled, _super);
  function ServiceNotEnabled() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.exceptionType = "ServiceNotEnabled";
    return _this;
  }
  return ServiceNotEnabled;
}(BaseException);

function isServiceNotEnabled(error) {
  return __isExceptionType(error, 'ServiceNotEnabled');
}
var ValueException = function (_super) {
  exception_extends(ValueException, _super);
  function ValueException() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.exceptionType = "ValueException";
    return _this;
  }
  return ValueException;
}(BaseException);

function isValueException(error) {
  return __isExceptionType(error, 'ValueException');
}
var WidgetNotFoundException = function (_super) {
  exception_extends(WidgetNotFoundException, _super);
  function WidgetNotFoundException() {
    var _this = _super !== null && _super.apply(this, arguments) || this;
    _this.exceptionType = "WidgetNotFoundException";
    return _this;
  }
  return WidgetNotFoundException;
}(BaseException);

function isWidgetNotFoundException(error) {
  return __isExceptionType(error, 'WidgetNotFoundException');
}
var ConfigInvalidException = function (_super) {
  exception_extends(ConfigInvalidException, _super);
  function ConfigInvalidException(fieldName, helpInfo) {
    var _this = _super.call(this, "The '".concat(fieldName, "' field in the configuration is invalid").concat(", " + helpInfo, ". ") + "please check it again !") || this;
    _this.exceptionType = "ConfigInvalidException";
    return _this;
  }
  return ConfigInvalidException;
}(ValueException);

function isConfigInvalidException(error) {
  return __isExceptionType(error, 'ConfigInvalidException');
}
;// CONCATENATED MODULE: ./src/global.ts


var PROJECT_NAME = "Untitled Script";
var VERSION = "0.1.0";
var LISTENER_INTERVAL = 100;
var SHORT_WAIT_MS = 300;
var LONG_WAIT_MS = 1000;
var EVENT = events.emitter();
Record.info("Launching...\n\n\tCurrent script version: ".concat(VERSION, "\n"));
var _a = hamibot.env,
  _TOKEN = _a._TOKEN,
  _SHOW_CONSOLE = _a._SHOW_CONSOLE;
events.on("exit", function () {
  threads.shutDownAll();
  Record.info("Exit...");
  var collection = LOG_STACK.filter(function (frame) {
    return frame.getLevel() >= LogLevel.Log;
  });
  if (_TOKEN && _TOKEN !== "") {
    Record.info("Sending logs to pushplus...");
    for (var i = 0; i < 3; i++) {
      if (sendLog(collection, "[LOG] ".concat(PROJECT_NAME))) {
        Record.info("Sending logs succeeds");
        return;
      }
      Record.warn("Sending failed, retry ".concat(i + 1));
    }
    Record.error("Failure to send logs !");
  }
  for (var _i = 0, _a = collection.toStringArray(); _i < _a.length; _i++) {
    var item = _a[_i];
    hamibot.postMessage(item);
  }
  sleep(LONG_WAIT_MS * 5);
  console.hide();
});
Record.info("Verifying configurations");
if (_TOKEN && _TOKEN !== "" && setToken(_TOKEN) == false) {
  throw new ConfigInvalidException("pushplus token", "needs to be a 32-bit hexadecimal number");
}
var SHOW_CONSOLE = true;
Record.info("Start running script");
;// CONCATENATED MODULE: ./src/lib/init.ts



function init() {
  if (auto.service === null) {
    if (!confirm('Please enable accessibility permission')) {
      throw new PermissionException("Accessibility permission obtaining failure.");
    }
    auto.waitFor();
  } else {
    Record.verbose("Accessibility permissions enabled");
  }
  if (device.height === 0 || device.width === 0) {
    throw new ServiceNotEnabled('Failed to get the screen size. ' + 'Please try restarting the service or re-installing Hamibot');
  } else {
    Record.debug("Screen size: " + device.height + " x " + device.width);
  }
  if (SHOW_CONSOLE) {
    console.show();
    sleep(SHORT_WAIT_MS);
    console.setPosition(0, 200);
    console.setSize(device.width / 2, device.height / 4);
  }
}
;// CONCATENATED MODULE: ./src/tools/tool.ts
var tool = function () {
  function tool() {
    var _this = this;
    this.base_log = function (msg) {
      var params = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
      }
      var log_msg = "";
      if (params && params.length != 0) {
        log_msg += msg;
        for (var i = 0; i < params.length; i++) {
          log_msg += params[i];
        }
      } else {
        log_msg = msg + "";
      }
      return log_msg;
    };
    this.log = function (message) {
      var params = [];
      for (var _i = 1; _i < arguments.length; _i++) {
        params[_i - 1] = arguments[_i];
      }
      console.log(message, !params.length ? "" : params);
    };
    this.get_time = function () {
      return new Date().getTime();
    };
    this.sleep = function (timeOut) {
      do {
        console.log("等待%s s", timeOut);
        sleep(1000);
      } while (timeOut--);
    };
    this.findImage = function (big, small, radius, similarity) {
      if (!small) {
        tool_VO.log("图片不存在");
        return;
      }
      var d1 = tool_VO.get_time();
      var re = images.findImage(big, small, {
        region: radius || [0, 0, device.width, device.height],
        threshold: similarity || 0.9
      });
      var d2 = tool_VO.get_time();
      re && tool_VO.log("找图完成，用时:" + (d2 - d1) + "ms");
      small.recycle();
      return re;
    };
    this.hasAll = function (node) {
      return node.find();
    };
    this.hasOne = function (node, timeOut) {
      return node.findOne(timeOut || 1000);
    };
    this.get_node = function (name) {
      return text(name).findOne(1000);
    };
    this.show_console = function (SHOW_CONSOLE, obj) {
      if (SHOW_CONSOLE) {
        console.show();
        sleep(500);
        console.setPosition(obj && obj.x || 0, obj && obj.y || 200);
        console.setSize(obj && obj.weight || device.width / 2, obj && obj.height || device.height / 4);
      }
    };
    this.stop = function () {
      threads.shutDownAll();
      sleep(3000);
      console.hide();
    };
    this.request = function () {
      if (device.sdkInt > 28) {
        threads.start(function () {
          var _a;
          packageName("com.android.systemui").text("立即开始").waitFor();
          (_a = text("立即开始").findOne(1000)) === null || _a === void 0 ? void 0 : _a.click();
        });
      }
      if (!requestScreenCapture()) {
        toast("请求截图失败");
        return -1;
      }
      sleep(1000);
      return 0;
    };
    this.prepare = function () {
      auto.waitFor();
      _this.request();
      _this.show_console(true);
    };
    this.clickOnBound = function (obj) {
      var bounds = obj.bounds();
      console.log(bounds.left, bounds.right, bounds.top, bounds.bottom);
      var x = bounds.centerX();
      var y = bounds.centerY();
      console.log("点击坐标:[", x, ",", y, "]");
      click(x, y);
      sleep(1000);
      return true;
    };
    this.clickNodeNotNull = function (node, msg) {
      var click_re = false;
      if (!node) {
        _this.log("不存在此节点", node);
      } else {
        try {
          if (node.packageName === "com.vivo.browser") {
            console.log("浏览器，直接点击坐标");
            _this.clickOnBound(node);
          } else {
            if (!node.click()) {
              _this.log("click失败，更改方式");
              sleep(1000);
              click_re = _this.clickOnBound(node);
            } else {
              click_re = true;
            }
          }
          msg && tool_VO.log(msg);
        } catch (e) {
          _this.log(e);
        }
      }
      return click_re;
    };
    this.runWithCatch = function (func, _final) {
      _this.log("运行任务：", func.name);
      var re;
      try {
        re = func();
      } catch (error) {
        console.error(error);
      } finally {
        if (_final) {
          _final();
        }
      }
      tool_VO.log(func.name, "执行完毕");
      return re;
    };
    this.atPage = function (pageNode, timeOut) {
      return timeOut ? _this.hasOne(pageNode, timeOut) : pageNode && pageNode.exists();
    };
    this.clickNode = function (node) {
      var nodeInfo = node.findOne(100);
      _this.clickNodeNotNull(nodeInfo);
    };
    this.backToPage = function (pageNode, timeOut) {
      while (pageNode && !_this.hasOne(pageNode, 10)) {
        back();
        sleep(timeOut || 1000);
      }
      tool_VO.log("已经返回到了指定的界面");
      sleep(1000);
    };
    this.backToPageOne = function (node_list, timeOut) {
      flag: while (true) {
        for (var _i = 0, node_list_1 = node_list; _i < node_list_1.length; _i++) {
          var iterator = node_list_1[_i];
          if (iterator && _this.hasNode(iterator)) {
            break flag;
          }
        }
        back();
        sleep(timeOut || 1000);
      }
      tool_VO.log("已经返回到了指定的界面");
      sleep(1000);
    };
    this.hasNode = function (node) {
      return node && node.findOne(10);
    };
    this.closeApp = function (package_name) {
      _this.openAppDetail(package_name);
      var running = true;
      threads.start(function () {
        while (running) {
          var node = textContains("强行停止");
          node.waitFor();
          tool_VO.clickNodeNotNull(node.findOnce());
          sleep(1000);
          break;
        }
      });
      threads.start(function () {
        while (running) {
          var node1 = text("确定");
          node1.waitFor();
          tool_VO.clickNodeNotNull(node1.findOnce());
          sleep(1000);
          break;
        }
      });
      sleep(3000);
      back();
      sleep(500);
      back();
      running = false;
      sleep(1000);
    };
    this.openAppDetail = function (name) {
      var match_re = new RegExp(/.+\..+\..+/).test(name);
      if (!match_re) {
        name = app.getPackageName(name);
        if (!name) {
          tool_VO.error("打开应用详情失败，应用%s不存在", name);
          return false;
        }
      }
      sleep(1000);
      var re = app.openAppSetting(name);
      sleep(1000);
      return re;
    };
    this.reg = function (str, reg) {
      return str.match(reg).filter(function (it) {
        it != '';
      });
    };
    this.runThread = function (func, isLoop) {
      var re;
      threads.start(function () {
        do {
          re = func();
          sleep(1000);
        } while (isLoop);
      });
      return re;
    };
    this.waitNode = function (node, timeOut, throw_e, throw_msg) {
      if (!timeOut) {
        node.waitFor();
        return true;
      }
      while (timeOut--) {
        _this.log("等待节点", node);
        if (_this.hasNode(node)) {
          tool_VO.log("找到了节点:", node);
          return true;
        }
        sleep(1000);
      }
      if (throw_e) {
        throw new Error(throw_msg);
      }
      return false;
    };
    this.runWithAgain = function (func) {
      try {
        tool_VO.runWithCatch(func);
      } catch (error) {
        console.error(error);
        console.log("由于出现问题，重新运行一次");
        tool_VO.runWithCatch(func);
      } finally {
        console.log("".concat(func.name, "\u8FD0\u884C\u5B8C\u6210"));
      }
    };
  }
  tool.prototype.warning = function (msg) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }
    console.warn(msg, !params.length ? "" : params);
  };
  ;
  tool.prototype.error = function (message) {
    var params = [];
    for (var _i = 1; _i < arguments.length; _i++) {
      params[_i - 1] = arguments[_i];
    }
    console.error(message, !params.length ? "" : params);
  };
  return tool;
}();
var tool_VO = new tool();
var ENTER;
(function (ENTER) {
  ENTER[ENTER["SUCCESS"] = 0] = "SUCCESS";
  ENTER[ENTER["FAIL"] = 1] = "FAIL";
  ENTER[ENTER["ERROR"] = 2] = "ERROR";
})(ENTER || (ENTER = {}));

;// CONCATENATED MODULE: ./src/exception/exceptions.ts
var exceptions_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();

var activityDoNotDoException = function (_super) {
  exceptions_extends(activityDoNotDoException, _super);
  function activityDoNotDoException(msg) {
    return _super.call(this, msg) || this;
  }
  return activityDoNotDoException;
}(BaseException);

;// CONCATENATED MODULE: ./src/CONSTANT.ts
var PACKAGE = {
  QUYUE: "com.vivo.vreader",
  BROWSER: "com.vivo.browser"
};
;// CONCATENATED MODULE: ./src/modules/browser.ts



var activity = function () {
  function activity(name, node, run) {
    if (run === void 0) {
      run = true;
    }
    this.name = name;
    this.node = node;
    this.run = run;
  }
  return activity;
}();

var activity_list = [];
activity_list.push(new activity("每日首次下载"), new activity("点击搜索词领金币", text("随机搜索得金币")), new activity("下载推荐应用领金币", textContains("我要金币")), new activity("幸运抽大奖", textContains("去抽奖"), true), new activity("日常福利", undefined, false), new activity("逛一逛领金币", textContains("逛一逛")));
var browser_package = "com.vivo.browser";
var _进入活动主页面 = function _进入活动主页面() {
  var _a;
  var goalPage = packageName("com.vivo.browser").text("下载应用赚金币");
  var home_btn = id("tool_bar_btn_home");
  var enter_state = ENTER.SUCCESS;
  app.launch;
  var enter_activity_running = true;
  tool_VO.runThread(function () {
    while (enter_activity_running) {
      if (tool_VO.hasNode(id("dialog_close"))) {
        tool_VO.clickNodeNotNull(id("dialog_close").findOnce());
        sleep(1000);
      }
      sleep(100);
    }
  }, false);
  if (!tool_VO.atPage(goalPage)) {
    tool_VO.closeApp("com.vivo.browser");
    if (!app.launch("com.vivo.browser")) {
      console.error("打开 浏览器 失败");
      enter_state = ENTER.FAIL;
    } else {
      tool_VO.log("打开应用成功");
      sleep(2000);
      if (tool_VO.hasOne(home_btn, 2000)) {
        tool_VO.clickNode(home_btn);
      }
      if (!tool_VO.hasOne(goalPage, 2000)) {
        var goal_node1 = id("btn_text").text("免费小说");
        var goal_node2 = id("tv").text("小说");
        if (tool_VO.hasOne(goal_node1, 2000)) {
          tool_VO.log("采用第一种方式");
          tool_VO.clickNode(goal_node1);
        } else if (tool_VO.hasOne(goal_node2, 2000)) {
          tool_VO.log("采用第二种方式");
          tool_VO.clickNodeNotNull(goal_node2.findOnce().parent());
        } else {
          enter_state = ENTER.FAIL;
          return enter_state;
        }
        enter_activity_running = false;
        if (!tool_VO.atPage(goalPage, 3000)) {
          var node = (_a = id("channel_image_view").findOne(1000)) === null || _a === void 0 ? void 0 : _a.parent();
          if (node) {
            tool_VO.clickNodeNotNull(node);
            if (!tool_VO.atPage(goalPage, 2000)) {
              console.error("进入失败，无法进入");
              enter_state = ENTER.FAIL;
            } else {
              tool_VO.log("已经进入任务主页面，开始脚本");
            }
          } else {
            console.error("进入失败，无法进入");
            enter_state = ENTER.FAIL;
          }
        } else {
          tool_VO.log("已经进入任务主页面，开始脚本");
        }
      } else {
        enter_state = ENTER.FAIL;
      }
    }
  }
  return enter_state;
};
var 进入活动主页面 = function 进入活动主页面() {
  return tool_VO.runWithCatch(_进入活动主页面);
};
var 逛一逛领金币 = function 逛一逛领金币() {
  if (!tool_VO.atPage(textMatches("^浏览.*秒可领.*金币$"))) {
    tool_VO.warning("不在任务页面");
  }
  sleep(2000);
  var 逛一逛_btn = text("逛一逛-按钮-点按两次即可激活");
  var 奖励文字 = textMatches("逛一逛领金币 滑动浏览最高可获.*金币");
  var single_coin = 100;
  var count = 5;
  var get_count = function get_count() {
    var _a, _b;
    if (tool_VO.hasOne(奖励文字), 3000) {
      count = count || parseInt((((_b = (_a = 奖励文字.findOne(1000)) === null || _a === void 0 ? void 0 : _a.text()) === null || _b === void 0 ? void 0 : _b.match(/\d+/)) || [])[0] || "0") / single_coin;
    }
  };
  get_count();
  if (!tool_VO.waitNode(逛一逛_btn, 3)) {
    throw new Error("找不到逛一逛_btn");
    return;
  }
  tool_VO.clickNode(逛一逛_btn);
  var coin_btn = id("act_page_float_browse_text");
  var wait_time_sec = 3 * 60 + 5;
  if (!tool_VO.waitNode(coin_btn, 3)) {
    return;
  }
  var swipe_func = function swipe_func() {
    var x1 = random(100, 200);
    var y1 = random(2000, 2050);
    var x2 = random(1000, 2000);
    var y2 = random(500, 600);
    var duration = random(500, 1000);
    swipe(x1, y1, x2, y2, duration);
    sleep(1000);
  };
  while (count-- && tool_VO.hasNode(coin_btn)) {
    var remainint_time = parseInt(coin_btn.findOne(1000).text());
    if (remainint_time >= 0) {
      var swipe_count = 7;
      while (swipe_count--) {
        sleep(9 * 1000);
        swipe_func();
      }
    }
    if (tool_VO.hasNode(coin_btn)) {
      tool_VO.log("等待", wait_time_sec, "秒");
      sleep(wait_time_sec * 1000);
    } else {
      break;
    }
    console.log("等待完毕，继续运行");
  }
  tool_VO.log(Function.name, "运行完毕");
};
var 下载推荐应用领金币 = function 下载推荐应用领金币(obj) {
  var mainPage = text("互动领奖专区");
  var browser_packageName = "com.vivo.browser";
  var search_time = 8;
  var browserPage = (obj === null || obj === void 0 ? void 0 : obj.goalPage) || id("cl_novel_search_bar_welfare_container");
  var flag1 = 0,
    flag2 = 0;
  var f1_max = 20,
    f2_max = 30;
  var f1_single = 100,
    f2_single = 100;
  var count = (obj === null || obj === void 0 ? void 0 : obj.all_count) || 8;
  var running = true;
  var data = obj === null || obj === void 0 ? void 0 : obj.data;
  var get_run_count = function get_run_count() {
    var _a, _b, _c, _d, _e, _f;
    sleep(1000);
    if (!tool_VO.hasOne(textContains("免费领奖"), 3000) && !tool_VO.hasOne(textMatches("点击搜索词.*领金币"), 3000)) {
      flag1 = f1_max = 0;
      f2_max = flag2 = 0;
      tool_VO.warning("没有任何任务");
      return;
    }
    var defaultWaitTime = 3000;
    if (data && data.length) {
      for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var d = data_1[_i];
        if (d.name === "打开领奖") {
          f1_max = d.count;
        } else if (d.name === "搜索领奖") {
          f1_max = d.count;
        }
      }
    }
    if (currentPackage() === PACKAGE.QUYUE) {
      if (tool_VO.hasOne(text("免费领奖"), defaultWaitTime)) {
        var count_node1 = (_b = (_a = text("免费领奖").findOne(3000)) === null || _a === void 0 ? void 0 : _a.parent()) === null || _b === void 0 ? void 0 : _b.child(2);
        flag1 = parseInt((count_node1 === null || count_node1 === void 0 ? void 0 : count_node1.text().split("/")[0]) || "0") / f1_single;
        f1_max = parseInt((count_node1 === null || count_node1 === void 0 ? void 0 : count_node1.text().split("/")[1]) || "0") / f1_single;
      }
      if (tool_VO.hasOne(text("点击搜索词并浏览8秒领金币"), defaultWaitTime)) {
        var count_node2 = (_d = (_c = className("android.widget.TextView").text("点击搜索词并浏览8秒领金币").findOne(3000)) === null || _c === void 0 ? void 0 : _c.parent()) === null || _d === void 0 ? void 0 : _d.child(9);
        if (!count_node2 || !count_node2.text()) {
          count_node2 = (_f = (_e = className("android.widget.TextView").text("点击搜索词并浏览8秒领金币").findOne(3000)) === null || _e === void 0 ? void 0 : _e.parent()) === null || _f === void 0 ? void 0 : _f.child(2);
        }
        flag2 = parseInt((count_node2 === null || count_node2 === void 0 ? void 0 : count_node2.text().split("/")[0]) || "0") / f2_single;
        f2_max = parseInt((count_node2 === null || count_node2 === void 0 ? void 0 : count_node2.text().split("/")[1]) || "0") / f2_single;
      }
    } else if (currentPackage() === PACKAGE.BROWSER) {
      var str1 = "^免费领奖，已领取.*金币，最高可获得.*金币.*$";
      var str2 = "点击搜索词领金币，已领取.*金币，最高可获得.*金币，搜索下方内容并浏览结果页.*秒，即可获得奖励";
      if (tool_VO.hasOne(textMatches(str1), defaultWaitTime)) {
        var arr = textMatches(str1).findOne().text().match(/\d+/g);
        flag1 = parseInt(arr[0] || "0") / f1_single;
        f1_max = parseInt(arr[1] || "0") / f1_single;
      }
      if (tool_VO.hasOne(textMatches(str2), defaultWaitTime)) {
        var arr = textMatches(str2).findOne().text().match(/\d+/g);
        flag2 = parseInt(arr[0] || "0") / f2_single;
        f2_max = parseInt(arr[1] || "0") / f2_single;
        arr.length >= 3 && (search_time = parseInt(arr[2] || "8"));
      }
    }
    tool_VO.log("更新运行次数：flag1 = ", flag1, ",f1_max = ", f1_max);
    tool_VO.log("更新运行次数：flag2 = ", flag2, ",f2_max = ", f2_max);
  };
  var keys = (obj === null || obj === void 0 ? void 0 : obj.ks) || ["打开领奖", "搜索领奖"];
  tool_VO.log("运行任务keys:", keys.join("&"));
  var _loop_1 = function _loop_1() {
    while (!tool_VO.atPage(mainPage)) {
      tool_VO.log("当前不在页面");
      if (tool_VO.hasOne(text("我要金币-按钮-点按两次即可激活"))) {
        tool_VO.clickNode(text("我要金币-按钮-点按两次即可激活"));
        try {
          tool_VO.waitNode(mainPage, 5, true, "我要金币按钮不存在");
        } catch (error) {
          tool_VO.error(error);
          return "break-flag";
        }
      } else {
        tool_VO.warning("没有在任务界面，且无法进入任务，退出");
        throw new Error("没有在任务界面，且无法进入任务，退出");
      }
      sleep(1000);
    }
    sleep(2000);
    get_run_count();
    var isrunning = true;
    tool_VO.runThread(function () {
      while (isrunning) {
        if (tool_VO.hasNode(packageName("com.vivo.hybrid").id("view_back_icon"))) {
          tool_VO.clickNode(packageName("com.vivo.hybrid").id("view_back_icon"));
          sleep(1000);
        }
        sleep(100);
      }
    }, false);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var key = keys_1[_i];
      if (flag1 >= f1_max && flag2 >= f2_max) {
        return "break-flag";
      }
      if (key === "打开领奖" && flag1 >= f1_max || key === "搜索领奖" && flag2 >= f2_max) {
        continue;
      }
      sleep(1000);
      var keyNodes = textContains(key).find();
      var backBrowser = function backBrowser() {
        var obj_package;
        if (obj) {
          obj_package = "com.vivo.vreader";
        } else {
          obj_package = browser_packageName;
        }
        var timeOut = 5;
        while (currentPackage() !== obj_package && timeOut--) {
          app.launch(obj_package);
          sleep(1000);
          console.log("等待返回%s", obj_package);
          tool_VO.waitNode(packageName(obj_package), 5);
        }
        if (!timeOut && !tool_VO.hasNode(packageName(obj_package))) {
          throw new Error("返回" + obj_package + "失败");
        }
      };
      for (var i = 0; i < keyNodes.length; i++) {
        var node = keyNodes[i];
        sleep(1000);
        tool_VO.clickNodeNotNull(node);
        tool_VO.log("执行任务" + key);
        if (key === "打开领奖" && flag1 < f1_max) {
          flag1++;
          sleep(1500);
          backBrowser();
          tool_VO.backToPageOne([mainPage, desc("返回").id("title_view_left").packageName(browser_packageName), text("打开领奖-按钮-点按两次即可激活").packageName(browser_packageName)]);
          tool_VO.log("等待5秒");
          sleep(5000);
        } else if (key === "搜索领奖" && flag2 < f2_max) {
          flag2++;
          tool_VO.log("等待".concat(search_time + "", "秒"));
          sleep((search_time + 2) * 1000);
          tool_VO.backToPage(mainPage, 2000);
        } else {
          tool_VO.backToPage(mainPage);
        }
      }
      sleep(1000);
    }
    isrunning = false;
    tool_VO.backToPage(browserPage);
    sleep(2000);
  };
  flag: while (count--) {
    var state_1 = _loop_1();
    switch (state_1) {
      case "break-flag":
        break flag;
    }
  }
  running = false;
};
var 点击搜索词领金币 = function 点击搜索词领金币() {
  var text_contains = "随机搜索得金币";
  var MS = 1000;
  var ALL_COUNT = 30;
  var has_search = 0;
  var init = function init() {
    has_search = 0;
    ALL_COUNT = 30;
  };
  var finish = function finish() {};
  var getSearchCount = function getSearchCount() {
    if (currentPackage() === "com.vivo.browser") {
      var count_node = textContains("搜索1次得");
      if (tool_VO.hasOne(count_node, 1000)) {
        try {
          var nodeinfo = textContains("搜索1次得").findOne(1000);
          var node_arr = nodeinfo === null || nodeinfo === void 0 ? void 0 : nodeinfo.text().split("/");
          has_search = parseInt(node_arr[0].substring(13));
          ALL_COUNT = parseInt(node_arr[1].substring(0, 2));
        } catch (error) {
          tool_VO.log(error);
        }
      }
    } else {
      has_search = 0;
      ALL_COUNT = 30;
    }
    return ALL_COUNT - has_search;
  };
  var random_swipe = function random_swipe(timeOut) {
    tool_VO.log("随机滑动未实现", timeOut || []);
  };
  var random_search = function random_search() {
    var node = textContains(text_contains);
    if (tool_VO.hasOne(node, 3000)) {
      sleep(2000);
      var count = getSearchCount();
      var sleep_time = 12 * MS;
      while (count--) {
        node.waitFor();
        tool_VO.clickNode(node);
        tool_VO.log("\u7B49\u5F85".concat(sleep_time / MS, "\u79D2"));
        sleep(sleep_time);
        random_swipe();
        back();
        sleep(MS * 3);
        has_search++;
      }
      tool_VO.log("search任务全部完成");
    } else {
      tool_VO.log("根本没有随机搜索的按钮");
    }
  };
  init();
  random_search();
  finish();
};
var firstEnterDownloadApp = function firstEnterDownloadApp() {
  var title_id = id("dialog_title");
  var close_id = id("dialog_close");
  var name_id = id(" tv_novel_dialog_daily_app_name");
  var download_id = id("novel_daily_dialog_download_btn");
  var run = function run() {
    tool_VO.hasNode(download_id) && download_id.findOnce().text() === "下载应用" && tool_VO.clickNode(download_id);
    tool_VO.runThread(function () {
      var start_time = Date.now();
      while (true) {
        text("直接安装").waitFor();
        sleep(1000);
        tool_VO.clickNode(text("直接安装"));
        toastLog("正在使用移动网络下载应用");
        break;
      }
    });
    while (download_id.findOnce().text() !== "打开领奖") {
      sleep(2000);
    }
    sleep(1000);
    tool_VO.clickNode(download_id);
    sleep(2000);
    app.launch(browser_package);
    if (!tool_VO.waitNode(packageName(browser_package), 5000)) {
      _进入活动主页面();
    }
  };
  if (tool_VO.hasOne(title_id, 2000) && tool_VO.hasOne(close_id, 1000) && tool_VO.hasOne(name_id, 1000) && tool_VO.hasOne(download_id, 1000)) {
    sleep(1000);
    run();
    sleep(2000);
  }
};
var 去抽奖 = function 去抽奖() {};
var _run = function _run() {
  for (var _i = 0, activity_list_1 = activity_list; _i < activity_list_1.length; _i++) {
    var app_1 = activity_list_1[_i];
    if (app_1.name === "每日首次下载") {
      tool_VO.runWithCatch(firstEnterDownloadApp);
    } else if (app_1.name === "逛一逛领金币") {
      tool_VO.runWithCatch(逛一逛领金币);
    } else if (app_1.name === "下载推荐应用领金币") {
      tool_VO.runWithCatch(下载推荐应用领金币);
    } else if (app_1.name === "点击搜索词领金币") {
      tool_VO.runWithCatch(点击搜索词领金币);
    } else {
      tool_VO.log("任务" + app_1.name + "不执行");
    }
  }
};
var pre = function pre() {
  tool_VO.log("browser开始运行");
  tool_VO.runThread(function () {
    if (tool_VO.hasNode(text("页面出错了")) && tool_VO.hasNode(text("点击重试"))) {
      tool_VO.clickNode(text("点击重试"));
      sleep(3000);
    }
  });
  if (进入活动主页面() !== ENTER.SUCCESS) {
    throw new activityDoNotDoException("无法执行该浏览器任务");
  }
};
var browser = {
  name: "浏览器脚本任务",
  object: activity_list,
  run: function run() {
    pre();
    if (currentPackage() === "com.vivo.browser") {
      _run();
    } else {
      tool_VO.warning("不在浏览器中，运行结束");
    }
    tool_VO.log("browser运行结束");
    home();
    sleep(3000);
  },
  browser_下载推荐应用领金币: function browser_下载推荐应用领金币(obj) {
    下载推荐应用领金币(obj);
  },
  browser_点击搜索词领金币: function browser_点击搜索词领金币() {
    点击搜索词领金币();
  }
};
var _browser = {
  name: "测试浏览器环境",
  run: function run() {
    var re = 进入活动主页面();
    tool_VO.log("输出测试结果:", re);
  }
};
;// CONCATENATED MODULE: ./src/modules/quyue.ts
var quyue_extends = undefined && undefined.__extends || function () {
  var _extendStatics = function extendStatics(d, b) {
    _extendStatics = Object.setPrototypeOf || {
      __proto__: []
    } instanceof Array && function (d, b) {
      d.__proto__ = b;
    } || function (d, b) {
      for (var p in b) {
        if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
      }
    };
    return _extendStatics(d, b);
  };
  return function (d, b) {
    if (typeof b !== "function" && b !== null) throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    _extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();



var activity_quyue = function (_super) {
  quyue_extends(activity_quyue, _super);
  function activity_quyue(name, node, count, run) {
    if (run === void 0) {
      run = true;
    }
    var _this = _super.call(this, name, node, run) || this;
    _this.run_count = count;
    return _this;
  }
  return activity_quyue;
}(activity);
var quyue_activity_list = [];
var goal_node = id("welfare_txt").text("福利");
quyue_activity_list.push(new activity_quyue("下应用领金币", text("我要金币-按钮-点按两次即可激活"), 6, true), new activity_quyue("看视频领海量金币", text("立即观看-按钮-点按两次即可激活"), -1), new activity_quyue("点击搜索领金币", text("随机搜索得金币"), 30));
var quyue_ = function _进入活动主页面() {
  var enter_state = ENTER.SUCCESS;
  var re = app.launch("com.vivo.vreader");
  if (!re) {
    console.error("打开 趣悦 失败");
    enter_state = ENTER.FAIL;
  } else {
    tool_VO.log("打开应用成功");
    tool_VO.runThread(function () {
      while (enter_state === ENTER.SUCCESS) {
        id("dialog_close").waitFor();
        if (tool_VO.waitNode(id("dialog_close"), 1000)) {
          tool_VO.clickNode(id("dialog_close"));
          break;
        }
        sleep(1000);
      }
    }, false);
    sleep(2000);
    if (!tool_VO.hasOne(id("cl_novel_search_bar_welfare_container"), 2000)) {
      if (tool_VO.hasOne(goal_node, 10000)) {
        tool_VO.clickNode(goal_node);
        if (!tool_VO.hasOne(text("大额专区"), 10000)) {
          console.error("进入失败，无法进入");
          enter_state = ENTER.FAIL;
        } else {
          tool_VO.log("已经进入任务主页面，开始脚本");
        }
      }
    } else {
      enter_state = ENTER.FAIL;
    }
  }
  return enter_state;
};
var modules_quyue_ = function 进入活动主页面() {
  return tool_VO.runWithCatch(quyue_);
};
var _下应用领金币 = function _下应用领金币() {
  browser.browser_下载推荐应用领金币({
    ks: ['打开领奖', '搜索领奖'],
    data: [{
      name: "搜索领奖",
      count: 0
    }, {
      name: "打开领奖",
      count: 0
    }],
    all_count: 6,
    goalPage: id("gold_coin_chest_time")
  });
  tool_VO.backToPage(text("大额专区"));
};
var 下应用领金币 = function 下应用领金币() {
  tool_VO.runWithCatch(_下应用领金币);
};
var _看视频领海量金币 = function _看视频领海量金币() {
  var _a, _b;
  var has_done = 0;
  var MAX_COUNT = 10;
  var single_GoldCoin = 88;
  var running = true;
  var get_runcount = function get_runcount() {
    var count_text = "看视频领海量金币可获得.*金币,已完成.*次，最高可完成.*次";
    var node = textMatches(count_text);
    if (tool_VO.hasOne(node, 2000)) {
      var str_1 = node.findOnce().text();
      tool_VO.log("匹配到文本:", str_1);
      var count_arr = str_1.match(/\d+/g).map(function (str) {
        return parseInt(str);
      });
      has_done = count_arr[1];
      MAX_COUNT = count_arr[2];
      single_GoldCoin = count_arr[0];
    }
    tool_VO.log("更新了任务数量:has_done = ", has_done, ",MAX_COUNT=", MAX_COUNT);
  };
  var goal_page = id("time_count_text");
  var back_btn = id("time_count_layout");
  threads.start(function () {
    while (running) {
      if (tool_VO.hasOne(textContains("立即领取"), 1000)) {
        tool_VO.clickNode(textContains("立即领取"));
        sleep(1000);
      }
      sleep(100);
    }
  });
  var enterActivity = function enterActivity() {
    var enter_node = className("android.widget.TextView").text("立即观看-按钮-点按两次即可激活");
    var state = true;
    if (!tool_VO.hasOne(goal_page, 1000)) {
      if (tool_VO.hasOne(enter_node, 3000)) {
        tool_VO.clickNode(enter_node);
        tool_VO.log("等待goalpage出现");
        if (!tool_VO.waitNode(goal_page, 5)) {
          console.error("goalpage未出现");
          state = false;
        } else {
          tool_VO.log("goalpage已经出现");
        }
      } else {
        console.error("不在任务页且不能进入任务页，无法完成");
        state = false;
      }
    }
    tool_VO.log("已经进入任务页，开始任务");
    return state;
  };
  if (!tool_VO.hasOne(text("大额专区"), 1000)) {
    console.error(Function.name, "不在任务页，请先进入任务页再执行！");
    return;
  }
  var 无法完成的次数 = 0;
  var wait_time = 30;
  get_runcount();
  while (has_done < MAX_COUNT) {
    if (!enterActivity()) {
      无法完成的次数++;
      if (无法完成的次数 > 3) {
        break;
      }
      continue;
    }
    wait_time = parseInt((((_b = (_a = goal_page.findOne(2000)) === null || _a === void 0 ? void 0 : _a.text()) === null || _b === void 0 ? void 0 : _b.match(/\d+/)) || [])[0] || "0") || 30;
    while (wait_time >= 0) {
      wait_time -= 2;
      tool_VO.log("当前任务剩余：", wait_time + "秒");
      sleep(2000);
    }
    tool_VO.backToPage(text("大额专区"));
    sleep(1000);
    has_done++;
    get_runcount();
  }
  running = false;
  tool_VO.backToPage(text("大额专区"));
};
var 看视频领海量金币 = function 看视频领海量金币() {
  tool_VO.runWithCatch(_看视频领海量金币);
};
var _点击搜索词领金币 = function _点击搜索词领金币() {
  browser.browser_点击搜索词领金币();
  tool_VO.backToPage(text("大额专区"));
};
var src_modules_quyue_ = function 点击搜索词领金币() {
  tool_VO.runWithCatch(_点击搜索词领金币);
};
var quyue_run = function _run() {
  for (var _i = 0, activity_list_1 = quyue_activity_list; _i < activity_list_1.length; _i++) {
    var obj = activity_list_1[_i];
    switch (obj.name) {
      case "下应用领金币":
        tool_VO.runWithCatch(下应用领金币);
        break;
      case "看视频领海量金币":
        tool_VO.runWithCatch(看视频领海量金币);
        break;
      case "点击搜索领金币":
        tool_VO.runWithCatch(src_modules_quyue_);
        break;
      default:
        break;
    }
  }
};
var quyue_pre = function pre() {
  tool_VO.log("运行趣悦脚本");
  tool_VO.closeApp("com.vivo.vreader");
  if (modules_quyue_() !== ENTER.SUCCESS) {
    throw new activityDoNotDoException("无法执行该趣悦任务,检查是否已经下载趣悦app？");
  }
};
var quyue = {
  name: "趣悦",
  run: function run() {
    quyue_pre();
    if (currentPackage() === "com.vivo.vreader") quyue_run();else {
      console.error("不在趣悦界面");
    }
    tool_VO.log("趣悦脚本运行完毕");
    home();
    sleep(3000);
  }
};
var _quyue = {
  name: "趣悦测试环境",
  run: function run() {
    modules_quyue_();
  }
};
;// CONCATENATED MODULE: ./src/modules/wallet.ts

var wallet_SHOW_CONSOLE = hamibot.env.SHOW_CONSOLE;
var ROBOT_ID = hamibot.env.ROBOT_ID;
var devices = {
  neo5: "64907e614fb0d4469d4ecdf4",
  neo8: "64941b377967abf2b2f0b63e",
  z7x: ""
};
var defaultVolume = 0;
var timeOut = 1000;
var sleepTime = 17;
var goalActivity = "com.vivo.wallet.service.h5.activity.BaseWebActivity";
var download_name = "安装";
var get_name = "领取";
var wallet_packageName = "com.vivo.wallet";
var open_name_name = "登录体验";
var open_name_name2 = "去体验";
var exchange = "去兑换";
var installing = "安装中";
var pre_install = "待安装";
var waiting_time = "等待";
var download_pause = "暂停";
var download_continue = "继续";
var currentRunTask = 0;
var configure = {
  start_run_time: "",
  allTaskNum: 10,
  download_finish: false,
  uninstall: true,
  uninstall_speed: 1,
  isFirstRun: true,
  retry_count: 3,
  child_thread: {
    excep_handler: true
  },
  isMainThreadRun: true,
  defaultVolume: 0,
  debugMode: {
    isOpen: false,
    runTaskNum: 1,
    returnCode: -1
  },
  file: {
    save_url: "/sdcard/hamibot_logs/",
    data: {
      runtime: "",
      app_lists: [],
      date: "",
      error_log: []
    },
    prefix: "",
    suffix: ".log",
    list_suffix: ".list.log",
    err_suffix: "_err.log"
  }
};
var uninstall_point = {
  x: 600,
  y: 2000
};
var app_lists = [];
var hadRun = [];
var is_expring = false;
var app_name_list_all = [];
function handle_exception() {
  start_thread(function () {
    while (configure.child_thread.excep_handler) {
      text("重试").waitFor();
      text("重试").findOne().click();
      sleep(timeOut);
    }
    log("handle_exception子线程已经关闭");
  });
  start_thread(function () {
    while (true) {
      text(pre_install).waitFor();
      tool_VO.log("发现待安装");
      try {
        text(pre_install).findOne(1000).click();
      } catch (e) {
        device.vibrate(1000);
        tool_VO.log(e.message);
      }
      sleep(1000);
    }
  });
  start_thread(function () {
    var begin = 0,
      end = 0;
    var max_wait_time = 30;
    while (true) {
      sleep(1000);
      end++;
      if (currentPackage() === wallet_packageName) {
        if (end - begin > max_wait_time) {
          tool_VO.log("卡在等待页了");
          if (hasNode(text(download_pause), 10)) {
            text(download_pause).findOne().click();
            sleep(3 * 1000);
          } else if (hasNode(text(waiting_time), 10)) {
            text(waiting_time).findOne().click();
            sleep(10 * 1000);
          } else {
            tool_VO.log("卡在其他页了");
            if (!is_expring) {
              _back();
            }
          }
        }
      } else {
        begin = end = 0;
      }
    }
  });
}
var set_finish = function set_finish() {
  configure.isMainThreadRun = false;
};
var task = function task() {
  sleep(1000);
  var card_selector = idContains("singleCard");
  card_selector.waitFor();
  var expr_app = function expr_app(app_name, enter_btn) {
    console.log("正在体验app:%s", app_name);
    is_expring = true;
    var launch_re = app.launchApp(app_name);
    var goal_package = app.getPackageName(app_name);
    if (!goal_package || !launch_re) {
      tool_VO.warning("这个应用是否正确下载？没有获取到呢", goal_package);
      return;
    }
    var flag = true;
    var expr_time = 15;
    if (tool_VO.waitNode(packageName(goal_package), 5)) {
      tool_VO.sleep(expr_time);
    } else {
      console.log("launch app失败，更换为点击");
      tool_VO.clickNodeNotNull(enter_btn);
      tool_VO.waitNode(packageName(goal_package), 5);
      if (currentPackage() === goal_package) {
        tool_VO.sleep(expr_time);
      } else {
        flag = false;
        is_expring = false;
      }
    }
    if (flag) {
      console.log("%s 运行成功", app_name);
      backWalleWay.run();
      tool_VO.waitNode(packageName(wallet_packageName), 3);
    } else {
      tool_VO.error("%s 运行失败", app_name);
      is_expring = false;
    }
    return flag;
  };
  var get_text = function get_text(node_info) {
    var text;
    if (node_info.childCount() === 2) {
      text = node_info.child(0).text();
    } else if (node_info.childCount() === 3) {
      text = node_info.child(0).child(1).text();
    } else if (node_info.childCount() === 0) {
      text = node_info.text();
    } else {}
    return text;
  };
  var install_or_expr = function install_or_expr(app_name, node_info) {
    if (node_info.childCount() === 2) {
      var r = node_info.child(1);
      if (!r) {
        sleep(1000);
        hadRun.indexOf(app_name) === -1 && hadRun.push(app_name);
        return;
      }
      if (r.text() === "安装") {
        tool_VO.log("点击安装");
        tool_VO.clickNodeNotNull(r);
        sleep(1000);
      } else if (r.text() === "去体验") {
        tool_VO.log("去体验");
        var expr_re = expr_app(app_name, r);
        hadRun.push(app_name);
        sleep(1000);
      } else if (r.text() === "领取") {
        tool_VO.log("领取");
        tool_VO.clickNodeNotNull(r);
        sleep(1000);
      } else {}
      sleep(1000);
    }
  };
  var hadRun_count = 0;
  var nodes = card_selector.find();
  for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
    var iterator = nodes_1[_i];
    sleep(1000);
    if (!tool_VO.hasNode(card_selector)) {
      return;
    }
    var text_1 = get_text(iterator);
    var app_name = get_app_name(text_1, 2);
    console.log("获得app的名称：", app_name);
    app_name_list_all.indexOf(app_name) === -1 && app_name_list_all.push(app_name);
    if (iterator.childCount() === 0) {
      hadRun.indexOf(app_name) === -1 && hadRun.push(app_name);
    }
    if (hadRun.indexOf(app_name) === -1) {
      install_or_expr(app_name, iterator);
    } else {
      hadRun_count++;
    }
    sleep(1000);
  }
  if (hadRun_count === nodes.length) {
    set_finish();
    return 0;
  }
  return 1;
};
var run = function run() {
  var getTaskName = function getTaskName(obj) {
    return obj.text().split("，")[0].split("-")[0].split(" ")[0];
  };
  var expr_app = function expr_app(btn, str) {
    console.log("正在体验的app是 %s", str);
    if (!btn || btn.text() !== open_name_name && btn.text() !== open_name_name2) return;
    if (!VO.clickNodeNotNull(btn)) {
      VO.error("进入app失败，%s", str);
    }
    VO.sleep(15);
    save_app_name(str);
    _back();
  };
  var parent_node = id("cpdTask");
  if (!VO.waitNode(parent_node, 10)) {
    VO.log("父节点都没找到，你是否在任务界面呢？");
    return false;
  }
  var parent_obj = parent_node.findOne(1000);
  var children = parent_obj.children().filter(function (value, index, arr) {
    return index !== 0;
  });
  var task_count = children.length;
  VO.log("今天还有任务数：%d个", task_count);
  for (var _i = 0, children_1 = children; _i < children_1.length; _i++) {
    var child = children_1[_i];
    var name_view = child.child(0);
    var task_btn = child.child(1);
    var task_name = getTaskName(name_view);
    expr_app(task_btn, task_name);
  }
  VO.log("等待3秒");
  sleep(3 * 1000);
};
function click_node(node_name, sleep_time) {
  var node = text(node_name).findOne(timeOut || 1000);
  if (node) {
    VO.log("点击节点->>" + node_name);
    if (node_name == open_name_name || node_name == open_name_name2) {
      var app_name = get_app_name(node);
      var name = save_app_name(app_name);
      VO.log("保存app名称：" + app_name);
      if (!app.launchApp(app_name) || sleep(5000) || !checkAppIsOpen(app_name)) {
        VO.log("app.launch失败，改为手动点击");
        sleep(timeOut);
        node.click();
      }
    }
    if (!!sleep_time) {
      exp_app(app_name, sleep_time);
      _back();
      check_back();
    }
  } else {
    VO.log("没有发现节点：" + node_name);
    return -1;
  }
  sleep(1000);
}
function checkAppIsOpen(app_name) {
  try {
    var name = app.getAppName(currentPackage());
    if (name !== app_name) {
      return false;
    }
  } catch (e) {
    VO.log("获取app名称失败");
  }
  return true;
}
function skipTask(task_name) {
  if (!task_name) {
    return false;
  }
  if (hadRun.indexOf(task_name) === -1) {
    return false;
  }
  var task_names = [];
  for (var i = 0; i < task_names.length; i++) {
    if (task_name.indexOf(task_names[i]) !== -1) {
      return true;
    }
  }
  return false;
}
function exp_app(name, sleep_time) {
  VO.log("体验" + sleep_time + "s");
  while (sleep_time-- > 0) {
    VO.log("当前体验剩余时间:" + sleep_time + "s");
    sleep(1000);
  }
  VO.log(name + "体验结束");
}
function _back() {
  var back_status = true;
  function checkAndBack() {
    while (back_status) {
      if (currentPackage() != wallet_packageName) {
        tool_VO.log("还未返回钱包");
        backWalleWay.three();
      }
      sleep(timeOut * 2);
    }
    tool_VO.log("已经返回钱包");
  }
  start_thread(checkAndBack);
  text(exchange).waitFor();
  back_status = false;
  sleep(timeOut * 2);
}
var backWalleWay = {
  base: function base() {
    recents();
    sleep(timeOut);
    tool_VO.log("等待钱包出现");
    text("钱包").waitFor();
    sleep(timeOut * 2);
  },
  one: function one() {
    base();
    click(device.width / 2, device.height / 2);
  },
  two: function two() {
    base();
    click(text("钱包").findOne().bounds().left, device.height / 2);
  },
  three: function three() {
    var count = 5;
    while (currentPackage() !== wallet_packageName && count--) {
      console.log("当前app不是钱包，返回钱包");
      sleep(3000);
      app.launchPackage(wallet_packageName);
    }
    if (currentPackage() !== wallet_packageName) {
      console.error("返回钱包失败");
      throw new Error("返回钱包失败");
    }
  },
  run: function run() {
    tool_VO.log("运行第三种方法返回钱包");
    this.three();
  }
};
function check_back() {
  var back_num = 0;
  VO.log("检查是否已经正确返回");
  while (!text(exchange).findOne(1000)) {
    if (back_num == 0) {
      VO.log("再自动返回一次");
      _back();
      back_num++;
      continue;
    }
    VO.log("没有返回任务界面，请手动返回...");
    sleep(timeOut);
  }
  VO.log("已经返回到任务界面，继续任务");
}
function checkTaskNums(count) {
  return app_lists.length + hadRun.length < (count || 10) && configure.retry_count--;
}
var finish_text = "太厉害了，任务已全部完成！ 明天再来吧";
function stop() {
  tool_VO.log("任务全部完成,退出脚本");
  closeWalletApp();
  configure.child_thread.excep_handler = false;
  threads.shutDownAll();
  console.hide();
  tool_VO.log("打印运行时间:");
  console.timeEnd("wallet");
  device.setMusicVolume(configure.defaultVolume);
  home();
  uploadData();
  closeScreen();
  exit();
}
function closeWalletApp() {
  tool_VO.closeApp("钱包");
}
function closeScreen() {
  app.launchApp("一键锁屏");
}
function enter_activity(isFirst) {
  tool_VO.log("正在检查是否进入活动页面...");
  if (!device.isScreenOn()) {
    device.wakeUpIfNeeded();
    swipe(device.width / 2, device / height - 100, device.width / 2, device.height - 500, 300);
    sleep(1000);
  }
  enter_activity_1();
  packageName(wallet_packageName).text(exchange).waitFor();
  tool_VO.log("已经进入了活动页面，开始任务");
  sleep(timeOut * 3);
  start_thread(check_isfinished, "", "", undefined, 10 * 1000);
}
function enter_activity_1() {
  var isEnterActivity = true;
  tool_VO.runThread(function () {
    while (!tool_VO.hasOne(packageName(wallet_packageName), 1000)) {
      tool_VO.log("打开钱包");
      console.log("打开钱包，结果：%s", app.launchPackage(wallet_packageName));
      sleep(5000);
    }
    tool_VO.log("钱包已经打开");
  }, false);
  start_thread(function () {
    while (isEnterActivity) {
      textContains("跳过").waitFor();
      tool_VO.clickNodeNotNull(textContains("跳过").findOnce());
    }
  });
  packageName(wallet_packageName).waitFor();
  sleep(1000);
  isEnterActivity = false;
  start_thread(function () {
    while (true) {
      desc("天天领现金").waitFor();
      tool_VO.clickNodeNotNull(desc("天天领现金").findOnce());
    }
  });
  sleep(1000);
}
var check_isfinished_thread_run = true;
function check_isfinished(relay) {
  tool_VO.log("监测线程已经执行");
  sleep(10 * 1000);
  while (check_isfinished_thread_run) {
    tool_VO.log("检查任务是否完成");
    if (!at_main_page()) {
      tool_VO.log("不在任务界面，等待返回任务界面");
    } else if (at_main_page() && !hasNode(textContains("登录并体验"), 10) && !hasNode(text(get_name), 10) && !hasNode(text(download_name), 10) && !hasNode(text(open_name_name), 10) && !hasNode(text(download_continue), 10) && !hasNode(text(pre_install), 10) && !hasNode(text(open_name_name2), 10) && !hasNode(text(installing), 10) && !hasNode(text(waiting_time), 10) && !hasNode(text(download_pause), 10)) {
      tool_VO.log("任务全部完成");
      configure.isMainThreadRun = false;
    } else {
      tool_VO.log("继续运行");
    }
    sleep(timeOut * 2);
  }
  tool_VO.log("监测线程关闭");
}
function at_main_page() {
  return tool_VO.atPage(packageName(wallet_packageName).text(exchange), 1000);
}
function start_thread(obj, msg1, msg2, isLoop, relay) {
  if (isLoop === undefined) isLoop = true;
  if (obj instanceof Function) {
    if (relay) {
      tool_VO.log("延迟开启监测线程");
    }
    threads.start(obj);
  } else {
    threads.start(function () {
      do {
        text(obj).waitFor();
        tool_VO.log(msg1 || "msg1未设置");
        var node = text(obj).findOnce();
        tool_VO.clickNodeNotNull(node);
        tool_VO.log(msg2 || "msg2未设置");
        sleep(timeOut);
        if (!isLoop) {
          return;
        }
        sleep(10);
      } while (isLoop);
    });
  }
}
function save_app_name(app_name) {
  if (app_name) {
    if (app_lists.indexOf(app_name) === -1) {
      app_lists.push(app_name);
    }
    return app_name;
  }
}
function auto_uninstall(app_name) {
  home();
  tool_VO.log("准备卸载应用包");
  start_thread("卸载", "发现卸载", "成功卸载");
  console.log("关闭监测线程");
  check_isfinished_thread_run = false;
  if (app_name) {
    tool_VO.openAppDetail(app_name);
    return;
  }
  if (!configure.uninstall) {
    tool_VO.log("关闭自动执行卸载");
    return;
  }
  if (hadRun.length) for (var _i = 0, hadRun_1 = hadRun; _i < hadRun_1.length; _i++) {
    var v = hadRun_1[_i];
    v && app_lists.indexOf(v) === -1 && app_lists.push(v);
  }
  tool_VO.log("\u9700\u8981\u5378\u8F7D\u7684\u5168\u90E8app\u6709:".concat(hadRun.toLocaleString()));
  hadRun.forEach(function (v, i) {
    var app_name = v;
    if (app_name) {
      tool_VO.log("\u51C6\u5907\u5378\u8F7D\u7B2C".concat(i + 1, "\u4E2A\u5E94\u7528:"), app_name);
      var re_1 = tool_VO.openAppDetail(app_name);
      console.log("%s 卸载完成", app_name);
      re_1 && sleep(timeOut * configure.uninstall_speed);
    }
  });
  tool_VO.log("全部app卸载完成");
}
function get_app_name(node, type) {
  if (!node) {
    return;
  }
  if (!type) type = 1;
  if (type !== 1) {
    return node.split("，")[0].split("-")[0].split(" ")[0];
  } else {
    try {
      var slibing = node.parent().children()[0];
      if (slibing) {
        var app_name = slibing.text().split("，")[0].split("-")[0].split(" ")[0];
        return app_name;
      }
    } catch (err) {
      tool_VO.error(err.message);
    }
  }
  return;
}
function hasNode(node, timeOut) {
  timeOut = !!timeOut ? timeOut : 1000;
  if (node instanceof Array) {
    for (var i = 0; i < node.length; i++) {
      if (!!node[i] && !node[i].findOne(timeOut)) {
        return false;
      }
    }
    return true;
  } else {
    return node.findOne(timeOut) != null;
  }
}
function uploadData() {
  if (devices.neo5 != ROBOT_ID && devices.neo8 != ROBOT_ID && devices.z7x != ROBOT_ID) {
    return;
  }
  tool_VO.log("上传功能未实现");
  save_log_to_local();
  return null;
}
function save_log_to_local() {
  try {
    files.ensureDir(configure.file.save_url);
  } catch (error) {
    return;
  }
  try {
    var file_url = configure.file.save_url + configure.file.prefix + getNowTime() + configure.file.suffix;
    tool_VO.log("创建日志文件：" + file_url);
    files.createWithDirs(file_url);
    files.append(file_url, "runTime:" + configure.file.data.runtime ? configure.file.data.runtime : 0);
    files.append(file_url, "app_lists:" + app_lists.toLocaleString());
    files.append(file_url, "date:" + configure.start_run_time);
    files.append(file_url, "\n");
  } catch (e) {
    tool_VO.log(e);
    configure.file.data.error_log.push(e);
  }
  try {
    files.write(configure.file.save_url + configure.file.prefix + getNowTime(true) + configure.file.list_suffix, app_lists.toLocaleString());
  } catch (e) {
    tool_VO.log(e);
    tool_VO.log("写入已完成任务名称文件失败");
    configure.file.data.error_log.push(e);
  }
  if (configure.file.data.error_log.length != 0) {
    try {
      var err_log_url = configure.file.save_url + configure.file.prefix + getNowTime() + configure.file.err_suffix;
      files.createWithDirs(errVO.log_url);
      files.append(err_log_url, "runTime:", configure.file.data.error_log.toLocaleString());
    } catch (e) {
      tool_VO.log("错误日志写入失败。原因：");
      if (configure.file.data.error_log.length == 0) {
        tool_VO.log("没有错误日志");
      } else {
        tool_VO.log("其他原因");
      }
    }
  }
}
function getNowTime(min) {
  var d = new Date();
  var tail = "";
  if (!min) {
    tail = "-" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  }
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + tail;
}
function prepareSetting() {
  function initUninstallSpeed() {
    tool_VO.log("初始化卸载速度/s");
    switch (ROBOT_ID) {
      case devices.neo5:
        configure.uninstall_speed = 2;
        break;
      case devices.neo8:
        configure.uninstall_speed = 1;
        break;
      case devices.z7x:
        configure.uninstall_speed = 8;
        break;
      default:
        configure.uninstall_speed = 5;
        break;
    }
    tool_VO.log("卸载速度初始化成功");
    tool_VO.log("当前卸载速度为:" + configure.uninstall_speed + "s卸载一次");
  }
  function initHadRun() {
    var str = "";
    try {
      str = files.read(configure.file.save_url + configure.file.prefix + getNowTime(true) + configure.file.list_suffix);
      hadRun = str.split(",");
    } catch (e) {
      tool_VO.log(e);
      tool_VO.log("文件不存在，可能是今天还没有运行");
    }
    tool_VO.log("已经运行过的app有：[" + str + "]");
  }
  console.time("wallet");
  auto.waitFor();
  start_thread("确定", "发现确定", "成功点击确定");
  start_thread("禁止", "发现禁止", "成功点击禁止");
  configure.defaultVolume = device.getMusicVolume();
  device.setMusicVolume(0);
  tool_VO.show_console();
  closeWalletApp();
  initHadRun();
  initUninstallSpeed();
}
function prepareCheck() {
  tool_VO.log(configure.debugMode.isOpen ? "调试模式已开启" : "调试模式已关闭");
  tool_VO.log(configure.uninstall ? "自动卸载功能已开启" : "自动卸载功能已关闭");
}
function interaction() {
  if (hasNode(textContains("我要金币"))) {
    VO.clickNodeNotNull(textContains("我要金币").findOne(timeOut));
    sleep(timeOut * 3);
  }
}
function runMain() {
  enter_activity();
  try {
    var count = 0;
    while (configure.isMainThreadRun && count < 3) {
      var re_2 = task();
      if (re_2 == configure.debugMode.returnCode) {
        tool_VO.log("任务可能还未完成，结束运行");
        break;
      }
      if (re_2 < 0) {
        tool_VO.log("出现异常了，请查看日志，结束任务");
        break;
      } else if (re_2 === 0) {
        tool_VO.log("任务正常完成");
      } else {
        tool_VO.log("部分任务还未完成，继续任务");
        count++;
      }
    }
    tool_VO.log("运行完成:" + getNowTime());
  } catch (e) {
    tool_VO.log(e);
  } finally {
    sleep(5000);
    if (checkTaskNums() && hadRun.length < app_name_list_all.length) {
      tool_VO.log("任务数量还未达到10个，重复运行一次");
      configure.isMainThreadRun = true;
      configure.isFirstRun = false;
      closeWalletApp();
      check_isfinished_thread_run = false;
      tool_VO.log("等待10s再运行");
      sleep(10 * 1000);
      runMain();
    } else {
      home();
      auto_uninstall();
      stop();
    }
  }
}
var download = function download() {
  while (true) {
    var nodes = text(download_name).untilFind();
    var had_run_count = 0;
    var has_new_task = false;
    for (var _i = 0, nodes_2 = nodes; _i < nodes_2.length; _i++) {
      var iterator = nodes_2[_i];
      var app_name = get_app_name(iterator);
      if (hadRun.indexOf(app_name) !== -1) {
        had_run_count++;
        continue;
      } else {
        has_new_task = true;
        VO.clickNodeNotNull(iterator);
        sleep(1000);
      }
    }
    VO.log("更新已经完成任务数量:%d", had_run_count);
    if (!has_new_task) {
      VO.log("下载任务完成，退出此线程");
      break;
    }
  }
};
function main() {
  prepareCheck();
  prepareSetting();
  handle_exception();
  start_thread(get_name, "出现领取", "成功领取");
  start_thread(download_continue, "出现继续下载", "继续下载");
  runMain();
}
var wallet_pre = function pre() {
  tool_VO.log("正在运行的是：钱包");
};
var wallet = {
  name: "钱包",
  run: function run() {
    try {
      wallet_pre();
      main();
      tool_VO.log("运行完毕");
    } catch (error) {
      tool_VO.error(error);
    } finally {
      home();
    }
  }
};
;// CONCATENATED MODULE: ./src/index.ts





init();
var src_configure = {
  show_console: true
};
tool_VO.runWithAgain(browser.run);
tool_VO.runWithAgain(quyue.run);
tool_VO.runWithAgain(wallet.run);
tool_VO.log("任务已经全部运行完毕了");
tool_VO.log("脚本窗口将在10秒后关闭");
sleep(10 * 1000);
exit();
/******/ })()
;