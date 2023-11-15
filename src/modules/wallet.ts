/**
 * 钱包相关任务
 * @author dahaozi
 * @date 2023年10月27日16点02分
 */

// @ts-nocheck
/**
 * 本脚本是vivo钱包自动下载app领现金脚本
 * 功能：
 * 1、自动下载、打开、完成app体验任务
 * 2、自动卸载体验app
 * 函数名和库函数重名的函数，前面添加"_"
 * 3、autojs开发踩坑：不要使用Thread这个类，VSCode会自动导入Thread，会导致报错：“Identifier is a reserved word”
 * 在autojs中使用线程直接用threads.start就行，不需要导包
 */



import { VO } from "../tools/tool";

// 获取脚本配置
const { SHOW_CONSOLE } = hamibot.env;
const { ROBOT_ID } = hamibot.env;

const devices = {
    neo5: "64907e614fb0d4469d4ecdf4",
    neo8: "64941b377967abf2b2f0b63e",
    z7x: "",
};

const defaultVolume = 0; //保存系统当前默认媒体音量
const timeOut = 1000;
const sleepTime = 17;
const goalActivity = "com.vivo.wallet.service.h5.activity.BaseWebActivity"; //任务界面的activity，但是在iqoo neo5上面这个无效
const download_name = "安装";
const get_name = "领取";
const wallet_packageName: string = "com.vivo.wallet";
const open_name_name = "登录体验";
const open_name_name2 = "去体验";
const exchange = "去兑换";
const installing = "安装中";
const pre_install = "待安装";
const waiting_time = "等待";
const download_pause = "暂停";
const download_continue = "继续";
let currentRunTask = 0; //当前运行的任务数

const configure = {
    start_run_time: "",
    allTaskNum: 10,
    download_finish: false, //是否等待应用全部下载完再打开
    uninstall: true, //是否自动执行卸载（iqoo neo5无法弹出卸载框，暂时关闭自动卸载）
    uninstall_speed: 1, //卸载应用的速度，默认为1，低端机型卸载速度较慢，根据机型调高
    isFirstRun: true,
    retry_count: 3,//重试的次数，运行没有达到就重试
    child_thread: {
        excep_handler: true, //处理异常情况的子线程
    },
    isMainThreadRun: true, //控制脚本运行，有专门的线程去采集任务是否完成以此控制脚本运行，
    defaultVolume: 0, //保存系统当前默认媒体音量
    debugMode: {
        isOpen: false,
        runTaskNum: 1,
        returnCode: -1,
    }, //调试模式,调试模式下运行一个任务就结束

    file: {
        save_url: "/sdcard/hamibot_logs/",
        data: {
            runtime: "",
            app_lists: [],
            date: "",
            error_log: [],
        },
        prefix: "",
        suffix: ".log",
        list_suffix: ".list.log",
        err_suffix: "_err.log",
    },
};
// const uninstall_wait_time = 3000;
//卸载app时候点击的坐标
const uninstall_point = {
    x: 600,
    y: 2000,
};
//存储已经下载的app的名称
let app_lists = [];
//已经运行过的app
let hadRun = [];
//是否正在体验app
let is_expring = false

let app_name_list_all = [];

