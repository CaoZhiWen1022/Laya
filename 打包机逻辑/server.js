const express = require('express');
const { exec } = require('child_process');
const serverState = require('./serverState.js');
const app = express();
const port = 3000;
let ServerState = new serverState();
ServerState.setState(0);
// 解析 JSON 请求体
app.use(express.json());

// 提供静态文件服务
app.use(express.static('public'));

app.get("/api/build", (req, res) => {
    //执行 ./build.js
    console.log('开始打包')
    ServerState.setState(1);
    exec('node ./build/build.js', (error, stdout, stderr) => {
        ServerState.setState(0);
        if (error) {
            console.error(`执行错误: ${error.message}`);
            res.send({ message: '执行错误' });
            return;
        }
        if (stderr) {
            console.error(`错误输出: ${stderr}`);
            res.send({ message: '错误输出' });
            return;
        }
        console.log(`标准输出: ${stdout}`);
        res.send({ message: '打包完成' });
    });
})

//获取服务器当前状态
app.get("/api/state", (req, res) => {    
    res.send({ message: ServerState.getState() });
})

// 启动服务器
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});