/*
 * @Author: BATU1579
 * @CreateDate: 2022-05-24 16:58:03
 * @LastEditor: BATU1579
 * @LastTime: 2022-09-23 17:45:32
 * @FilePath: \\src\\index.ts
 * @Description: 脚本入口
 */
import { } from "./global";
import { init } from "./lib/init";
import { browser, _browser } from "./modules/browser";
import { VO } from "./tools/tool"
import { quyue, _quyue } from "./modules/quyue";

init();
enum MODE {
    TEST, RELEASE
}

let mode = MODE.TEST

console.log('测试tool工具箱');
if (mode === MODE.TEST) {
    //测试环境
    _browser.run()
    _quyue.run()
} else {
    try {
        browser.run()
    } catch (error) {
        VO.log(error)
    }finally{
        home()
    }
    try {
        quyue.run()
    } catch (error) {
    VO.log(error)        
    }finally{
        home()
    }
}
