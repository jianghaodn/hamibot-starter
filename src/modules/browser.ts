/**
 * 浏览器相关的任务
 * @author dahaozi
 * @date 2023年10月27日16点01分
 */
import { VO, ENTER } from "../tools/tool";
import { activityDoNotDoException } from "../exception/exceptions";
import { PACKAGE } from "../CONSTANT";
import { error } from "console";

class activity {
    public name: String;
    public node?: Object;
    public run: boolean;
    constructor(name: String, node?: Object, run = true) {
        this.name = name;
        this.node = node;
        this.run = run;
    }
}

export { activity };

let activity_list = [] as activity[];
activity_list.push(
    new activity("每日首次下载"),
    new activity("点击搜索词领金币", text("随机搜索得金币")),
    new activity("下载推荐应用领金币", textContains("我要金币")),
    new activity("幸运抽大奖", textContains("去抽奖"), true),
    new activity("日常福利", undefined, false),
    new activity("逛一逛领金币", textContains("逛一逛")),
);


const browser_package = "com.vivo.browser"

const _进入活动主页面 = () => {
    const goalPage = packageName("com.vivo.browser").text("下载应用赚金币");
    const home_btn = id("tool_bar_btn_home");

    let enter_state = ENTER.SUCCESS;
    app.launch
    let enter_activity_running = true//进入活动页面函数运行的标志

    VO.runThread(() => {
        while (enter_activity_running) {
            if (VO.hasNode(id("dialog_close"))) {
                VO.clickNodeNotNull(id("dialog_close").findOnce())
                sleep(1000)
            }
            sleep(100)
        }
    }, false)

    if (!VO.atPage(goalPage)) {
        //不在任务界面，自动进入任务界面
        //关闭浏览器
        VO.closeApp("com.vivo.browser");
        if (!app.launch("com.vivo.browser")) {
            console.error("打开 浏览器 失败");
            enter_state = ENTER.FAIL;
        } else {
            VO.log("打开应用成功");
            sleep(2000);
            if (VO.hasOne(home_btn, 2000)) {
                VO.clickNode(home_btn);
            }
            if (!VO.hasOne(goalPage, 2000)) {
                //尝试进入活动页面
                const goal_node1 = id("btn_text").text("免费小说"); //第一种按钮
                const goal_node2 = id("tv").text("小说"); //第二种按钮
                //点击页面不同分地方的“免费小说”进入活动页面
                if (VO.hasOne(goal_node1, 2000)) {
                    VO.log("采用第一种方式");
                    VO.clickNode(goal_node1);
                } else if (VO.hasOne(goal_node2, 2000)) {
                    VO.log("采用第二种方式");
                    VO.clickNodeNotNull(goal_node2.findOnce().parent())
                    // VO.clickNode(goal_node2); //TODO无法运行。无法使用click(x,y)点击节点坐标.不管是点击坐标还是点击矩形区域都无法成功
                } else {
                    enter_state = ENTER.FAIL;
                    return enter_state; //提前返回
                }
                enter_activity_running = false
                if (!VO.atPage(goalPage, 3000)) {
                    const node = id("channel_image_view").findOne(1000)?.parent();
                    //继续点击福利按钮
                    if (node) {
                        VO.clickNodeNotNull(node);
                        if (!VO.atPage(goalPage, 2000)) {
                            console.error("进入失败，无法进入");
                            enter_state = ENTER.FAIL;
                        } else {
                            VO.log("已经进入任务主页面，开始脚本");
                        }
                    } else {
                        console.error("进入失败，无法进入");
                        enter_state = ENTER.FAIL;
                    }
                } else {
                    VO.log("已经进入任务主页面，开始脚本");
                }
                //进入成功，继续脚本
            } else {
                enter_state = ENTER.FAIL;
            }
        }
    }

    return enter_state;
};

const 进入活动主页面 = () => {
    return VO.runWithCatch(_进入活动主页面);
};

