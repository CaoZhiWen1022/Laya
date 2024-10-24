const { exec } = require('child_process');
const buildlog = require('./buildlog.js');
let scripts = [
    { name: "更新git", script: "node ./build/updateGit.js" },
    { name: "打包fgui", script: "node ./build/buildFGUI.js" },
    { name: "npm run generate", script: "node ./build/npmRunGenerate.js" },
    { name: "打包laya", script: "node ./build/buildLaya.js" },
]

function runScript(param) {
    return new Promise((resolve, reject) => {
        exec(param, (error, stdout, stderr) => {
            if (error) {
                resolve(false)
                return;
            }
            if (stderr) {
                resolve(false)
                return;
            }
            return resolve(true);
        })
    })
}

async function main() {
    buildlog.delLogFile("开始打包\n");
    for (let i = 0; i < scripts.length; i++) {
        const element = scripts[i];
        console.log(element.name);
        buildlog.writeLog(element.name + "\n");
        let result = await runScript(`${element.script}`);
        if (!result) {
            console.log(element.name + "失败");
            return;
        }
        console.log(element.name + "成功");
    }
}
main()