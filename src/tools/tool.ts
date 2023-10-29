/**
 * 工具对象
 */
let v = function () {
  const log1 = function () {

  }
};

class tool {
  log = (msg: any,...params:any[])=> {
    let log_msg = ""
    if (params && params.length != 1) {
      //获取全部的参数
      for (let i = 0; i < params.length; i++) {
        log_msg += params[i]
      }
    } else {
      log_msg = msg + ""
    }
    console.log(log_msg);
    toast(log_msg);
    hamibot.postMessage(log_msg);
  };

  warning(msg: string): void {
    let log_msg = ""
    if (arguments.length != 1) {
      //获取全部的参数
      for (let i = 0; i < arguments.length; i++) {
        log_msg += arguments[i]
      }
    } else {
      log_msg = msg
    }
    console.warn(log_msg);
    hamibot.postMessage(log_msg);
  };

  get_time = (): number => {
    return new Date().getTime();
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

  show_console = function (SHOW_CONSOLE: any) {
    // 显示控制台
    if (SHOW_CONSOLE) {
      console.show();
      sleep(300);
      // 修改控制台位置
      console.setPosition(0, 100);
      // 修改控制台大小
      console.setSize(device.width / 2, device.height / 4);
    }

    // 在控制台输出 Hello Hamibot
    toastLog("Hello Hamibot");
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

  clickOnBound = (obj: UiObject | Rect) => {
    // const bounds = obj.bounds();
    // VO.log(bounds);
    // click((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2);
    if (obj instanceof UiObject) {
      const bounds = obj.bounds();
      this.log(bounds);
      click((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2);
    } else if (obj instanceof Rect) {
      click((obj.left + obj.right) / 2, (obj.top + obj.bottom) / 2);
    } else {
      VO.log("你传的是啥玩意儿对象，假的")
    }
  };

  clickNodeNotNull = (node: UiObject, msg?: String) => {
    if (!node) {
      VO.log("不存在此节点");
      return;
    }
    try {
      if (!node.click()) {
        //如果点击失败（多半是因为节点不可点击），点击该节点的坐标
        VO.log("click失败，更改方式");
        VO.clickOnBound(node)
      }
      VO.log("click成功");
      msg && VO.log(msg);
    } catch (e) {
      VO.log(e);
    }
  };

  /**
 * 检测是否在指定页面
 * @param {node} pageNode 指定页面的指定节点
 */
  atPage = (pageNode: UiSelector, timeOut?: number) => {
    return timeOut ? this.hasOne(pageNode, timeOut) : (pageNode && pageNode.exists())
  };

  clickNode = (node: UiSelector) => {
    const nodeInfo = node.findOne(1000);
    this.clickNodeNotNull(nodeInfo);
  };

  backToPage = (pageNode: UiSelector, timeOut?: number) => {
    while (pageNode && !this.hasOne(pageNode, 10)) {
      back();
      sleep(timeOut || 1000);
    }
    VO.log("已经返回到了指定的界面");
    sleep(1000)
  };


  hasNode = (node: UiSelector) => {
    return node && node.exists()
  }

  closeApp = (app_name: string) => {
    app.openAppSetting(app_name);
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
        const node = textContains("确定");
        node.waitFor();
        VO.clickNodeNotNull(node.findOnce());
        sleep(1000);
        break;
      }
    })
    sleep(3000);
    running = false;
    sleep(1000)
  }

}

const VO = new tool();

enum ENTER {
  SUCCESS, FAIL, ERROR,
}

/**
 * 申请截图权限，脚本第一行调用
 * @returns 0：成功；-1：失败
 */
