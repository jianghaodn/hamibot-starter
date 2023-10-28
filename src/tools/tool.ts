/**
 * 工具对象
 */
let v = function () { };

const VO = new v();

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
  msg = msg + "";
  console.log(msg);
  toast(msg);
  hamibot.postMessage(msg);
};

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
v.prototype.hasOne = function (node) {
  return node.findOne(1000);
};

v.prototype.get_node = function (name) {
  return text(name).findOne(1000);
};

/**
 * 显示控制台
 */
v.prototype.show_console = function (SHOW_CONSOLE) {
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
  VO.show_console();
};

v.prototype.clickNodeNotNull = (node, msg) => {
  if (!node) {
    VO.log("不存在此节点");
    return;
  }
  try {
    if (!node.click()) {
      //如果点击失败（多半是因为节点不可点击），点击该节点的坐标
      VO.log("click失败，更改方式");
      const bounds = node.bounds();
      log(bounds);
      click((bounds.left + bounds.right) / 2, (bounds.top + bounds.bottom) / 2);
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
v.prototype.atPage = (pageNode) => {
  return pageNode && pageNode.exists();
};

v.prototype.clickNode = (node) => {
  const nodeInfo = node.findOne(1000);
  VO.clickNodeNotNull(nodeInfo);
};

v.prototype.backToPage = (pageNode, timeOut?: number) => {

  while (pageNode && !VO.hasOne(pageNode)) {
    back();
    sleep(timeOut || 1000);
  }
  VO.log("已经返回到了指定的界面");
};


v.prototype.hasNode = (node) => {
  return node && node.exists()
}

export { VO };
