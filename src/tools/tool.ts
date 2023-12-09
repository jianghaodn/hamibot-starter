class SaveLog {
  public url: string
  public prefix: string
  public time: string
  public suffix: string
  public datas?: string
  constructor(url: string, prefix: string, time: string, suffix: string, datas?: string) {
    this.url = url
    this.prefix = prefix
    this.time = time
    this.suffix = suffix 
    this.datas = datas
  }
  toString(): string {
    return this.url + this.prefix + this.time + this.suffix
  }
}
class tool {

  base_log = function (msg: string, ...params: any[]) {
    let log_msg = ""
    if (params && params.length != 0) {
      //获取全部的参数
      log_msg += msg
      for (let i = 0; i < params.length; i++) {
        log_msg += params[i]
      }
    } else {
      log_msg = msg + ""
    }
    return log_msg
  }
  log = (message: any, ...params) => {
    console.log(message, !params.length ? "" : params);
  };

  warning(msg: string, ...params): void {
    console.warn(msg, !params.length ? "" : params);
  };

  error(message: any, ...params): void {
    console.error(message, !params.length ? "" : params);
  };

  /**
   * 申请截图权限
   * @returns 申请结果
   */
  requestScreenCapture() {

    VO.runThread(() => {
      text("立即开始").waitFor()
      this.clickNode(text("立即开始"))
    }, false)

    if (!requestScreenCapture()) {
      console.error("没有授予 Hamibot 屏幕截图权限")
      return false
    }
    sleep(3000)
    return true
  }


  getScreenCapture(image, bounds) {
    return images.clip(image, bounds.x, bounds.y, bounds.width, bounds.height)
  };

  OCR(img) {
    return ocr.recognizeText(img)
  }

  get_time = (): number => {
    return new Date().getTime();
  };

  /**
   * 返回等待时间
   */
  getWaitTime = (deviceInfo): number => {
    log(deviceInfo)
    let wait_time = 10 * 1000;
    if (deviceInfo.mem < 8) {
      wait_time = 15 * 1000;
    } else if (deviceInfo.mem = 8) {
      wait_time = 10 * 1000;
    } else {
      wait_time = 5 * 1000
    }
    return wait_time
  }
  /**
 * 年月日
 * @param {boolean} min 最小化 true:只显示年月日；false:显示年月日时分秒
 */
  getNowTime = (min = false) => {
    const d = new Date();
    let tail = "";
    if (!min) {
      tail = "-" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    }
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + tail;
  }

  /**
   * 睡眠timeOut秒
   * @param timeOut 睡眠时间。单位：s
   */
  sleep = (timeOut: number) => {
    do {
      console.log("等待%s s", timeOut)
      sleep(1000)
    } while (timeOut--)
  };

  findImage = function (big, small, radius, similarity) {
    if (!small) {
      VO.log("图片不存在");
      return;
    }
    let d1 = VO.get_time();
    let re = images.findImage(big, small, {
      region: radius || [0, 0, device.width, device.height],
      threshold: similarity || 0.9,
    });
    let d2 = VO.get_time();
    re && VO.log("找图完成，用时:" + (d2 - d1) + "ms");
    small.recycle();
    return re;
  };

  hasAll = (node: UiSelector) => {
    return node.find();
  };

  hasOne = function (node: UiSelector, timeOut?: number) {
    return node.findOne(timeOut || 1000);
  };

  get_node = function (name: string) {
    return text(name).findOne(1000);
  };

  /**
   * 显示控制台
   * @param SHOW_CONSOLE 是否显示控制台
   */
  show_console = function (SHOW_CONSOLE: any, obj?: any) {
    // 显示控制台
    if (SHOW_CONSOLE) {
      console.show();
      sleep(500);
      // 修改控制台位置
      console.setPosition(obj && obj.x || 0, obj && obj.y || 200);
      // 修改控制台大小
      console.setSize(obj && obj.weight || device.width / 2, obj && obj.height || device.height / 4);
    }
  };

  stop = function () {
    threads.shutDownAll();
    sleep(3000);
    console.hide();
  };

  request = function () {
    if (device.sdkInt > 28) {
      //等待截屏权限申请并同意
      threads.start(function () {
        packageName("com.android.systemui").text("立即开始").waitFor();
        text("立即开始").findOne(1000)?.click();
      });
    }
    //请求截图
    //每次使用该函数都会弹出截图权限请求，建议选择“总是允许”。
    if (!requestScreenCapture()) {
      toast("请求截图失败");
      return -1;
    }
    sleep(1000);
    return 0;
  };

  prepare = () => {
    auto.waitFor();
    this.request();
    this.show_console(true);
  };