const 逛一逛领金币 = () => {
    if (!VO.atPage(textMatches("^浏览.*秒可领.*金币$"))) {
        VO.warning("不在任务页面");
    }
    //开始任务

    //进入了任务页面，先睡眠
    sleep(2000)

    const 逛一逛_btn = text("逛一逛-按钮-点按两次即可激活");
    const 奖励文字 = textMatches("逛一逛领金币 滑动浏览最高可获.*金币");

    const single_coin = 100;
    let count = 5;
    //获取总奖励

    const get_count = () => {
        if ((VO.hasOne(奖励文字), 3000)) {
            count =
                count || parseInt(
                    (奖励文字.findOne(1000)?.text()?.match(/\d+/) || [])[0] || "0"
                ) / single_coin;
        }
    };

    get_count();

    //进入任务页,等3秒，如果没等待，直接退出这个脚本
    if (!VO.waitNode(逛一逛_btn, 3)) {
        throw new Error("找不到逛一逛_btn")
        return; //找不到这个按钮直接返回
    }
    VO.clickNode(逛一逛_btn);

    const coin_btn = id("act_page_float_browse_text");
    const wait_time_sec = (3 * 60 + 5)
    //检查是否在任务页面
    if (!VO.waitNode(coin_btn, 3)) {
        return;
    }

    //滑动函数
    const swipe_func = () => {
        const x1 = random(100, 200);
        const y1 = random(2000, 2050);
        const x2 = random(1000, 2000);
        const y2 = random(500, 600);
        const duration = random(500, 1000);
        swipe(x1, y1, x2, y2, duration);
        sleep(1000);
    };

    while (count-- && VO.hasNode(coin_btn)) {
        //获取当前剩余的时间
        const remainint_time = parseInt(coin_btn.findOne(1000).text());
        if (remainint_time >= 0) {
            //间隔9秒向下滑动，7次
            let swipe_count = 7;
            while (swipe_count--) {
                sleep(9 * 1000);
                swipe_func();
            }
        }
        //完成一次任务，等待3分钟
        if (VO.hasNode(coin_btn)) {
            VO.log("等待", wait_time_sec, "秒")
            sleep(wait_time_sec * 1000)
        } else {
            break
        }
        console.log("等待完毕，继续运行")
    }
    VO.log(Function.name, "运行完毕")
};

/**
 *
 * @param obj {data:[{}],ks:[], all_count:6 ,goalPage:node}
 * @returns
 */
