/**
 * 浏览器相关的任务
 * @author dahaozi
 * @date 2023年10月27日16点01分
 */
import { time } from "console";
import { VO } from "../tools/tool";

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

let activity_list = [] as activity[];
activity_list.push(
    new activity("逛一逛领金币", textContains("逛一逛")),
    new activity("点击搜索词领金币", text("随机搜索得金币")),
    new activity("下载推荐应用领金币", textContains("我要金币")),
    new activity("幸运抽大奖", textContains("去抽奖"), true),
    new activity("日常福利", undefined, false),
    
);

const 逛一逛 = () => {
    return "任务不划算暂时不做";
    if (!VO.atPage(text("^浏览.*秒可领.*金币$"))) {
        VO.log("不在任务页面");
    }
};

const 下载推荐应用领金币 = () => {
    const mainPage = text("互动领奖专区");
    const packageName = "com.vivo.browser";
    const browserPage = id("cl_novel_search_bar_welfare_container");
    let flag1 = 0, //打开领奖
        flag2 = 0; //搜索领奖
    let count = 5; //总运行次数
    let running = true;

    const keys = ["打开领奖", "搜索领奖"];
    //   threads.start(() => {
    //     while (packageName && currentPackage() != packageName && running) {
    //       app.launchPackage(packageName);
    //       sleep(1000);
    //     }
    //   });
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
        for (const key of keys) {
            if (
                (flag1 > 20 && key === "打开领奖") || (key === "搜索领奖" && flag2 > 30)
            ) {
                continue;
            }
            if (flag1 >= 20 && flag2 >= 30) {
                break flag;
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

        if (VO.hasNode(node)) {
            //有随机搜索得金币的按钮
            //获取浏览次数
            let count = getSearchCount()
            while (count--) {
                node.waitFor()
                VO.clickNodeNotNull(node.findOne(1000))
                sleep(12 * MS)
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

export const browser = {
    name: "浏览器脚本任务",
    object: activity_list,
    run: () => {
        VO.log("browser开始运行");
        _run();
        VO.log("browser运行结束");
    },
};