  clickOnBound = function (obj: UiObject) {
    const bounds = obj.bounds();
    console.log(bounds.left, bounds.right, bounds.top, bounds.bottom);
    const x = bounds.centerX();
    const y = bounds.centerY();
    // console.log("点击坐标:[", x, ",", y, "]")
    click(x, y)
    sleep(1000)
    return true
    // if (obj instanceof UiObject) {
    //   const bounds = obj.bounds();
    //   this.log(bounds);
    //   click((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2);
    // } else if (obj instanceof Rect) {
    //   click((obj.left + obj.right) / 2, (obj.top + obj.bottom) / 2);
    // } else {
    //   VO.log("你传的是啥玩意儿对象，假的")
    // }
  };

  clickNodeNotNull = (node: UiObject, msg?: String) => {
    let click_re = false
    if (!node) {
      this.log("不存在此节点", node);
    } else {
      try {
        if (!node.click()) {
          //如果点击失败（多半是因为节点不可点击），点击该节点的坐标
          // this.log("click失败，更改方式");
          sleep(1000)
          click_re = this.clickOnBound(node)
        } else {
          click_re = true
        }
        // }
        msg && VO.log(msg);
      } catch (e) {
        this.log(e);
      }
    }

    return click_re
  };

  /**
   * 以try-catch运行一个函数
   * @param func 运行的函数
   * @param final finally语句块的内容，可选
   * @returns 函数的运行结果
   */
  runWithCatch = (func: Function, final?: Function): any => {
    this.log("运行任务：", func.name)
    let re;
    try {
      re = func()
    } catch (error) {
      console.error(error)
    } finally {
      if (final) {
        final()
      }
    }
    VO.log(func.name, "执行完毕")
    return re;
  }

  /**
 * 检测是否在指定页面
 * @param {node} pageNode 指定页面的指定节点
 */
  atPage = (pageNode: UiSelector, timeOut?: number) => {
    return timeOut ? this.hasOne(pageNode, timeOut) : (pageNode && pageNode.exists())
  };

  clickNode = (node: UiSelector) => {
    const nodeInfo = node.findOne(100);
    if (!nodeInfo) {
      return false
    }
    if (nodeInfo && !nodeInfo.clickable()) {
      //节点不可点击
      return this.clickOnBound(nodeInfo)
    } else {
      return this.clickNodeNotNull(nodeInfo);
    }

  };

  backToPage = (pageNode: UiSelector, timeOut?: number) => {
    while (pageNode && !this.hasOne(pageNode, 10)) {
      back();
      sleep(timeOut || 1000);
    }
    VO.log("已经返回到了指定的界面");
    sleep(1000)
  };

  //存在任意一个节点都算返回
  backToPageOne = (node_list: Array<UiSelector>, timeOut?: number) => {
    flag: while (true) {
      for (const iterator of node_list) {
        if (iterator && this.hasNode(iterator)) {
          break flag
        }
      }
      back()
      sleep(timeOut || 1000);
    }
    VO.log("已经返回到了指定的界面");
    sleep(1000)
  }


  hasNode = (node: UiSelector) => {
    return node && node.findOne(10)
  }

  /**
   * 关闭app
   * @param package_name app的名字
   */
  closeApp = (package_name: string) => {
    this.openAppDetail(package_name)
    let running = true;
    threads.start(function () {
      while (running) {
        const node = textContains("强行停止");
        node.waitFor();
        VO.clickNodeNotNull(node.findOnce());
        sleep(1000);
        break;
      }
    });
    threads.start(() => {
      while (running) {
        const node1 = text("确定");
        node1.waitFor();
        VO.clickNodeNotNull(node1.findOnce());
        sleep(1000);
        break;
      }
    })
    sleep(3000);
    //关闭了app以后记得返回，防止误卸载此软件
    back()
    sleep(500)
    back()
    running = false;
    sleep(1000)
  }



  /**
   * 
   * @param name 包名或者app的名称
   * @returns 打开是否成功
   */
  openAppDetail = (name: string) => {
    const match_re = new RegExp(/.+\..+\..+/).test(name)
    if (!match_re) {
      //这不是一个包名
      //获取包名
      name = app.getPackageName(name)
      if (!name) {
        //包名不存在，应用不存在
        VO.error("打开应用详情失败，应用%s不存在", name)
        return false;
      }
    }
    sleep(1000)
    const re = app.openAppSetting(name);
    sleep(1000)
    return re;
  }
  /**
   * 
   * @param str 源字符串
   * @param reg 需要匹配的正则表达式
   * @returns Array,匹配到的数组
   */
  reg = (str: string, reg: RegExp) => {
    return str.match(reg).filter((it) => {
      it != ''
    })
  };