/**
 * 处理异常，防止有时候因为网络问题导致出现的访问异常的问题
 */
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
            VO.log("发现待安装");
            try {
                text(pre_install).findOne(1000).click();
            } catch (e) {
                device.vibrate(1000);
                VO.log(e.message);
            }
            sleep(1000);
        }
    });

    //处理下载的时候某些情况下卡住的问题
    start_thread(function () {
        let begin = 0, end = 0;
        let max_wait_time = 30;
        while (true) {
            sleep(1000);
            end++;
            if (currentPackage() === wallet_packageName) {
                if (end - begin > max_wait_time) {
                    //卡在任务页了
                    VO.log("卡在等待页了");
                    if (hasNode(text(download_pause), 10)) {
                        text(download_pause).findOne().click();
                        sleep(3 * 1000); //等待应用下载完毕
                    }
                    else if (hasNode(text(waiting_time), 10)) {
                        text(waiting_time).findOne().click();
                        sleep(10 * 1000); //等待应用下载完毕
                    } else {
                        VO.log("卡在其他页了");
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

// function run() {
//     let newLocal = (value: UiObject, index: number) => {
//         if (configure.debugMode.isOpen) {
//             //调试模式，运行一个任务就结束
//             VO.log("调试模式已经开启");
//             if (configure.debugMode.runTaskNum <= currentRunTask) {
//                 VO.log("已到达调试模式设定的任务数，暂停脚本");
//                 return configure.debugMode.returnCode;
//             }
//         }
//         if (value) {
//             var app_name = get_app_name(value);
//             if (!skipTask(app_name)) {
//                 sleep(3000); //暂停3秒，防止钱包不识别
//                 click_node(value.text() || open_name_name2);
//                 exp_app(app_name, sleepTime);
//                 _back();
//                 check_back();
//                 currentRunTask++;
//             }
//             sleep(timeOut);
//         }
//     };

//     if (!hasNode(text(open_name_name)) && !hasNode(text(open_name_name2))) {
//         return false;
//     }
//     while (configure.download_finish && hasNode(text(waiting_time), 50)) {
//         VO.log("等待应用全部下载完");
//         sleep(timeOut);
//     }

//     let loginAndExp = text(open_name_name).find();
//     let loginAndExp_2 = text(open_name_name2).find();

//     //调试模式设置
//     if (configure.debugMode.isOpen) {
//         VO.log("调试模式已经开启");
//         if (configure.debugMode.runTaskNum <= currentRunTask) {
//             VO.log("已到达调试模式设定的任务数，暂停脚本");
//             return configure.debugMode.returnCode;
//         }
//     }


//     loginAndExp.forEach(newLocal);
//     loginAndExp_2.forEach(newLocal);



//     return true;
// }

const set_finish = () => {
    configure.isMainThreadRun = false
}

/**
 * 完成任务
 * @return 0：完成全部任务；1：还有任务没有完成；-1：出错 
 */
const task = () => {
    sleep(1000)
    const card_selector = idContains("singleCard")
    card_selector.waitFor()
    /**
     * @param app_name 
     * @param enter_btn 
     * @returns flag 是否运行成功
     */
    const expr_app = (app_name, enter_btn) => {
        console.log("正在体验app:%s", app_name)
        is_expring = true
        const launch_re = app.launchApp(app_name)
        const goal_package = app.getPackageName(app_name);

        if (!goal_package || !launch_re) {
            VO.warning("这个应用是否正确下载？没有获取到呢", goal_package)
            return
        }

        let flag = true//运行成功与否
        const expr_time = 15//体验app的时间
        //检测是否进入了app内
        if (VO.waitNode(packageName(goal_package), 5)) {
            //进入成功
            VO.sleep(expr_time)
        } else {
            //进入失败
            //更换进入方式
            console.log("launch app失败，更换为点击")
            VO.clickNodeNotNull(enter_btn)
            VO.waitNode(packageName(goal_package), 5)
            if (currentPackage() === goal_package) {
                VO.sleep(expr_time)
            } else {
                //第二种方式失败
                flag = false
                is_expring = false
            }
        }
        if (flag) {
            //最终运行成功
            console.log("%s 运行成功", app_name)
            //返回
            backWalleWay.run()
            VO.waitNode(packageName(wallet_packageName), 3)
        } else {
            VO.error("%s 运行失败", app_name)
            is_expring = false
        }
        return flag
    }

    const get_text = (node_info: UiObject) => {
        let text;
        if (node_info.childCount() === 2) {
            //两个子节点的情况
            text = node_info.child(0).text()
        } else if (node_info.childCount() === 3) {
            //三个子节点的情况
            text = node_info.child(0).child(1).text()
        } else if (node_info.childCount() === 0) {
            //没有子节点
            text = node_info.text()
        } else {
            //其他情况
        }
        return text
    }

    const install_or_expr = (app_name: string, node_info: UiObject) => {
        if (node_info.childCount() === 2) {
            const r = node_info.child(1);
            if (!r) {
                sleep(1000)
                hadRun.indexOf(app_name) === -1 && hadRun.push(app_name)
                return
            }
            if (r.text() === "安装") {
                VO.log("点击安装")
                VO.clickNodeNotNull(r)
                sleep(1000)
            } else if (r.text() === "去体验") {
                VO.log("去体验")
                const expr_re = expr_app(app_name, r)
                hadRun.push(app_name)
                sleep(1000)
                // }
            } else if (r.text() === "领取") {
                VO.log("领取")
                VO.clickNodeNotNull(r)
                sleep(1000)
            } else {
                //啥也不做
            }
            sleep(1000)
        }
    }

    let hadRun_count = 0;//当前已经做过的app的数量
    const nodes = card_selector.find();
    for (const iterator of nodes) {
        sleep(1000)
        //确保在运行页面
        if (!VO.hasNode(card_selector)) {
            return;
        }
        const text = get_text(iterator)
        //处理得到的文本信息
        const app_name = get_app_name(text, 2)
        console.log("获得app的名称：", app_name)
        //保存app名称
        app_name_list_all.indexOf(app_name) === -1 && app_name_list_all.push(app_name)

        if (iterator.childCount() === 0) {
            //已经完成的任务
            hadRun.indexOf(app_name) === -1 && hadRun.push(app_name)
        }

        //获取安装按钮
        if (hadRun.indexOf(app_name) === -1) {
            install_or_expr(app_name, iterator)
        } else {
            hadRun_count++
        }
        sleep(1000)
    }
    if (hadRun_count === nodes.length) {
        //已经全部做过了
        //TODO 准备结束脚本运行
        set_finish();
        return 0;
    }
    return 1;
}


/**
 * 重写run方法
 */
const run = () => {

    //获取任务名称
    const getTaskName = (obj: UiObject) => {
        return obj.text().split("，")[0].split("-")[0].split(" ")[0];
    }
    /**
     * 体验app
     * @param btn 体验按钮
     * @param str 体验app的名称
     */
    const expr_app = (btn: UiObject, str: string) => {
        console.log("正在体验的app是 %s", str)

        if (!btn || btn.text() !== open_name_name && btn.text() !== open_name_name2) return

        if (!VO.clickNodeNotNull(btn)) {
            VO.error("进入app失败，%s", str)
        }
        //进入了app，开始体验
        VO.sleep(15)

        //体验完毕，记录app的名称
        save_app_name(str)

        _back()


    }

    //TODO 明明有这个控件，但是找不到，很奇怪？？？
    const parent_node = id("cpdTask")//所有任务节点的父节点，先找到父节点，再去获取下面的子节点，从而获取全部的任务信息
    // while (configure.isMainThreadRun) {
    if (!VO.waitNode(parent_node, 10)) {
        VO.log("父节点都没找到，你是否在任务界面呢？")
        return false
    }
    const parent_obj = parent_node.findOne(1000);
    const children = parent_obj.children().filter((value, index, arr) => {
        return index !== 0
    })
    //获取主节点下面的孩子个数，得到任务总数
    const task_count = children.length
    VO.log("今天还有任务数：%d个", task_count)
    for (const child of children) {
        const name_view = child.child(0)
        const task_btn = child.child(1)
        //获取任务名称
        const task_name = getTaskName(name_view)
        //将任务保存到任务数组里面
        // !app_lists.includes(task_name) && app_lists.push(task_name)
        expr_app(task_btn, task_name)
    }
    VO.log("等待3秒")
    sleep(3 * 1000)
    // }


}

/**
 * 点击指定的节点，sleep_time为完成任务所需的时间
 * 对于需要打开app体验15s的任务，必须指定sleep_time
 * @param {string} node_name 对应节点的名称
 * @param {number} sleep_time 完成任务所需的时间
 * @returns
 */
function click_node(node_name: string, sleep_time?: number) {
    var node = text(node_name).findOne(timeOut || 1000);
    if (node) {
        VO.log("点击节点->>" + node_name);
        //打开应用体验的时候获取app名称并且保存
        if (node_name == open_name_name || node_name == open_name_name2) {
            var app_name = get_app_name(node);
            const name = save_app_name(app_name);
            VO.log("保存app名称：" + app_name);
            if (
                !app.launchApp(app_name) || sleep(5000) || !checkAppIsOpen(app_name)
            ) {
                //直接打开这个app不成功，改为点击体验按钮打开
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

/**
 *  检测该app是否已经打开，如果没有打开，则点击体验按钮打开
 * @param {string} app_name
 * @returns boolean
 */
function checkAppIsOpen(app_name: string) {
    try {
        let name = app.getAppName(currentPackage());
        if (name !== app_name) {
            //如果当前app名称！= app_name
            return false;
        }
    } catch (e) {
        VO.log("获取app名称失败");
    }
    return true;
}

/**
 * 任务名称
 * @param {String} task_name
 * @return 是否跳过 true跳过，false不跳过
 */
function skipTask(task_name: string) {
    if (!task_name) {
        return false;
    }
    //如果app已经运行过，跳过
    if (hadRun.indexOf(task_name) === -1) {
        return false;
    }

    var task_names = [];
    for (let i = 0; i < task_names.length; i++) {
        if (task_name.indexOf(task_names[i]) !== -1) {
            return true;
        }
    }
    return false;
}

/**
 * 体验app
 * @param {string} name
 * @param {number} sleep_time
 */
function exp_app(name: string, sleep_time: number) {
    VO.log("体验" + sleep_time + "s");
    while (sleep_time-- > 0) {
        VO.log("当前体验剩余时间:" + sleep_time + "s");
        sleep(1000);
    }
    VO.log(name + "体验结束");
}

/**
 * 返回到任务界面
 */
function _back() {
    let back_status = true;
    // backWalletWay_2()
    // backWalletWay_3()
    function checkAndBack() {
        while (back_status) {
            if (currentPackage() != wallet_packageName) {
                VO.log("还未返回钱包");
                // backWalletWay_3()
                backWalleWay.three();
            }
            sleep(timeOut * 2);
        }
        VO.log("已经返回钱包");
    }
    start_thread(checkAndBack);
    text(exchange).waitFor();
    back_status = false;
    sleep(timeOut * 2);
}

let backWalleWay = {
    base: function () {
        recents();
        sleep(timeOut);
        VO.log("等待钱包出现");
        text("钱包").waitFor();
        sleep(timeOut * 2);
    },
    /**
     * 返回钱包界面的第一种方式
     */
    one: function () {
        base();
        click(device.width / 2, device.height / 2); //点击屏幕中心回到钱包界面
    },
    /**
     * 返回钱包界面的第二种方式
     */
    two: function () {
        base();
        click(text("钱包").findOne().bounds().left, device.height / 2);
    },
    /**
     * 返回钱包界面的第三种方式******默认使用第三种方式*********
     */
    three: function () {
        let count = 5
        while (currentPackage() !== wallet_packageName && count--) {
            console.log("当前app不是钱包，返回钱包")
            sleep(3000)
            app.launchPackage(wallet_packageName);
        }
        if(currentPackage() !== wallet_packageName){
            console.error("返回钱包失败")
            throw new Error("返回钱包失败")
        }
    },
    run() {
        VO.log("运行第三种方法返回钱包")
        this.three()
    }
};

/**
 * 检测是否返回
 */
function check_back() {
    let back_num = 0;
    // 判断是否在任务界面
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

/**
 * 检测完成数量是否为10个，如果少于10个，再进行一次脚本
 * @param count 完成的数目，可选
 */
function checkTaskNums(count?: number) {
    // return ((app_lists.length + hadRun.length) < (count || 10) && configure.isFirstRun)
    return ((app_lists.length + hadRun.length) < (count || 10) && configure.retry_count--)
}

const finish_text = "太厉害了，任务已全部完成！ 明天再来吧";
function stop() {

    VO.log("任务全部完成,退出脚本");
    //关闭钱包应用
    closeWalletApp();

    //关闭全部子线程
    configure.child_thread.excep_handler = false;
    threads.shutDownAll();
    console.hide();
    VO.log("打印运行时间:")
    console.timeEnd("wallet")
    //恢复系统媒体音量
    device.setMusicVolume(configure.defaultVolume);
    home();
    uploadData();
    // 息屏
    closeScreen();
    exit();
}

/**
 * 关闭钱包app
 * 开启一个线程去点击强行停止的按钮，仅在这个函数生效的时候线程才会运行
 */
function closeWalletApp() {
    VO.closeApp("钱包")
}

/**
 * 直接打开“一键锁屏”的app进行锁屏操作
 * */
function closeScreen() {
    app.launchApp("一键锁屏");
}

/**
 * 等待进入任务页面，在进入之前一直等待
 * @param {boolean} isFirst 是否是第一次运行 
 */
function enter_activity(isFirst) {
    VO.log("正在检查是否进入活动页面...");
    if (!device.isScreenOn()) {
        device.wakeUpIfNeeded();
        swipe(
            device.width / 2,
            device / height - 100,
            device.width / 2,
            device.height - 500,
            300
        );
        sleep(1000);
    }
    enter_activity_1();
    packageName(wallet_packageName).text(exchange).waitFor();
    VO.log("已经进入了活动页面，开始任务");
    sleep(timeOut * 3);

    start_thread(check_isfinished, "", "", undefined, 10 * 1000);
}

/**
 * 进入活动页面的第一种方式
 */
function enter_activity_1() {
    let isEnterActivity = true;
    VO.runThread(
        function () {
            while (!VO.hasOne(packageName(wallet_packageName), 1000)) {
                VO.log("打开钱包");
                console.log("打开钱包，结果：%s", app.launchPackage(wallet_packageName));
                sleep(5000);
            }
            VO.log("钱包已经打开");
        }, false
    )
    start_thread(function () {
        while (isEnterActivity) {
            textContains("跳过").waitFor();
            VO.clickNodeNotNull(textContains("跳过").findOnce());
        }
    });
    //等待30s。waitFor()函数失效
    // packageName(wallet).waitFor();
    packageName(wallet_packageName).waitFor()
    sleep(1000);
    isEnterActivity = false;
    start_thread(function () {
        while (true) {
            desc("天天领现金").waitFor();
            VO.clickNodeNotNull(desc("天天领现金").findOnce());
        }
    });
    sleep(1000);
}


let check_isfinished_thread_run = true
/**
 * 检查任务是否全部完成
 * @param {number} relay 是否延迟执行
 */
function check_isfinished(relay) {
    VO.log("监测线程已经执行")
    sleep(10 * 1000)
    while (check_isfinished_thread_run) {
        VO.log("检查任务是否完成");
        if (!at_main_page()) {
            VO.log("不在任务界面，等待返回任务界面");
        } else if (
            at_main_page() &&
            !hasNode(textContains("登录并体验"), 10) &&
            !hasNode(text(get_name), 10) &&
            !hasNode(text(download_name), 10) &&
            !hasNode(text(open_name_name), 10) &&
            !hasNode(text(download_continue), 10) &&
            !hasNode(text(pre_install), 10) &&
            !hasNode(text(open_name_name2), 10) &&
            !hasNode(text(installing), 10) &&
            !hasNode(text(waiting_time), 10) &&
            !hasNode(text(download_pause), 10)
        ) {
            VO.log("任务全部完成");
            configure.isMainThreadRun = false; //主线程结束
            // break
        } else {
            // VO.log("还有任务没有完成，继续运行");
            VO.log("继续运行");
        }
        sleep(timeOut * 2);
    }
    VO.log("监测线程关闭");
}

/**
 *
 * @returns 返回是否在任务主页
 */
function at_main_page() {
    return VO.atPage(packageName(wallet_packageName).text(exchange), 1000);
}

/**
 * 运行一个线程
 * @param {Object} obj 线程函数或者一个节点的文本
 * @param {*} msg1 文本消息1，当obj为文本的时候生效
 * @param {*} msg2 文本消息2，当obj为文本的时候生效
 * @param {boolean} [isLoop] 是否为死循环，如果为false，那么执行一次click以后就停止该线程.默认为true
 * @param {number} relay 延迟多久执行 (当obj为function时生效)
 */
function start_thread(obj, msg1, msg2, isLoop, relay) {
    if (isLoop === undefined) isLoop = true;
    if (obj instanceof Function) {
        if (relay) {
            VO.log("延迟开启监测线程")
        }
        threads.start(obj);
        // }
    } else {
        threads.start(function () {
            do {
                text(obj).waitFor();
                VO.log(msg1 || "msg1未设置");
                let node = text(obj).findOnce();
                // if (obj === download_name && hadRun.indexOf(get_app_name(node)) === -1)
                // 判断是否已经运行，如果已经运行则跳过。但是这样处理会导致卡住，暂时不搞
                VO.clickNodeNotNull(node);

                VO.log(msg2 || "msg2未设置");
                sleep(timeOut);
                if (!isLoop) {
                    return;
                }
                sleep(10);
            } while (isLoop);
        });
    }
}

/**
 * 保存已经下载的app的名称
 * @param {string} app_name app的名称
 */
function save_app_name(app_name: string) {
    if (app_name) {
        if (app_lists.indexOf(app_name) === -1) {
            app_lists.push(app_name);
        }
        return app_name;
    }
}

/**
 * 卸载安装的app
 * @param {string} app_name  app的名称
 */
function auto_uninstall(app_name: string) {
    home();
    VO.log("准备卸载应用包");
    start_thread("卸载", "发现卸载", "成功卸载");

    console.log("关闭监测线程")
    check_isfinished_thread_run = false;
    if (app_name) {
        VO.openAppDetail(app_name);
        return;
    }

    if (!configure.uninstall) {
        VO.log("关闭自动执行卸载");
        return;
    }

    //将已经运行的app全部加入到app_list，即使当天脚本已经重新运行，也能自动卸载之前的app
    if (hadRun.length)
        for (const v of hadRun) {
            v && app_lists.indexOf(v) === -1 && app_lists.push(v);
        }
    VO.log(`需要卸载的全部app有:${hadRun.toLocaleString()}`);
    hadRun.forEach((v, i) => {
        let app_name: string = v;
        if (app_name) {
            VO.log(`准备卸载第${i+1}个应用:`, app_name);
            const re = VO.openAppDetail(app_name);
            console.log("%s 卸载完成", app_name);
            re && sleep(timeOut * configure.uninstall_speed);
        }
    });
    VO.log("全部app卸载完成");
}

/**
 * 通过一个节点（安装节点）获取app的名称，同级父亲的子节点下面寻找
 * @param {object} node 节点
 * @param {number} type 1：节点；2：字符串.默认是1
 */
function get_app_name(node: UiObject | string, type) {
    if (!node) {
        return;
    }
    if (!type) type = 1;
    if (type !== 1) {
        return node.split("，")[0].split("-")[0].split(" ")[0];
    } else {
        try {
            const slibing = node.parent().children()[0];
            if (slibing) {
                const app_name = slibing.text().split("，")[0].split("-")[0].split(" ")[0];
                return app_name;
            }
        } catch (err: any) {
            VO.error(err.message);
        }
    }
    return;
}

/**
 * 判断一个节点是否存在
 * @param {object} node 节点,可以是一个节点，也可以是一个节点数组。节点数组必须每一个都找到才返回true
 * @param {number} timeOut 超时时间，可选，默认为1000ms
 */
function hasNode(node, timeOut) {
    timeOut = !!timeOut ? timeOut : 1000;
    if (node instanceof Array) {
        //这段代码有啥错呢？
        // 1 forin 不应该用于遍历数组.forin遍历得到的key是字符串类型(string),且不是按照下标顺序
        // 2 forin遍历数组可能会报syntax error 语法错误
        // 3 应该用 fori 或者 forEach/for-of(ES6语法) 遍历数组
        // for (const key in node) {
        //     if (!!node[key]) {
        //     if (!node[key].findOne(timeOut)) {
        //         return false;
        //     }
        //     }
        // }

        for (let i = 0; i < node.length; i++) {
            if (!!node[i] && !node[i].findOne(timeOut)) {
                return false;
            }
        }
        return true;
    } else {
        return node.findOne(timeOut) != null;
    }
}

/**
 * 上传运行数据，将每天已经完成的设备数据上传到云端
 * 1、运行时长数据
 * 2、下载的app的名称和个数
 * 3、运行的时间
 * 4、错误的日志信息
 */
function uploadData() {
    //如果不是自用的，不上传数据
    if (
        devices.neo5 != ROBOT_ID &&
        devices.neo8 != ROBOT_ID &&
        devices.z7x != ROBOT_ID
    ) {
        return;
    }
    VO.log("上传功能未实现");
    save_log_to_local();
    return null;
}

/**
 * 将数据保存到本地
 * 目前还有问题 files.open(file_url,"rw","utf-8")无法打开这个文件
 */
function save_log_to_local() {
    try {
        files.ensureDir(configure.file.save_url);
    } catch (error) {
        return;
    }
    try {
        const file_url =
            configure.file.save_url +
            configure.file.prefix +
            getNowTime() +
            configure.file.suffix;
        VO.log("创建日志文件：" + file_url);
        files.createWithDirs(file_url);
        files.append(
            file_url,
            "runTime:" + configure.file.data.runtime
                ? configure.file.data.runtime
                : getRunTime.getTime()
        );
        files.append(file_url, "app_lists:" + app_lists.toLocaleString());
        files.append(file_url, "date:" + configure.start_run_time);
        files.append(file_url, "\n");
    } catch (e) {
        VO.log(e);
        //保存错误日志
        configure.file.data.error_log.push(e);
    }

    //写入已经完成的任务的名称
    try {
        files.write(
            configure.file.save_url +
            configure.file.prefix +
            getNowTime(true) +
            configure.file.list_suffix,
            app_lists.toLocaleString()
        );
    } catch (e) {
        VO.log(e);
        VO.log("写入已完成任务名称文件失败");
        //保存错误日志
        configure.file.data.error_log.push(e);
    }
    //最后写入错误日志
    if (configure.file.data.error_log.length != 0) {
        try {
            const err_log_url = configure.file.save_url + configure.file.prefix + getNowTime() + configure.file.err_suffix;
            files.createWithDirs(errVO.log_url);
            files.append(err_log_url, "runTime:", configure.file.data.error_log.toLocaleString());
        } catch (e) {
            VO.log("错误日志写入失败。原因：");
            if (configure.file.data.error_log.length == 0) {
                VO.log("没有错误日志");
            } else {
                VO.log("其他原因");
            }
        }
    }
}

/**
 * 年月日
 * @param {boolean} min 最小化 true:只显示年月日；false:显示年月日时分秒
 */
function getNowTime(min) {
    const d = new Date();
    let tail = "";
    if (!min) {
        tail = "-" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
    }
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + tail;
}

function prepareSetting() {
    function initUninstallSpeed() {
        VO.log("初始化卸载速度/s");
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

        VO.log("卸载速度初始化成功");
        VO.log("当前卸载速度为:" + configure.uninstall_speed + "s卸载一次");
    }

    function initHadRun() {
        var str = "";
        try {
            str = files.read(
                configure.file.save_url +
                configure.file.prefix +
                getNowTime(true) +
                configure.file.list_suffix
            );
            hadRun = str.split(",");
        } catch (e) {
            VO.log(e);
            VO.log("文件不存在，可能是今天还没有运行");
        }

        VO.log("已经运行过的app有：[" + str + "]");
    }

    console.time("wallet")
    // 等待开启无障碍权限
    auto.waitFor();
    start_thread("确定", "发现确定", "成功点击确定");
    start_thread("禁止", "发现禁止", "成功点击禁止");

    configure.defaultVolume = device.getMusicVolume();
    device.setMusicVolume(0);
    VO.show_console();
    closeWalletApp();
    initHadRun(); //初始化已经运行过的应用
    initUninstallSpeed(); //初始化卸载速度
}

/**
 * 读取当天已经运行过的app，防止重复运行
 */

function prepareCheck() {
    VO.log(configure.debugMode.isOpen ? "调试模式已开启" : "调试模式已关闭");
    VO.log(configure.uninstall ? "自动卸载功能已开启" : "自动卸载功能已关闭");
}


/**
 * 互动领奖
 */
function interaction() {
    if (hasNode(textContains("我要金币"))) {
        VO.clickNodeNotNull(textContains("我要金币").findOne(timeOut))
        sleep(timeOut * 3)
    }

}

function runMain() {
    enter_activity();
    try {
        let count = 0
        while (configure.isMainThreadRun && count < 3) {
            // const re = run()
            const re = task()
            if (re == configure.debugMode.returnCode) {
                //如果返回代码为调试模式的returnCode，则立马结束当前运行
                VO.log("任务可能还未完成，结束运行");
                break;
            }
            if (re < 0) {
                VO.log("出现异常了，请查看日志，结束任务")
                break
            } else if (re === 0) {
                VO.log("任务正常完成")
            } else {
                VO.log("部分任务还未完成，继续任务")
                count++//记录运行的次数
            }
        }
        VO.log("运行完成:" + getNowTime())
    } catch (e) {
        VO.log(e);
    } finally {
        sleep(5000);
        if (checkTaskNums() &&  hadRun.length < app_name_list_all.length) {
            VO.log("任务数量还未达到10个，重复运行一次");
            configure.isMainThreadRun = true;
            configure.isFirstRun = false;
            closeWalletApp();
            check_isfinished_thread_run = false;
            VO.log("等待10s再运行")
            sleep(10 * 1000)
            runMain();
        } else {
            home()
            auto_uninstall();
            stop();
        }
    }
}


/**
 * 下载app的函数入口
 */
const download = () => {

    while (true) {
        const nodes = text(download_name).untilFind();
        const had_run_count = 0;
        let has_new_task = false;
        for (const iterator of nodes) {
            //获得了全部的安装节点以后，判断该任务是否已经完成，如果完成，不再执行
            const app_name = get_app_name(iterator)
            if (hadRun.indexOf(app_name) !== -1) {
                had_run_count++;
                continue
            }
            else {
                //点击安装
                has_new_task = true
                VO.clickNodeNotNull(iterator)
                sleep(1000)
            }
            //获取已经完成的任务数量
        }
        VO.log("更新已经完成任务数量:%d", had_run_count)
        //没有新的安装任务了
        if (!has_new_task) {
            VO.log("下载任务完成，退出此线程")
            break
        }
    }

}

function main() {

    prepareCheck();
    prepareSetting();
    handle_exception();

    //多线程运行点击安装、继续和领取的按钮
    start_thread(get_name, "出现领取", "成功领取");
    // start_thread(download, "出现下载", "开始下载");
    start_thread(download_continue, "出现继续下载", "继续下载");

    runMain();
}

const pre = () => {
    VO.log("正在运行的是：钱包")
}

/**
 * 钱包app
 */
export const wallet = {  //这里的wallet变量和上面的wallet变量已经冲突了，为啥不提示呢？
    name: "钱包",
    run: () => {
        try {
            pre();
            main();
            VO.log("运行完毕")
        } catch (error) {
            VO.error(error)
        } finally {
            home()
        }
    }
}