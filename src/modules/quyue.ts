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

const _进入活动主页面 = () => {
    //TODO 进入活动主页面

    let enter_state: ENTER
    const re = app.launch("com.vivo.vreader")
    if (!re) {
        console.error("打开 应用 失败")
        enter_state = ENTER.FAIL
    } else {
        VO.log("打开应用成功")
        sleep(2000)
        enter_state = ENTER.SUCCESS
        if (!VO.hasOne(id("cl_novel_search_bar_welfare_container"), 2000)) {
            //尝试进入活动页面
            if (VO.hasOne(goal_node, 10000)) {
                VO.clickNode(goal_node)
                if (!VO.hasOne(text("大额专区"),10000)) {
                    console.error("进入失败，无法进入")
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

const 进入活动主页面 = ()=>{
    return VO.runWithCatch(_进入活动主页面)
}

const _下应用领金币 = () => {

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

const 下应用领金币 = () => {
    VO.runWithCatch(_下应用领金币)

}

const _看视频领海量金币 = () => {
    let has_done = 0;//已经完成的次数
    let MAX_COUNT = 10;//总次数
    let single_GoldCoin = 88;//单次获得的金币数
    let running = true
    const get_runcount = () => {
        // 看视频领海量金币可获得88金币,已完成6次，最高可完成10次
        const count_text = "看视频领海量金币可获得.*金币,已完成.*次，最高可完成.*次"
        const node = textMatches(count_text)
        if (VO.hasOne(node, 2000)) {
            const str = node.findOnce().text()
            VO.log("匹配到文本:", str)
            const count_arr = str.match(/\d+/g).map((str) => {
                return parseInt(str)
            })
            has_done = count_arr[1]
            MAX_COUNT = count_arr[2]
            single_GoldCoin = count_arr[0]
        }

        VO.log("更新了任务数量:has_done = ", has_done, ",MAX_COUNT=", MAX_COUNT)
    }

    const goal_page = id("time_count_text")//计时的控件
    const back_btn = id("time_count_layout")

    threads.start(() => {
        while (running) {
            if (VO.hasOne(textContains("立即领取"), 1000)) {
                VO.clickNode(textContains("立即领取"))
                sleep(1000)
            }
            sleep(100)
        }
    })
    const enterActivity = () => {
        const enter_node = className("android.widget.TextView").text("立即观看-按钮-点按两次即可激活")
        let state = true
        if (!VO.hasOne(goal_page, 1000)) {
            if (VO.hasOne(enter_node, 3000)) {
                VO.clickNode(enter_node)
                VO.log("等待goalpage出现")
                // goal_page.waitFor()
                if(!VO.waitNode(goal_page,5)){
                    console.error("goalpage未出现")
                    state = false
                }else{
                    VO.log("goalpage已经出现")
                }
            }
            else {
                console.error("不在任务页且不能进入任务页，无法完成")
                state = false
            }
        }
        VO.log("已经进入任务页，开始任务")
        return state
    }
    //检查是否在任务页
    if (!VO.hasOne(text("大额专区"), 1000)) {
        console.error(Function.name, "不在任务页，请先进入任务页再执行！")
        return;
    }

    let 无法完成的次数 = 0//如果无法完成的次数大于3次，则终止该任务
    let wait_time = 30
    get_runcount()
    while (has_done < MAX_COUNT) {
        //先进入任务详情页
        if (!enterActivity()) {
            无法完成的次数++
            if (无法完成的次数 > 3) {
                break;
            }
            continue;
        }
        //计算计时控件的text是否已经结束
        //计算睡眠时间
        wait_time = parseInt((goal_page.findOne(2000)?.text()?.match(/\d+/) || [])[0] || "0") || 30

        /*
            由于无法获取到等待时间，故统一将等待时间设置为30s
        */
        // let wait_timetext = goal_page.findOne(2000).text()
        // while (VO.hasOne(goal_page, 2000) && (wait_timetext !== '奖励已成功发放')) {
        //     wait_timetext = goal_page.findOne(2000).text()
        //     const wait_timearr = wait_timetext.match(/\d+/)
        //     if (!wait_timearr) {
        //         break;
        //     } else {
        //         VO.log("当前任务剩余：", wait_timearr[0] + "秒")
        //     }
        //     sleep(2000)
        // }

        while (wait_time >= 0) {
            wait_time -= 2
            VO.log("当前任务剩余：", wait_time + "秒")
            sleep(2000)
        }

        //点击返回按钮,不可行，每个广告厂商提供的按钮都不一样
        // VO.clickNode(back_btn)
        VO.backToPage(text("大额专区"))
        sleep(1000)
        has_done++
        get_runcount()

    }
    running = false
    VO.backToPage(text("大额专区"))
}

const 看视频领海量金币 = () => {
    VO.runWithCatch(_看视频领海量金币)
}

const _点击搜索词领金币 = () => {
    browser.browser_点击搜索词领金币()
    VO.backToPage(text("大额专区"))
}

const 点击搜索词领金币 = () => {
    VO.runWithCatch(_点击搜索词领金币)
}

const _run = () => {
    for (const obj of activity_list) {
        switch (obj.name) {
            case "下应用领金币":
                VO.runWithCatch(下应用领金币)
                break
            case "看视频领海量金币":
                VO.runWithCatch(看视频领海量金币)
                break;
            case "点击搜索领金币":
                VO.runWithCatch(点击搜索词领金币)
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



/**
 * 趣悦app
 */
export const quyue = {
    name: "趣悦",
    run: () => {
        pre()
        if (currentPackage() === "com.vivo.vreader")
            _run()
        else {
            console.error("不在趣悦界面")
        }
        VO.log("趣悦脚本运行完毕")
        home()
        sleep(3000)
    }
}

export const _quyue = {
    name: "趣悦测试环境",
    run() {
        进入活动主页面()
    }
}