  /**
   * 开启一个线程，一般用于处理异常
   * @param func 函数
   * @param isLoop 是否需要死循环
   * @returns 此线程
   */
  runThread = (func: Function, isLoop: boolean = true) => {
    let re;
    return threads.start(() => {
      do {
        re = func();
        sleep(1000)
      } while (isLoop);
    })

    // return re;
  };

  /**
   * 
   * @param node 等待的节点选择器
   * @param timeOut 超时时间，单位是秒
   * @returns 
   */
  waitNode = (node: UiSelector, timeOut?: number, throw_e?: boolean, throw_msg?: string) => {
    if (!timeOut) {
      node.waitFor()
      return true
    }

    timeOut = timeOut * 10;
    while (timeOut--) {
      if (timeOut % 10 === 0) {
        this.log("等待节点", node)
      }
      if (this.hasNode(node)) {
        VO.log("找到了节点:", node)
        return true
      }
      sleep(100)
    }

    if (throw_e) {
      throw new Error(throw_msg)
    }
    return false;
  };

  runWithAgain = (func: Function) => {
    try {
      VO.runWithCatch(func);
    } catch (error) {
      console.error(error)
      //捕获到异常，重新运行一次
      console.log("由于出现问题，重新运行一次")
      VO.runWithCatch(func);
    } finally {
      console.log(`${func.name}运行完成`)
    }
  };

  /**
   * 自动卸载应用
   * @param arr 需要卸载的数组
   */
  autoUninstall = (arr: Array<string>) => {
    // home();
    let uninstall_running = true
    VO.log("准备卸载应用包");
    this.runThread(() => {
      while (uninstall_running) {
        if (VO.hasNode(text("卸载"))) {
          this.clickNode(text("卸载"))
          sleep(1000)
        }
        sleep(300)
        if (!uninstall_running) {
          break
        }
      }
    }, false)

    this.runThread(() => {
      while (uninstall_running) {
        if (VO.hasNode(text("确定"))) {
          this.clickNode(text("确定"))
          sleep(2000)
        }
        sleep(100)
        if (!uninstall_running) {
          break
        }
      }
    }, false)
    VO.log(`需要卸载的全部app有:${arr.toLocaleString()}`);
    arr.forEach((v, i) => {
      let app_name: string = v;
      if (app_name) {
        VO.log(`准备卸载第${i + 1}个应用:`, app_name);
        const re = VO.openAppDetail(app_name);
        console.log("%s 卸载完成", app_name);
        re && sleep(3000);
      }
    });
    sleep(1000)
    uninstall_running = false;
    VO.log("全部app卸载完成");
  };
  launchPackage = (package_name: string) => {
    //返回
    if (currentPackage() !== package_name) {
      app.launch(package_name)
      return VO.waitNode(packageName(package_name), 3)
    }
    return true
  };

  save_log = (logs: SaveLog) => {
    files.createWithDirs(logs.url)
    //写入已经完成的任务的名称
    try {
      files.write(logs.url + logs.prefix + logs.time + logs.suffix, logs.datas);
    } catch (e) {
      console.error(e);
      VO.log("写入已完成任务名称文件失败");
      //保存错误日志
    }
  };
  read_log = (url: string): Array<string> => {
    const log = files.read(url)
    const log_arr = log.split(",")
    return log_arr
  };
  waitNodeTextChange = (node: UiSelector | UiObject, target_text: string) => {
    let target_node: UiSelector;//对应的控件
    if (node instanceof UiSelector) {
      target_node = node
    } else if (node instanceof UiObject) {
      //先获取这个UiObject的UiSelector
      target_node = this.getNodeInfoFromLocaOrUIO(node)
    } else {
      target_node = null
      //异常
    }
    try {
      while (target_node.findOne(1000).text() !== target_text) {
        sleep(1000)
      }
    } catch (error) {
      console.error(error)
      log("target_node未发现")
      return false;
    }

    return true
  };
  /**
   * 从节点信息或者Rect对象获取到节点选择器
   * @param node 节点信息或者Rect对象
   * @returns 节点选择器
   */
  getNodeInfoFromLocaOrUIO(node: UiObject | Rect): UiSelector {
    let target_node: UiSelector;
    if (node instanceof Rect) {
      target_node = bounds(node.left, node.top, node.right, node.bottom)
    } else if (node instanceof UiObject) {
      const node$1 = node.bounds()
      target_node = bounds(node$1.left, node$1.top, node$1.right, node$1.bottom)
    } else {
      return null
    }
    return target_node;
  }
}

const VO = new tool();

enum ENTER {
  SUCCESS, FAIL, ERROR,
}



export { VO, ENTER, SaveLog };
