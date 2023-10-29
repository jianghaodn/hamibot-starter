/**
 * 浏览器相关的任务
 * @author dahaozi
 * @date 2023年10月27日16点01分
 */
import { time } from "console";
import { VO, ENTER} from "../tools/tool";
import { activityDoNotDoException } from "../exception/exceptions";


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

export { activity }

let activity_list = [] as activity[];
activity_list.push(
    new activity("逛一逛领金币", textContains("逛一逛")),
    new activity("点击搜索词领金币", text("随机搜索得金币")),
    new activity("下载推荐应用领金币", textContains("我要金币")),
    new activity("幸运抽大奖", textContains("去抽奖"), true),
    new activity("日常福利", undefined, false),

);

const 进入活动主页面 = () => {
    const goalPage = packageName("com.vivo.browser").text("下载应用赚金币")
    
    let enter_state: ENTER = ENTER.SUCCESS
    const re = app.launch("com.vivo.browser")
    if (!re) {
        VO.log("打开 浏览器 失败")
        enter_state = ENTER.FAIL
    } else {
        VO.log("打开应用成功")
        sleep(2000)
        if (!VO.hasOne(goalPage,2000)) {
            //尝试进入活动页面
            const goal_node = id("btn_text").text("免费小说")
            //尝试点击页面底部的免费小说
            if (VO.hasOne(goal_node, 2000)) {
                VO.clickNode(goal_node)
                if (!VO.atPage(goalPage,2000)) {
                    const node = id("channel_image_view").findOne(1000)?.parent()
                    //继续点击福利按钮
                    if(node){
                        VO.clickNodeNotNull(node)
                        if(!VO.atPage(goalPage,2000)){
                            enter_state = ENTER.FAIL
                        }
                    }else{
                        enter_state = ENTER.FAIL
                    }
                    VO.log("进入失败，无法进入")
                    enter_state = ENTER.FAIL
                } else {
                    VO.log("已经进入任务主页面，开始脚本")
                }
                //进入成功，继续脚本
            }
        } else {
            enter_state = ENTER.FAIL
        }
    }

    return enter_state
}


const 逛一逛 = () => {
    return "任务不划算暂时不做";
    if (!VO.atPage(text("^浏览.*秒可领.*金币$"))) {
        VO.log("不在任务页面");
    }
};


/**
 * 
 * @param obj {data:[{}],ks:[], all_count:6 ,goalPage:node}
 * @returns 
 */
const 下载推荐应用领金币 = (obj?: any) => {
    const mainPage = text("互动领奖专区");
    const packageName = "com.vivo.browser";
    const browserPage = obj?.goalPage || id("cl_novel_search_bar_welfare_container");
    let flag1 = 0, //打开领奖
        flag2 = 0; //搜索领奖
    let f1_max = 20, f2_max = 30//最大运行次数
    let f1_single = 100, f2_single = 100
    let count = obj?.all_count || 5; //总运行次数
    let running = true;
    /*
    obj.data:
        [{
            name:"打开领奖",
            count:20
        }]
    */
    const data = obj?.data

    //尝试获取运行次数，只在趣悦app 有效
    const get_run_count = () => {
        if (obj && Object.keys(obj).length !== 0) {
            //是趣悦
            sleep(1000)//等待页面加载完成
            if(VO.hasOne(textContains("任务溜走了"),3000)){
                //没有任务，可能是黑号了
                flag1 = f1_max = 0
                f2_max = flag2 = 0
                VO.log("更新运行次数：flag1 = ",flag1,",f1_max = ",f1_max)
                VO.log("更新运行次数：flag2 = ",flag2,"f2_max = ",f2_max)
                VO.warning("号黑了老兄！")
                return;
            }
            
            if (VO.hasOne(text("免费领奖"),3000)) {
                const count_node1 = text("免费领奖").findOne(3000)?.parent()?.child(2)
                flag1 = parseInt(count_node1?.text().split("/")[0] || "0") / f1_single
                f1_max = parseInt(count_node1?.text().split("/")[1] || "0") / f1_single
                VO.log("更新运行次数：flag1 = ",flag1,",f1_max = ",f1_max)
                // throw new BaseException("测试结束")
            } 
            if (VO.hasOne(text(" 点击搜索词并浏览8秒领金币".trim()),3000)) {
                const count_node2 = text("点击搜索词并浏览8秒领金币").findOne(5000)?.parent()?.child(2)
                flag2 = parseInt(count_node2?.text().split("/")[0] || "0") / f2_single
                f2_max = parseInt(count_node2?.text().split("/")[1] || "0") / f2_single
                VO.log("更新运行次数：flag2 = ",flag2,"f2_max = ",f2_max)
                // throw new BaseException("测试结束")
            }
        }
    }

    //设置f1和f2的数量
    if (data && data.length) {
        for (const d of data) {
            if (d.name === "打开领奖") {
                f1_max = d.count
            } else if (d.name === "搜索领奖") {
                f1_max = d.count
            }
        }
    }

    const keys = obj?.ks || ["打开领奖", "搜索领奖"];
    VO.log("运行任务keys:", keys.join("&"));
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
            // VO.hasOne(textContains("逛一逛")) &&  VO.clickNode(textContains("逛一逛")) || (VO.log("没有在任务界面，且无法进入任务，退出"))
        }
        get_run_count()
        //TODO 有些任务被折叠起来，是否需要展开折叠？如果不展开，是否存在被检测的风险？
        for (const key of keys) {
            if (flag1 >= f1_max && flag2 >= f2_max) {
                break flag;
            }
            if ((key === "打开领奖" && flag1 >= f1_max) || (key === "搜索领奖" && flag2 >= f2_max)) {
                continue;
            }
            sleep(1000);
            const keyNodes = textContains(key).find();

            for (let i = 0; i < keyNodes.length; i++) {
                const node = keyNodes[i];
                sleep(1000);
                VO.clickNodeNotNull(node);
                VO.log("执行任务" + key);
                if (key === "打开领奖") {
                    flag1++;
                    sleep(1000);
                    VO.backToPage(mainPage);
                    VO.log("等待5秒")
                    sleep(5000);
                } else if (key === "搜索领奖") {
                    flag2++;
                    VO.log("等待10秒")
                    sleep(10 * 1000);
                    VO.backToPage(mainPage, 2000);
                } else {
                    VO.backToPage(mainPage);
                }
            }
            sleep(1000);
        }
        //退出这个任务界面
        VO.backToPage(browserPage);
        sleep(2000);
    }

    running = false;
};

