/**
 * 趣悦任务
 * @author dahaozi
 * @date 2023年10月27日16点02分
 */


import { activityDoNotDoException } from "../exception/exceptions"
import { ENTER, VO } from "../tools/tool"

import { activity, browser } from "./browser"

class activity_quyue extends activity {
    public run_count: number
    constructor(name: String, node: Object, count: number, run = true) {
        super(name, node, run)
        this.run_count = count
    }
}

const activity_list = [] as activity[]
const goal_node = id("welfare_txt").text("福利")

activity_list.push(
    new activity_quyue("下应用领金币", text("我要金币-按钮-点按两次即可激活"), 6, true),
    new activity_quyue("看视频领海量金币", text("立即观看-按钮-点按两次即可激活"), -1),
    new activity_quyue("点击搜索领金币", text("随机搜索得金币"), 30),

)

const 进入活动主页面 = () => {
    //TODO 进入活动主页面

    let enter_state: ENTER
    const re = app.launch("com.vivo.vreader")
    if (!re) {
        VO.log("打开 应用 失败")
        enter_state = ENTER.FAIL
    } else {
        VO.log("打开应用成功")
        sleep(2000)
        enter_state = ENTER.SUCCESS
        if (!VO.hasOne(id("cl_novel_search_bar_welfare_container"),2000)) {
            //尝试进入活动页面
            if (VO.hasOne(goal_node, 2000)) {
                VO.clickNode(goal_node)
                sleep(2000)
                if (!VO.atPage(text("大额专区"))) {
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

const 下应用领金币 = () => {
    browser.browser_下载推荐应用领金币({
        ks: ['打开领奖', '搜索领奖'],
        data: [{
            name: "搜索领奖",
            count: 30
        }, {
            name: "打开领奖",
            count: 20
        }],
        all_count: 6,
        goalPage: id("gold_coin_chest_time")
    })
    VO.backToPage(text("大额专区"))
}

const 看视频领海量金币 = () => {
    const get_runcount = () => {

    }

    VO.backToPage(text("大额专区"))
}

const 点击搜索词领金币 = () => {
    browser.browser_点击搜索词领金币()
    VO.backToPage(text("大额专区"))
}

const _run = () => {

    for (const obj of activity_list) {
        switch (obj.name) {
            case "下应用领金币":
                下应用领金币();
                break
            case "看视频领海量金币":
                看视频领海量金币();
                break;
            case "点击搜索领金币":
                点击搜索词领金币();
                break;
            default: break;
        }
    }

}

const pre = () => {
    VO.log("运行趣悦脚本")
    //先关闭一次app
    VO.closeApp("com.vivo.vreader")
    if (进入活动主页面() !== ENTER.SUCCESS) {
        throw new activityDoNotDoException("无法执行该趣悦任务,检查是否已经下载趣悦app？")
    }
}

export const quyue = {
    name: "趣悦",
    run: () => {
        pre()
        if (currentPackage() === "com.vivo.vreader")
            _run()
        else {
            VO.log("不在趣悦界面")
        }
        VO.log("趣悦脚本运行完毕")
    }
}


export const _quyue = {
    name: "趣悦测试环境",
    run() {
        进入活动主页面()
    }
}