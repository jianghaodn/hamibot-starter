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
import { wallet } from "./modules/wallet";

init();

const configure = {
    show_console: true
}


VO.runWithCatch(wallet.run)
exit()
try{
    VO.runWithCatch(browser.run);
}catch(error){
    console.error(error)
    //捕获到异常，重新运行一次
    console.log("由于出现问题，重新运行一次")
    VO.runWithCatch(browser.run);
}finally{
    //
}
try{
    VO.runWithCatch(quyue.run);
}catch(error){
    console.error(error)
    //捕获到异常，重新运行一次
    console.log("由于出现问题，重新运行一次")
    VO.runWithCatch(quyue.run);
}finally{
    //
}



VO.log("任务已经全部运行完毕了")
VO.log("脚本窗口将在10秒后关闭")
sleep(10 * 1000)
exit()
// rclone mount dahaozi:/  /aliyun --cache-dir /tmp --allow-other --vfs-cache-mode writes --allow-non-empty --no-update-modtime --header "Referer:" &
// mkdir -p /tmp/introot
// mkdir -p /tmp/extroot
// mount --bind / /tmp/introot
// mount /dev/sdc1 /tmp/extroot
// tar -C /tmp/introot -cvf - . | tar -C /tmp/extroot -xf -
// umount /tmp/introot
// umount /tmp/extroot
// rclone mount aliyun: /  /mnt / aliyun--cache - dir / tmp--allow - other--vfs - cache - mode writes--allow - non - empty--no - update - modtime--header "Referer:" &