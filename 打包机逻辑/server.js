const express = require('express');
const { getProjectByUid, getProjectDataById, createProject, publishProject, getProjectState, getPublishLog } = require('./ProjectScripts.js');
const os = require('os');
const fs = require('fs');
const app = express();
const config = require('./config.json');

loginClients = [];

/**
 * 获取本机所有内网 IPv4 地址
 * @returns {string[]} 内网 IP 数组（如 ['192.168.1.100', '10.0.0.5']）
 */
function getLocalIpAddresses() {
    const interfaces = os.networkInterfaces(); // 获取所有网络接口
    const localIps = [];

    // 遍历所有网络接口（如 'Wi-Fi'、'以太网'、'VMware Network Adapter' 等）
    for (const ifaceName in interfaces) {
        const iface = interfaces[ifaceName];

        // 遍历接口下的所有地址配置
        for (const alias of iface) {
            // 过滤条件：IPv4 + 非本地回环 + 内网网段 + 网卡已启用
            if (
                alias.family === 'IPv4' && // 只保留 IPv4
                alias.address !== '127.0.0.1' && // 排除本地回环地址
                !alias.internal && // 排除内部接口（如虚拟机内网）
                alias.status !== 'down' && // 排除未启用的网卡
                isPrivateIp(alias.address) // 验证是否为内网 IP
            ) {
                localIps.push(alias.address);
            }
        }
    }

    // 去重（避免同一网卡多配置导致重复）
    return [...new Set(localIps)];
}
function isPrivateIp(ip) {
    const ipSegments = ip.split('.').map(Number); // 拆分 IP 为四段数字
    if (ipSegments.length !== 4) return false; // 非法 IP 格式直接返回 false

    const [a, b] = ipSegments;
    // 匹配私有 IP 网段
    return (
        (a === 10) || // 10.x.x.x
        (a === 172 && b >= 16 && b <= 31) || // 172.16.x.x ~ 172.31.x.x
        (a === 192 && b === 168) // 192.168.x.x
    );
}

//检查Account.json文件是否存在
if (!fs.existsSync('./Account.json')) {
    console.log("Account.json文件不存在，创建文件并添加管理员账号");
    fs.writeFileSync('./Account.json', '[{"username":"admin","password":"123456","uid":"admin","name":"管理员","isAdmin":true}]');
}
//判断项目文件是否存在，不存在则创建
if (!fs.existsSync('./Project.json')) {
    console.log("Project.json文件不存在，创建文件");
    fs.writeFileSync('./Project.json', '[]');
}

//检查项目，路径不存在的删除掉
let projects = require('./Project.json');
let users = require('./Account.json');
for (let i = 0; i < projects.length; i++) {
    const element = projects[i];
    let path = config.ProjectPathRoot + "\\" + element.path;
    if (!fs.existsSync(path)) {
        projects.splice(i, 1);
        users.forEach(user => {
            user.projects = user.projects.filter(project => project != element.id);
        })
    }
}

fs.writeFileSync('./Project.json', JSON.stringify(projects));
fs.writeFileSync('./Account.json', JSON.stringify(users));

// 解析 JSON 请求体
app.use(express.json());

// 提供静态文件服务
app.use(express.static('public'));

// 定义一个简单的 API 路由
app.get('/api/data', (req, res) => {
    res.json({ message: 'Hello from Node.js!' });
});

app.post('/api/login', (req, res) => {
    // 获取前端传递的账号、密码
    const { username, password } = req.body;
    //读取账号密码文件
    let Account = require('./Account.json');
    for (let i = 0; i < Account.length; i++) {
        const element = Account[i];
        if (element.username == username && element.password == password) {
            res.json({ code: 200, message: { uid: element.uid } });

            return;
        }
    }

    res.json({ code: -1, message: '登录失败' });
});

app.post('/api/publishRecords', (req, res) => {

});

app.post('/api/getProjects', (req, res) => {
    let projects = getProjectByUid(req.body.uid);
    return res.json(projects);
});

app.post('/api/getProjectDataById', (req, res) => {
    let projects = getProjectDataById(req.body.id);
    return res.json(projects);
});

app.post('/api/createProject', async (req, res) => {
    try {
        console.log("接收到创建项目请求", req.body);
        let result = await createProject(req.body);
        return res.json(result);
    } catch (error) {
        return res.json({ code: -1, message: '创建项目失败' });
    }

})

app.post('/api/getProjectState', (req, res) => {
    let result = getProjectState(req.body.id);
    return res.json(result);
})

app.post('/api/publishProject', async (req, res) => {
    try {
        if (getProjectState(req.body.id).message == 1) return res.json({ code: -1, message: '项目已发布中' });
        publishProject(req.body.id);
        return res.json({ code: 200, message: '' });
    } catch (error) {
        return res.json({ code: -1, message: '发布项目失败' });
    }

})

app.post('/api/getLoginState', (req, res) => {
    let result = getLoginState(req.body.uid);
    return res.json(result);
})

app.post("/api/getPublishLog", (req, res) => {
    let result = getPublishLog(req.body.id);
    return res.json(result);
})

// 启动服务器
app.listen(config.port, () => {
    //内网地址
    console.log();

    let ipAddresses = getLocalIpAddresses();
    ipAddresses.forEach(ip => console.log(`http://${ip}:${config.port}`));
    console.log("started");
});
