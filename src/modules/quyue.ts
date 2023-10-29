/**
 * 趣悦任务
 * @author dahaozi
 * @date 2023年10月27日16点02分
 */


import { VO } from "../tools/tool"

import { activity, browser } from "./browser"

class activity_quyue extends activity {
    public run_count: number
    constructor(name: String, node: Object, count: number, run = true) {
        super(name, node, run)
        this.run_count = count
    }
}

const activity_list = [] as activity[]

activity_list.push(
    new activity_quyue("下应用领金币", text("我要金币-按钮-点按两次即可激活"), 6, true),
    new activity_quyue("看视频领海量金币", text("立即观看-按钮-点按两次即可激活"), -1),
)

const 进入活动主页面 = ()=>{

}

const 下应用领金币 = () => {
    browser.browser_下载推荐应用领金币({
        ks: ['搜索领奖'],
        data: [{
            name: "搜索领奖",
            count: 30
        }],
        all_count: 6,
        goalPage: id("gold_coin_chest_time")
    })
}

const 看视频领海量金币 = () => {
    const get_runcount = () => {

    }

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
            default: break;
        }
    }

}


export const quyue = {
    name: "趣悦",
    run: () => {
        VO.log("运行趣悦脚本")
        if (currentPackage() === "com.vivo.vreader")
            _run()
        else {
            VO.log("不在趣悦界面")
        }
        VO.log("趣悦脚本运行完毕")
    }
}


export const _quyue = {
    name:"趣悦测试环境",
    run(){
        进入活动主页面()
    }
}