const 下载推荐应用领金币 = (obj?: any) => {
    const mainPage = text("互动领奖专区");
    const browser_packageName = "com.vivo.browser";
    let search_time = 8; //搜索领奖的默认浏览时间
    const browserPage =
        obj?.goalPage || id("cl_novel_search_bar_welfare_container");
    let flag1 = 0, //打开领奖
        flag2 = 0; //搜索领奖
    let f1_max = 20,
        f2_max = 30; //最大运行次数
    let f1_single = 100,
        f2_single = 100;
    let count = obj?.all_count || 8; //总运行次数
    let running = true;
    /*
      obj.data:
          [{
              name:"打开领奖",
              count:20
          }]
      */
    const data = obj?.data;

    //尝试获取运行次数，只在趣悦app 有效
    const get_run_count = () => {
        // if (obj && Object.keys(obj).length !== 0) {
        sleep(1000); //等待页面加载完成
        if (
            !VO.hasOne(textContains("免费领奖"), 3000) &&
            !VO.hasOne(textMatches("点击搜索词.*领金币"), 3000)
        ) {
            //没有任务，可能是黑号了
            flag1 = f1_max = 0;
            f2_max = flag2 = 0;
            VO.warning("没有任何任务");
            return;
        }
        const defaultWaitTime = 3000;

        //设置f1和f2的数量
        if (data && data.length) {
            for (const d of data) {
                if (d.name === "打开领奖") {
                    f1_max = d.count;
                } else if (d.name === "搜索领奖") {
                    f1_max = d.count;
                }
            }
        }

        //是趣悦
        if (currentPackage() === PACKAGE.QUYUE) {
            if (VO.hasOne(text("免费领奖"), defaultWaitTime)) {
                const count_node1 = text("免费领奖").findOne(3000)?.parent()?.child(2);
                flag1 = parseInt(count_node1?.text().split("/")[0] || "0") / f1_single;
                f1_max = parseInt(count_node1?.text().split("/")[1] || "0") / f1_single;
                // throw new BaseException("测试结束")
            }
            if (VO.hasOne(text("点击搜索词并浏览8秒领金币"), defaultWaitTime)) {
                let count_node2 = className("android.widget.TextView")
                    .text("点击搜索词并浏览8秒领金币")
                    .findOne(3000)
                    ?.parent()
                    ?.child(9);
                if (!count_node2 || !count_node2.text()) {
                    //没找到
                    count_node2 = className("android.widget.TextView")
                        .text("点击搜索词并浏览8秒领金币")
                        .findOne(3000)
                        ?.parent()
                        ?.child(2);
                }
                flag2 = parseInt(count_node2?.text().split("/")[0] || "0") / f2_single;
                f2_max = parseInt(count_node2?.text().split("/")[1] || "0") / f2_single;
                // throw new BaseException("测试结束")
            }
        }
        //是浏览器
        else if (currentPackage() === PACKAGE.BROWSER) {
            // 免费领奖，已领取2000金币，最高可获得2000金币，点击按钮跳转至第三方，即可获取奖励
            const str1 = "^免费领奖，已领取.*金币，最高可获得.*金币.*$";
            const str2 = "点击搜索词领金币，已领取.*金币，最高可获得.*金币，搜索下方内容并浏览结果页.*秒，即可获得奖励";
            if (VO.hasOne(textMatches(str1), defaultWaitTime)) {
                const arr = textMatches(str1).findOne().text().match(/\d+/g);
                flag1 = parseInt(arr[0] || "0") / f1_single;
                f1_max = parseInt(arr[1] || "0") / f1_single;
            }
            if (VO.hasOne(textMatches(str2), defaultWaitTime)) {
                const arr = textMatches(str2).findOne().text().match(/\d+/g);
                flag2 = parseInt(arr[0] || "0") / f2_single;
                f2_max = parseInt(arr[1] || "0") / f2_single;
                arr.length >= 3 && (search_time = parseInt(arr[2] || "8"));
            }
        }
        VO.log("更新运行次数：flag1 = ", flag1, ",f1_max = ", f1_max);
        VO.log("更新运行次数：flag2 = ", flag2, ",f2_max = ", f2_max);
    };



    const keys = obj?.ks || ["打开领奖", "搜索领奖"];
    VO.log("运行任务keys:", keys.join("&"));
    flag: while (count--) {
        while (!VO.atPage(mainPage)) {
            VO.log("当前不在页面");
            if (VO.hasOne(text("我要金币-按钮-点按两次即可激活"))) {
                VO.clickNode(text("我要金币-按钮-点按两次即可激活"));
                // mainPage.waitFor();
                try {
                    VO.waitNode(mainPage, 5, true, "我要金币按钮不存在")
                } catch (error) {
                    VO.error(error)
                    break flag;
                }
            } else {
                VO.warning("没有在任务界面，且无法进入任务，退出");
                throw new Error("没有在任务界面，且无法进入任务，退出");
            }
            sleep(1000);
            // VO.hasOne(textContains("逛一逛")) &&  VO.clickNode(textContains("逛一逛")) || (VO.log("没有在任务界面，且无法进入任务，退出"))
        }
        //进入了任务页面，先睡眠
        sleep(2000)
        get_run_count();
        //TODO 有些任务被折叠起来，是否需要展开折叠？如果不展开，是否存在被检测的风险？

        //点击快应用的返回按钮，因为有些情况下跳转到快应用无法返回
        let isrunning = true
        VO.runThread(() => {
            while (isrunning) {
                if (VO.hasNode(packageName("com.vivo.hybrid").id("view_back_icon"))) {
                    VO.clickNode(packageName("com.vivo.hybrid").id("view_back_icon"))
                    sleep(1000)
                }
                sleep(100)
            }
        }, false)

        for (const key of keys) {
            if (flag1 >= f1_max && flag2 >= f2_max) {
                break flag;
            }
            if (
                (key === "打开领奖" && flag1 >= f1_max) || (key === "搜索领奖" && flag2 >= f2_max)
            ) {
                continue;
            }
            sleep(1000);
            const keyNodes = textContains(key).find();
            //如果当前页面不是浏览器，启动浏览器
            const backBrowser = () => {
                let obj_package
                if (obj) {
                    obj_package = "com.vivo.vreader"
                } else {
                    obj_package = browser_packageName
                }
                //等待超时时间
                let timeOut = 5
                while (currentPackage() !== obj_package && timeOut--) {
                    app.launch(obj_package)
                    sleep(1000)
                    console.log("等待返回%s", obj_package)
                    VO.waitNode(packageName(obj_package), 5)
                }
                if (!timeOut && !VO.hasNode(packageName(obj_package))) {
                    //超时后还未返回，触发异常
                    throw new Error("返回" + obj_package + "失败")
                }
            }

            for (let i = 0; i < keyNodes.length; i++) {
                const node = keyNodes[i];
                sleep(1000);
                VO.clickNodeNotNull(node);
                VO.log("执行任务" + key);
                if (key === "打开领奖" && flag1 < f1_max) {
                    flag1++;
                    sleep(1500);
                    backBrowser()
                    // VO.backToPage(mainPage);
                    VO.backToPageOne([mainPage, desc("返回").id("title_view_left").packageName(browser_packageName),
                        text("打开领奖-按钮-点按两次即可激活").packageName(browser_packageName)
                    ])
                    VO.log("等待5秒");
                    sleep(5000);
                } else if (key === "搜索领奖" && flag2 < f2_max) {
                    flag2++;
                    VO.log("等待".concat(search_time + "", "秒"));
                    sleep((search_time + 2) * 1000);
                    VO.backToPage(mainPage, 2000);
                } else {
                    VO.backToPage(mainPage);
                }
            }
            sleep(1000);
        }
        isrunning = false;
        //退出这个任务界面
        VO.backToPage(browserPage);
        sleep(2000);
    }
    running = false;
};