const 点击搜索词领金币 = () => {
    const text_contains = "随机搜索得金币"
    const MS = 1000

    let ALL_COUNT = 30//总共需要运行的次数
    let has_search = 0//已经运行的次数
    //初始化数据
    const init = function () {
        has_search = 0;
        ALL_COUNT = 30;
    }

    //记录运行数据
    const finish = function () {

    }

    const getSearchCount = function () {
        if (currentPackage() === "com.vivo.browser") {
            const count_node = textContains("搜索1次得")
            if (VO.hasNode(count_node)) {
                try {
                    let nodeinfo = textContains("搜索1次得").findOne(1000)
                    //从节点信息获取运行次数信息
                    let node_arr = nodeinfo?.text().split("/")
                    has_search = parseInt(node_arr![0].substring(13))
                    ALL_COUNT = parseInt(node_arr![1].substring(0, 2))
                } catch (error) {
                    VO.log(error)
                }
            }
        } else {
            has_search = 0
            ALL_COUNT = 30
        }
        return ALL_COUNT - has_search;
    }

    /*
    * 模拟随机滑动
    * @param { number } timeOut 任务等待时间
    */
    const random_swipe = function (timeOut?) {
        // TODO 随机滑动未实现
        VO.log("随机滑动未实现", timeOut)
    }

    const random_search = function () {
        const node = textContains(text_contains)

        if (VO.hasOne(node,3000)) {
            //有随机搜索得金币的按钮
            //获取浏览次数
            let count = getSearchCount()
            const sleep_time = 12 * MS
            while (count--) {
                node.waitFor()
                VO.clickNodeNotNull(node.findOne(1000))
                VO.log(`等待${sleep_time/MS}秒`)
                sleep(sleep_time)
                //模拟随机滑动
                random_swipe()
                back()
                sleep(MS * 3)
                has_search++
            }
            VO.log("search任务全部完成")
        } else {
            VO.log("根本没有随机搜索的按钮")
        }
    }
    init()
    random_search()
    finish()

}

const 去抽奖 = () => { };

const _run = function () {
    for (const app of activity_list) {
        if (app.name === "逛一逛领金币") {
            逛一逛();
        } else if (app.name === "下载推荐应用领金币") {
            下载推荐应用领金币();
        } else if (app.name === "点击搜索词领金币") {
            点击搜索词领金币();
        } else {
            VO.log("任务" + app.name + "不执行");
        }
    }
};

const pre = () => {
    VO.log("browser开始运行");
    //关闭浏览器
    VO.closeApp("com.vivo.browser")
    if (进入活动主页面() !== ENTER.SUCCESS) {
        throw new activityDoNotDoException("无法执行该浏览器任务")
    }
}

export const browser = {
    name: "浏览器脚本任务",
    object: activity_list,
    run: () => {
        pre();
        if (currentPackage() === "com.vivo.browser") {
            _run();
        } else {
            VO.log("不在浏览器中，运行结束")
        }
        VO.log("browser运行结束");
    },
    //将这个函数导出去让趣悦也使用
    browser_下载推荐应用领金币: (obj: any) => {
        下载推荐应用领金币(obj)
    },
    browser_点击搜索词领金币(){
        点击搜索词领金币()
    }
};



export const _browser = {
    name: "测试浏览器环境",
    run() {
        const re = 进入活动主页面()
        VO.log("输出测试结果:", re)
    }
}
