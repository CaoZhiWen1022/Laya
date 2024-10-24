const { exec } = require('child_process');

const gitPath = [
    { name: "WarriorUI", path: "D:\\LayaProject\\Warrior\\WarriorUI" },
    { name: "WarriorClient", path: "D:\\LayaProject\\Warrior\\WarriorClient" },
    { name: "WarriorGame", path: "D:\\LayaProject\\Warrior\\WarriorClient\\src\\game" },
]

function gitPull(path) {
    return new Promise((resolve, reject) => {
        exec(`cd /d ${path} && git pull`, (error, stdout, stderr) => {
            if (error) {
                console.error(`${path} git pull error`);
                resolve(false)
                return;
            }
            if (stderr) {
                console.error(`${path} git pull error`);
                resolve(false)
                return;
            }
            console.log(`${path} git pull success`);
            return resolve(true);
        });
    })
}

async function main() {
    //开始更新git
    console.log("开始更新git\n");
    for (let i = 0; i < gitPath.length; i++) {
        await gitPull(gitPath[i].path)
    }
    console.log("更新git结束\n");
}

main();