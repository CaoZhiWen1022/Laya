
const url_opo = "https://czy7n.jiegames.com/jy-game/UltraDontFall/OppoGameConfig.json";
const url_viv = "https://czy7n.jiegames.com/jy-game/UltraDontFall/VivoGameConfig.json";

export interface MiniVer {
    wx_mini: string,
    tt_mini: string,
    qq_mini: string,
    oppo_mini: string,
    vivo_mini: string,
    swan_mini: string,
    xm_mini: string,
    ali_mini: string,
    tb_mini: string,
    bili_mini: string,
    hw_mini: string,
}

class Data2 {
    _enabled = false;

    /**
     * 开关1（adAutoClickNum)：原生广告概率不上报展示
     * - 0 时表示所有原生广告均不上报
     * - 0.5 时表示所有原生广告50%概率不上报
     * - 1 时表示所有原生广告均上报
     */
    adAutoClickNum: number

    /**
     * 开关2（btnDealy)：部分按钮或文字的延误时间（毫秒）
     * - 0 时下面描述的按钮文字显示不会有延迟
     * - 2000 时表示下面描述的按钮文字延迟2秒出现
     */
    btnDealy: number

    /**
     * 开关3（isOpenBtn)：广告按钮展示开关
     * - true 时表示调取到原生广告时展示下面按钮
     * - false 时表示调取到原生广告时不显示下面按钮
     */
    isOpenBtn: boolean

    /**
     * 开关3-1
     * - true 时表示调取到原生广告时展示下面按钮
     * - false 时表示调取到原生广告时不显示下面按钮
     */
    isOpenBtnGYZX: boolean

    /**
     * 开关3-2
     * - true 时表示调取到原生广告时展示下面按钮
     * - false 时表示调取到原生广告时不显示下面按钮
     */
    isOpenBtnTXJD: boolean

    /**
     * 开关4（close)：原生广告关闭按钮触点大小
     * - 0时表示点击原生广告右上角X，该按钮触点为0，*点击展示广告*
     * - 1时表示点击原生广告右上角X，该按钮触点为100，*点击关闭广告*
     */
    close: number

    /**
     * 开关5（isOpenTV)：战斗胜利页面-奥特曼TV小剧场展示开关
     * - true 时表示该页面内显示TV小剧场框
     * - false 时表示该页面不显示TV小剧场框
     */
    isOpenTV: boolean
}

export default class Baiying {
    static get Ins(): Baiying { return this['ins'] || (this['ins'] = new this()) }

    data = new Data2

    private request(url: string, _data = null, _method = "get"): Promise<any> {
        return new Promise((resolve, reject) => {
            let xhr = new Laya.HttpRequest();
            xhr.http.timeout = 10000; //设置超时时间；
            xhr.once(Laya.Event.COMPLETE, null, resolve);
            xhr.once(Laya.Event.ERROR, null, reject);
            // xhr.on(Laya.Event.PROGRESS, this, this.processHandler);
            xhr.send(url, _data, _method, "json", ["Cache-Control", "no-cache"]);
        });
    }

    load() {
        this.loadVersion();
    }

    private loadVersion() {
        Laya.loader.load("json/mini_ver.json", Laya.Handler.create(null, (json: MiniVer) => {
            let version = "unknown";
            /**/ if (Laya.Browser.onMiniGame) { version = json.wx_mini } /* 微信小游戏 */
            // else if (Laya.Browser.onBDMiniGame) { version = json.swan_mini } /* 百度小游戏 */
            // else if (Laya.Browser.onKGMiniGame) { version = json.xm_mini } /* 小米戏小游戏 */
            else if (Laya.Browser.onQGMiniGame) { version = json.oppo_mini } /* OPPO小游戏 */
            else if (Laya.Browser.onVVMiniGame) { version = json.vivo_mini } /* VIVO小游戏 */
            // else if (Laya.Browser.onAlipayMiniGame) { version = json.ali_mini } /* 阿里小游戏 */
            // else if (Laya.Browser.onQQMiniGame) { version = json.qq_mini } /* 手机QQ小游戏 */
            // else if (Laya.Browser.onBLMiniGame) { version = json.bili_mini } /* BILIBILI小游戏 */
            // else if (Laya.Browser.onTTMiniGame) { version = json.tt_mini } /* 字节跳动小游戏 */
            // else if (Laya.Browser.onHWMiniGame) { version = json.hw_mini } /* 华为快游戏 */
            // else if (Laya.Browser.onTBMiniGame) { version = json.tb_mini } /* 淘宝小游戏 */
            this.loadJson(version);
        }))
    }

    private loadJson(version: string) {
        console.log(version);
        if (Laya.Browser.onQGMiniGame) var url1 = url_opo;
        if (Laya.Browser.onVVMiniGame) var url1 = url_viv;

        url1 && this.request(url1).then((res: Data2) => {
            // Object.assign(this.data, res)
            const enabled = !!res[version];
            this.data._enabled = enabled;

            this.data.adAutoClickNum = enabled ? res.adAutoClickNum : 1;
            this.data.btnDealy = enabled ? res.btnDealy : 0;
            this.data.isOpenBtn = enabled ? res.isOpenBtn : false;
            this.data.isOpenBtnGYZX = enabled ? res.isOpenBtnGYZX : false;
            this.data.isOpenBtnTXJD = enabled ? res.isOpenBtnTXJD : false;
            this.data.close = enabled ? res.close : 1;
            this.data.isOpenTV = enabled ? res.isOpenTV : false;

            console.log('asdf', JSON.stringify(res), JSON.stringify(this.data), enabled);

        }, console.warn);
    }

}