v.prototype.request = function () {
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

/**
 * 一键打印到控制台、日志、悬浮窗、网页推送消息
 * @param {打印信息} msg
 */
v.prototype.log = function (msg) {
  let log_msg = ""

  if (arguments.length != 1) {
    //获取全部的参数
    for (let i = 0; i < arguments.length; i++) {
      log_msg += arguments[i]
    }
  } else {
    log_msg = msg
  }
  console.log(log_msg);
  toast(log_msg);
  hamibot.postMessage(log_msg);
};



v.prototype.warning = function (msg: string) {
  let log_msg = ""

  if (arguments.length != 1) {
    //获取全部的参数
    for (let i = 0; i < arguments.length; i++) {
      log_msg += arguments[i]
    }
  } else {
    log_msg = msg
  }
  console.warn(log_msg);
  hamibot.postMessage(log_msg);
}

v.prototype.get_time = function () {
  return new Date().getTime();
};

/**
 * 找图函数
 * @param {大图} big
 * @param {小图} small
 * @param {范围，一个数组 [x,y,x_len,y_len],默认全屏} radius
 * @param {相似度，默认为0.9} similarity
 */
v.prototype.findImage = function (big, small, radius, similarity) {
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

/**
 * 查找指定的节点。返回集合，可能为空
 * @param {节点} node
 * @returns
 */
v.prototype.hasAll = function (node) {
  return node.find();
};

/**
 * 查找指定的节点，返回一个。没找到返回null
 * @param {节点} node
 * @returns
 */
v.prototype.hasOne = function (node: UiSelector, timeOut?: number) {
  return node.findOne(timeOut || 1000);
};

v.prototype.get_node = function (name) {
  return text(name).findOne(1000);
};

/**
 * 显示控制台
 */
v.prototype.show_console = function (SHOW_CONSOLE: any) {
  // 显示控制台
  if (SHOW_CONSOLE) {
    console.show();
    sleep(300);
    // 修改控制台位置
    console.setPosition(0, 100);
    // 修改控制台大小
    console.setSize(device.width / 2, device.height / 4);
  }

  // 在控制台输出 Hello Hamibot
  toastLog("Hello Hamibot");
};

v.prototype.stop = function () {
  threads.shutDownAll();
  sleep(3000);
  console.hide();
};

/**
 * 脚本开始前的准备工作，包含权限申请、悬浮窗设置等
 */
v.prototype.prepare = function () {
  auto.waitFor();
  VO.request();
  VO.show_console(true);
};

v.prototype.clickOnBound = (obj: any) => {
  //UiObject is not defiend ??

  // if (obj instanceof UiObject) {
  //   const bounds = obj.bounds();
  //   VO.log(bounds);
  //   click((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2);
  // } else if (obj instanceof Rect) {
  //   click((obj.left + obj.right) / 2, (obj.top + obj.bottom) / 2);
  // } else if (obj instanceof Object) {
  // } else {
  //   VO.log("你传的是啥玩意儿对象，假的")
  // }
  const bounds = obj.bounds();
  VO.log(bounds);
  click((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2);


}

v.prototype.clickNodeNotNull = (node: UiObject, msg: String) => {
  if (!node) {
    VO.log("不存在此节点");
    return;
  }
  try {
    if (!node.click()) {
      //如果点击失败（多半是因为节点不可点击），点击该节点的坐标
      VO.log("click失败，更改方式");
      VO.clickOnBound(node)
    }
    VO.log("click成功");
    msg && VO.log(msg);
  } catch (e) {
    VO.log(e);
  }
};

/**
 * 检测是否在指定页面
 * @param {node} pageNode 指定页面的指定节点
 */
v.prototype.atPage = (pageNode: UiSelector) => {
  return pageNode && pageNode.exists();
};
v.prototype.atPage = function (pageNode: UiSelector, timeOut: number) {
  return this.hasOne(pageNode, timeOut);
};

v.prototype.clickNode = (node: UiSelector) => {
  const nodeInfo = node.findOne(1000);
  VO.clickNodeNotNull(nodeInfo);
};

v.prototype.backToPage = (pageNode, timeOut?: number) => {

  while (pageNode && !VO.hasOne(pageNode, 10)) {
    back();
    sleep(timeOut || 1000);
  }
  VO.log("已经返回到了指定的界面");
  sleep(1000)
};


v.prototype.hasNode = (node: UiSelector) => {
  return node && node.exists()
}

v.prototype.closeApp = (app_name: string) => {
  app.openAppSetting(app_name);
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
      const node = textContains("确定");
      node.waitFor();
      VO.clickNodeNotNull(node.findOnce());
      sleep(1000);
      break;
    }
  })
  sleep(3000);
  running = false;
  sleep(1000)
}

export { VO, ENTER };
