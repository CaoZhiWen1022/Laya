const { exec } = require('child_process');

function npmRunGenerate(params) {
    return new Promise((resolve, reject) => {
        //cd 到 fguiideitor目录
        exec('cd /d D:\\LayaProject\\Warrior\\WarriorClient && npm run generate', (error, stdout, stderr) => {
            if (error) {
                console.error(`执行错误: ${error.message}`);
                resolve(false)
                return;
            }
            if (stderr) {
                console.error(`错误输出: ${stderr}`);
                resolve(false)
                return;
            }
            console.log(`标准输出: ${stdout}`);
            return resolve(true);
        });
    })
}

async function main() {
    console.log("开始执行npm run generate\n");
    let result = await npmRunGenerate();
    console.log("执行npm run generate结束 " + result + "\n");
}

main();