const 点击搜索词领金币 = () => {
    const text_contains = "随机搜索得金币";
    const MS = 1000;

    let ALL_COUNT = 30; //总共需要运行的次数
    let has_search = 0; //已经运行的次数
    //初始化数据
    const init = function () {
        has_search = 0;
        ALL_COUNT = 30;
    };

    //记录运行数据
    const finish = function () { };

    const getSearchCount = function () {
        if (currentPackage() === "com.vivo.browser") {
            const count_node = textContains("搜索1次得");
            if (VO.hasOne(count_node, 1000)) {
                try {
                    let nodeinfo = textContains("搜索1次得").findOne(1000);
                    //从节点信息获取运行次数信息
                    let node_arr = nodeinfo?.text().split("/");
                    has_search = parseInt(node_arr![0].substring(13));
                    ALL_COUNT = parseInt(node_arr![1].substring(0, 2));
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

    /*
     * 模拟随机滑动
     * @param { number } timeOut 任务等待时间
     */
    const random_swipe = function (timeOut?) {
        // TODO 随机滑动未实现
        VO.log("随机滑动未实现", timeOut || []);
    };

    const random_search = function () {
        const node = textContains(text_contains);
        if (VO.hasOne(node, 3000)) {
            //进入了任务页面，先睡眠
            sleep(2000)
            //有随机搜索得金币的按钮
            //获取浏览次数
            let count = getSearchCount();
            const sleep_time = 12 * MS;
            while (count--) {
                node.waitFor();
                VO.clickNode(node);
                VO.log(`等待${sleep_time / MS}秒`);
                sleep(sleep_time);
                //模拟随机滑动
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


//更新每日首次进入关闭弹窗
const firstEnterDownloadApp = () => {
    //检测是否有下载弹窗
    const title_id = id("dialog_title")
    const close_id = id("dialog_close")
    const name_id = id(" tv_novel_dialog_daily_app_name")
    const download_id = id("novel_daily_dialog_download_btn")
    const run = () => {
        //点击下载按钮
        VO.hasNode(download_id) && download_id.findOnce().text() === "下载应用" && VO.clickNode(download_id)


        //开启线程处理移动网络下载
        VO.runThread(() => {
            const start_time = Date.now()
            while (true) {
                text("直接安装").waitFor()
                sleep(1000)
                VO.clickNode(text("直接安装"))
                toastLog("正在使用移动网络下载应用")
                break
            }
        })
        //等待下载完毕（下载按钮的文本变成‘打开领奖’）

        while (download_id.findOnce().text() !== "打开领奖") {
            sleep(2000)
        }
        sleep(1000)
        //打开领奖
        VO.clickNode(download_id)
        sleep(2000)
        //返回主页面
        app.launch(browser_package)

        //检测是否已经回到了浏览器。如果没回来，重新进入活动主页面
        if (!VO.waitNode(packageName(browser_package), 5000)) {
            _进入活动主页面()
        }

    }
    if (VO.hasOne(title_id, 2000) && VO.hasOne(close_id, 1000) && VO.hasOne(name_id, 1000) && VO.hasOne(download_id, 1000)) {
        sleep(1000)
        run()
        sleep(2000)
    }
}

const 去抽奖 = () => { };

const _run = function () {
    for (const app of activity_list) {
        if (app.name === "每日首次下载") {
            VO.runWithCatch(firstEnterDownloadApp)
        } else if (app.name === "逛一逛领金币") {
            VO.runWithCatch(逛一逛领金币);
        } else if (app.name === "下载推荐应用领金币") {
            VO.runWithCatch(下载推荐应用领金币);
        } else if (app.name === "点击搜索词领金币") {
            VO.runWithCatch(点击搜索词领金币);
        } else {
            VO.log("任务" + app.name + "不执行");
        }
    }
};

const pre = () => {
    VO.log("browser开始运行");
    VO.runThread(() => {
        if (VO.hasNode(text("页面出错了")) && VO.hasNode(text("点击重试"))) {
            VO.clickNode(text("点击重试"));
            sleep(3000);
        }
    });

    if (进入活动主页面() !== ENTER.SUCCESS) {
        throw new activityDoNotDoException("无法执行该浏览器任务");
    }
};

export const browser = {
    name: "浏览器脚本任务",
    object: activity_list,
    run: () => {
        pre();
        if (currentPackage() === "com.vivo.browser") {
            _run();
        } else {
            VO.warning("不在浏览器中，运行结束");
        }
        VO.log("browser运行结束");
        home()
        sleep(3000)
    },
    //将这个函数导出去让趣悦也使用
    browser_下载推荐应用领金币: (obj: any) => {
        下载推荐应用领金币(obj);
    },
    browser_点击搜索词领金币() {
        点击搜索词领金币();
    },
};

export const _browser = {
    name: "测试浏览器环境",
    run() {
        const re = 进入活动主页面();
        VO.log("输出测试结果:", re);
    },
};
