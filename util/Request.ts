export default class Request {
    private _http;
    private _server = "https://test.codeplanet.cc";//

    static _instance = null
    //把自己设置为单例模式，不销毁则一直存在
    static getInstance(): Request {
        if (!Request._instance) {
            Request._instance = new Request;
        }
        return Request._instance;
    }
    set server(str: string) {
        this._server = str;
    }
    /**
     * 
     * @param url {string} url地址
     * @param data {object} 参数
     * 
     */


    post(params) {
        this._http = new Laya.HttpRequest();
        let requst = new Promise((resolve, reject) => {
            this._http.once(Laya.Event.COMPLETE, this, e => { resolve(this.onCompleteHanlder(e)) })
        })
        let data = this.parseParam(params.data) || {};
        let url = this.getServerFullUrl(params.url)
        this._http.send(url, data, 'post', 'text');
        return requst;
    }


    get(params) {
        this._http = new Laya.HttpRequest();
        let requst = new Promise((resolve, reject) => {
            this._http.once(Laya.Event.COMPLETE, this, e => { resolve(this.onCompleteHanlder(e)) })
        })
        let data = this.parseParam(params.data) || {};
        this._http.send(params.url, data, 'get', 'text');
        return requst;
    }


    private onCompleteHanlder(e: any) {
        return JSON.parse(e);
    }


    private parseParam(data) {
        var body = '';
        for (var i in data) {
            body += i + "=" + data[i] + "&"
        }
        return body.slice(0, -1);
    }


    private getServerRootUrl() {
        return this._server ? this._server : window.location.origin;
    }


    private getServerFullUrl(partUrl) {
        let root = this.getServerRootUrl();
        if (root) {
            console.log('getServerFullUrl ' + root + partUrl);
            return root + partUrl;
        }
        return partUrl;
    }


}