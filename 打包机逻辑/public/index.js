//未初始化
serverState = -1;
async function buildBtnClick() {
    if (serverState == -1) {
        showStateText("未初始化");
        return;
    }
    if (serverState == 1) {
        showLogText("正在打包");
        return;
    }

    let data = await fetch('/api/build')
    if (data.status != 200) {
        showStateText("服务器异常");
        return;
    }
    console.log(data);
    
    let json = await data.json();
    showLogText(json.message);
}

function showStateText(str) {
    document.getElementById('state').innerText = str;
}

function showLogText(str) {
    document.getElementById('log').innerText = str;
}

async function loop() {
    let data = await fetch('/api/state')
    if (data.status != 200) {
        showStateText("服务器异常");
        return;
    }
    let json = await data.json();
    serverState = json.message;
    if (serverState == 0) {
        showStateText("空闲");
    } else if (serverState == 1) {
        showStateText("打包中");
    }
}

setInterval(loop, 1000)