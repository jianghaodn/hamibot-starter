/*
 * @Author: BATU1579
 * @CreateDate: 2022-05-24 16:58:03
 * @LastEditor: BATU1579
 * @LastTime: 2022-09-23 17:45:32
 * @FilePath: \\src\\index.ts
 * @Description: 脚本入口
 */
import {} from "./global";
import { init } from "./lib/init";
import { browser } from "./modules/browser";
import {VO} from "./tools/tool"

init();
console.log(browser.name);
console.log('测试tool工具箱');
browser.run()