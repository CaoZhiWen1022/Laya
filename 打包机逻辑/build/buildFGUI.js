const { exec } = require('child_process');

function buildFGUI() {
    return new Promise((resolve, reject) => {
        //cd 到 fguiideitor目录
        exec('cd /d C:\\Users\\fans\\Desktop\\FairyGUI-Editor_6.0.5\\FairyGUI-Editor && FairyGUI-Editor -batchmode -p "d:\\LayaProject\\Warrior\\WarriorUI\\WarriorUI.fairy"', (error, stdout, stderr) => {
            if (error) {
                resolve(false)
                return;
            }
            if (stderr) {
                resolve(false)
                return;
            }
            return resolve(true);
        });
    })
}

async function main() {
    console.log("开始发布fgui\n");
    let result = await buildFGUI();
    console.log("发布fgui结束 " + result + "\n");
}

main();