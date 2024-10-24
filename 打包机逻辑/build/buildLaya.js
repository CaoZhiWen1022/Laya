const { exec } = require('child_process');

function buildLaya() {
    return new Promise((resolve, reject) => {
        //cd 到 Layaideitor目录
        exec('cd /d C:\\Program Files\\LayaAirIDE && LayaAirIDE --project=D:\\LayaProject\\Warrior\\WarriorClient --script=MyScript.buildWeb', (error, stdout, stderr) => {
            resolve(true);
        })
    })
}

async function main() {
    console.log("开始发布laya\n");
    await buildLaya();
    console.log("发布laya结束\n");
}

main();