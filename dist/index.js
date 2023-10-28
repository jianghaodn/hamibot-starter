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
    console.setPosition(0, 100);
    console.setSize(device.width, device.height / 4);
  }

  setScreenMetrics(1080, 2400);
}
;// CONCATENATED MODULE: ./src/tools/tool.ts
var v = function v() {};

var VO = new v();

v.prototype.request = function () {
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

v.prototype.log = function (msg) {
  msg = msg + "";
  console.log(msg);
  toast(msg);
  hamibot.postMessage(msg);
};

v.prototype.get_time = function () {
  return new Date().getTime();
};

v.prototype.findImage = function (big, small, radius, similarity) {
  if (!small) {
    VO.log("图片不存在");
    return;
  }

  var d1 = VO.get_time();
  var re = images.findImage(big, small, {
    region: radius || [0, 0, device.width, device.height],
    threshold: similarity || 0.9
  });
  var d2 = VO.get_time();
  re && VO.log("找图完成，用时:" + (d2 - d1) + "ms");
  small.recycle();
  return re;
};

v.prototype.hasAll = function (node) {
  return node.find();
};

v.prototype.hasOne = function (node) {
  return node.findOne(1000);
};

v.prototype.get_node = function (name) {
  return text(name).findOne(1000);
};

v.prototype.show_console = function (SHOW_CONSOLE) {
  if (SHOW_CONSOLE) {
    console.show();
    sleep(300);
    console.setPosition(0, 100);
    console.setSize(device.width / 2, device.height / 4);
  }

  toastLog("Hello Hamibot");
};

v.prototype.stop = function () {
  threads.shutDownAll();
  sleep(3000);
  console.hide();
};

v.prototype.prepare = function () {
  auto.waitFor();
  VO.request();
  VO.show_console();
};

v.prototype.clickNodeNotNull = function (node, msg) {
  if (!node) {
    VO.log("不存在此节点");
    return;
  }

  try {
    if (!node.click()) {
      VO.log("click失败，更改方式");
      var bounds_1 = node.bounds();
      log(bounds_1);
      click((bounds_1.left + bounds_1.right) / 2, (bounds_1.top + bounds_1.bottom) / 2);
    }

    VO.log("click成功");
    msg && VO.log(msg);
  } catch (e) {
    VO.log(e);
  }
};

v.prototype.atPage = function (pageNode) {
  return pageNode && pageNode.exists();
};

v.prototype.clickNode = function (node) {
  var nodeInfo = node.findOne(1000);
  VO.clickNodeNotNull(nodeInfo);
};

v.prototype.backToPage = function (pageNode, timeOut) {
  while (pageNode && !VO.hasOne(pageNode)) {
    back();
    sleep(timeOut || 1000);
  }

  VO.log("已经返回到了指定的界面");
};

v.prototype.hasNode = function (node) {
  return node && node.exists();
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
activity_list.push(new activity("逛一逛领金币", textContains("逛一逛")), new activity("下载推荐应用领金币", textContains("我要金币")), new activity("幸运抽大奖", textContains("去抽奖"), true), new activity("日常福利", undefined, false), new activity("点击搜索词领金币", text("随机搜索得金币")));

var 逛一逛 = function 逛一逛() {
  return "任务不划算暂时不做";

  if (!VO.atPage(text("^浏览.*秒可领.*金币$"))) {
    VO.log("不在任务页面");
  }
};

var 下载推荐应用领金币 = function 下载推荐应用领金币() {
  var mainPage = text("互动领奖专区");
  var packageName = "com.vivo.browser";
  var browserPage = id("cl_novel_search_bar_welfare_container");
  var flag1 = 0,
      flag2 = 0;
  var count = 5;
  var running = true;
  var keys = ["打开领奖", "搜索领奖"];

  flag: while (count--) {
    while (!VO.atPage(mainPage)) {
      VO.log("当前不在页面");

      if (VO.hasOne(text("我要金币-按钮-点按两次即可激活"))) {
        VO.clickNode(text("我要金币-按钮-点按两次即可激活"));
        mainPage.waitFor();
      } else {
        VO.log("没有在任务界面，且无法进入任务，退出");
        return;
      }

      sleep(1000);
    }

    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
      var key = keys_1[_i];

      if (flag1 > 20 && key === "打开领奖" || key === "搜索领奖" && flag2 > 30) {
        continue;
      }

      if (flag1 >= 20 && flag2 >= 30) {
        break flag;
      }

      sleep(1000);
      var keyNodes = textContains(key).find();

      for (var i = 0; i < keyNodes.length; i++) {
        var node = keyNodes[i];
        sleep(1000);
        VO.clickNodeNotNull(node);
        VO.log("执行任务" + key);

        if (key === "打开领奖") {
          flag1++;
          sleep(1000);
          VO.backToPage(mainPage);
          sleep(5000);
        } else if (key === "搜索领奖") {
          flag2++;
          sleep(10 * 1000);
          VO.backToPage(mainPage, 2000);
        } else {
          VO.backToPage(mainPage);
        }
      }

      sleep(1000);
    }

    VO.backToPage(browserPage);
    sleep(2000);
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

      if (VO.hasNode(count_node)) {
        try {
          var nodeinfo = textContains("搜索1次得").findOne(1000);
          var node_arr = nodeinfo === null || nodeinfo === void 0 ? void 0 : nodeinfo.text().split("/");
          has_search = parseInt(node_arr[0].substring(13));
          ALL_COUNT = parseInt(node_arr[1].substring(0, 2));
        } catch (error) {
          VO.log(error);
        }
      }
    } else {
      has_search = 0;
      ALL_COUNT = 30;
    }

    return ALL_COUNT - has_search;
  };

  var random_swipe = function random_swipe(timeOut) {
    VO.log("随机滑动未实现", timeOut);
  };

  var random_search = function random_search() {
    var node = textContains(text_contains);

    if (VO.hasNode(node)) {
      var count = getSearchCount();

      while (count--) {
        node.waitFor();
        VO.clickNodeNotNull(node.findOne(1000));
        sleep(12 * MS);
        random_swipe();
        back();
        sleep(MS * 3);
        has_search++;
      }

      VO.log("search任务全部完成");
    } else {
      VO.log("根本没有随机搜索的按钮");
    }
  };

  init();
  random_search();
  finish();
};

var 去抽奖 = function 去抽奖() {};

var _run = function _run() {
  for (var _i = 0, activity_list_1 = activity_list; _i < activity_list_1.length; _i++) {
    var app_1 = activity_list_1[_i];

    if (app_1.name === "逛一逛领金币") {
      逛一逛();
    } else if (app_1.name === "下载推荐应用领金币") {
      下载推荐应用领金币();
    } else if (app_1.name === "点击搜索词领金币") {
      点击搜索词领金币();
    } else {
      VO.log("任务" + app_1.name + "不执行");
    }
  }
};

var browser = {
  name: "浏览器脚本任务",
  object: activity_list,
  run: function run() {
    VO.log("browser开始运行");

    _run();

    VO.log("browser运行结束");
  }
};
;// CONCATENATED MODULE: ./src/index.ts


init();
console.log(browser.name);
console.log('测试tool工具箱');
browser.run();
/******/ })()
;