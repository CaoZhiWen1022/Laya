const fs = require('fs');
const { exec } = require('child_process');
const os = require('os');
const config = require('./config.json');
const path = require('path');

/**id {state:0|1,  lastPublishState:0|1|2} */
let projectMap = new Map();

function getProjectByUid(uid) {
    //读取用户信息
    let userInfo = require('./Account.json');
    let userData = userInfo.find(user => user.uid === uid);
    if (userData) {
        if (userData.isAdmin) {
            let projects = require('./Project.json');
            return { code: 200, message: projects.map(project => project.id) }
        }
        return { code: 200, message: userData.projects };
    }
}

function getProjectDataById(id) {
    //读取所有项目
    let projects = require('./Project.json');
    return { code: 200, message: projects.find(project => project.id === id) };
}

async function createProject(projectObj) {
    //校验
    if (!projectObj.name || !projectObj.path || !projectObj.svn) {
        return { code: -1, message: '项目名称和路径不能为空' };
    }
    let projectPath = config.ProjectPathRoot + "\\" + projectObj.path;
    //检查项目路径是否存在
    if (fs.existsSync(projectPath)) {
        return { code: -1, message: '项目路径已存在' };
    }

    //读取所有项目
    let projects = require('./Project.json') || [];
    let maxId = 0;
    projects.forEach(project => {
        if (project.id > maxId) {
            maxId = project.id;
        }
    });
    projectObj.id = maxId + 1;
    projects.push(projectObj);
    fs.writeFileSync('./Project.json', JSON.stringify(projects));
    //根据创建路径和svn创建项目
    //创建项目路径

    fs.mkdirSync(projectPath, { recursive: true });
    //执行svn拉取
    let result = await new Promise((resolve, reject) => {
        exec(`svn co ${projectObj.svn} ${projectPath}`, (error, stdout, stderr) => {
            console.log("svn拉取完成");
            if (error) {
                resolve(false)
            } else {
                resolve(true)
            }

        })
    })
    if (!result) {
        return { code: -1, message: '项目创建失败' };
    }

    return { code: 200, message: '项目创建成功' };

}

function getProjectState(id) {
    //状态0：正常状态 状态1：发布中
    let project = projectMap.get(id);
    console.log(project);

    if (project) {
        return { code: 200, message: project };
    } else {
        return { code: 200, message: { state: 0, lastPublishState: 0 } };
    }
}

function getPublishLog(id) {
    //获取发布日志
    const logPath = path.resolve(__dirname, `./logs/${id}.txt`);
    if (!fs.existsSync(logPath)) {
        return { code: 200, message: '' };
    }
    const log = fs.readFileSync(logPath, 'utf-8');
    return { code: 200, message: log };
}

async function publishProject(id) {
    console.log("发布项目");
    let project = projectMap.get(id);
    if (!project) {
        project = { state: 0, lastPublishState: 0 };
        projectMap.set(id, project);
    }
    if (project.state == 1) {
        console.log("项目发布中...");
        return { code: -1, message: '项目已发布中' };
    }
    project.state = 1;
    //获取项目数据
    let projectData = getProjectDataById(id);
    let projectPath = config.ProjectPathRoot + "\\" + projectData.message.path;
    //获取发布脚本
    let publishScriptPath = projectPath + "\\publish.js";
    //检查文件是否存在
    if (!fs.existsSync(publishScriptPath)) {
        console.log("发布脚本不存在");
        project.state = 0;
        project.lastPublishState = 2;
        return;
    }
    exec(`node ${publishScriptPath}`, (error, stdout, stderr) => {
        // 记录发布完成时间（格式化：YYYY-MM-DD HH:mm:ss）
        const finishTime = formatDate(new Date());

        // 更新项目状态（保持原有逻辑，补充注释）
        if (error) {
            console.log("\n【发布结果】失败");
            project.state = 0; // 假设0为"未发布/发布失败"状态
            project.lastPublishState = 2; // 假设2为"发布失败"状态
        } else {
            console.log("\n【发布结果】成功");
            project.state = 0;
            project.lastPublishState = 1; // 假设1为"发布成功"状态
        }
        console.log(`【发布完成时间】${finishTime}`);

        // 3. 优化日志内容收集（结构化、易读）
        let logContent = `
==========================================
项目发布日志
==========================================
发布时间：${finishTime}
项目ID：${id}
发布脚本：${publishScriptPath}
发布结果：${error ? '失败' : '成功'}
==========================================
                          `;

        // 收集stdout（脚本正常输出）
        if (stdout) {
            logContent += `\n【标准输出 stdout】\n${stdout.trim()}\n`;
        } else {
            logContent += `\n【标准输出 stdout】\n无\n`;
        }

        // 收集stderr（脚本错误输出，即使整体无error也可能存在）
        if (stderr) {
            logContent += `\n【错误输出 stderr】\n${stderr.trim()}\n`;
        } else {
            logContent += `\n【错误输出 stderr】\n无\n`;
        }

        // 收集执行错误信息（exec执行失败的错误，如脚本不存在、权限不足等）
        if (error) {
            logContent += `\n【执行错误 error】\n`;
            logContent += `错误码：${error.code || '未知'}\n`;
            logContent += `错误信号：${error.signal || '无'}\n`;
            logContent += `错误信息：${error.message || '无'}\n`;
        } else {
            logContent += `\n【执行错误 error】\n无\n`;
        }

        logContent += `\n==========================================\n`;

        // 4. 写入日志文件（修复原代码的字符串字面量错误："logstr" → logContent）
        const logPath = path.resolve(__dirname, `./logs/${id}.txt`); // 使用绝对路径更可靠
        writeFileSync(logPath, logContent);

        // 控制台打印关键信息（精简输出，避免刷屏）
        console.log("\n【执行详情】");
        if (error) console.error('Error:', error.message);
        if (stdout) console.log('Stdout:', stdout.trim().substring(0, 200) + '...'); // 只打印前200字符
        if (stderr) console.error('Stderr:', stderr.trim().substring(0, 200) + '...');
    });

}

function writeFileSync(filePath, data) {
    if (!data) return;
    console.log("开始写入日志", filePath, data);

    // 提取文件的父文件夹路径（比如"logs"）
    const dirPath = path.dirname(filePath);
    // 只创建父文件夹（如果不存在）
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
    // 写入文件（此时父文件夹已存在，文件会自动创建）
    fs.writeFileSync(filePath, data);
}

function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份0-11，补0成两位
    const day = String(date.getDate()).padStart(2, '0');
    const hour = String(date.getHours()).padStart(2, '0');
    const minute = String(date.getMinutes()).padStart(2, '0');
    const second = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}

module.exports = {
    getProjectByUid,
    getProjectDataById,
    createProject,
    publishProject,
    getProjectState,
    getPublishLog
};