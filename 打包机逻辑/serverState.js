class ServerState {
    stateList = [0, 1]
    // 服务器状态 0:空闲 1:正在打包
    state;

    getState() {
        return this.state
    }
    setState(state) {
        if (this.stateList.includes(state)) {
            this.state = state
        } else {
            console.log("非法状态：" + state);
        }
    }
}

module.exports = ServerState