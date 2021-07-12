import IPlatform from './IPlatform';

//老师项目
const ShareDuration = 2500;
const APP_ID = "wx5681aeda16e9f090";
const wx = window["wx"];

export default class WeChatPlatform implements IPlatform {

    private platform: string;

    private isIos() {
        return this.platform === 'ios';
    }

    private isAndroid() {
        return this.platform === 'android';
    }

    /** 分享，离开时间 */
    private shareLeaveAt = 0;

    /** 分享离开 */
    private shareLeave() {
        this.shareLeaveAt = new Date().getTime()
    }

    getSystemInfoSync() {
        return wx.getSystemInfoSync()
    }

    private _shareOk = null;
    private _shareCancel = null;
    // 记录任务时间及开关
    private _isTask = false;
    private _taskTime = 0;
    private _taskOk = null;
    private _taskFail = null;
    /** 分享回来了 播放音乐 */
    private shareReturn() {
        console.log("share return");
        if (this.shareLeaveAt) {
            let now = new Date().getTime();
            if (now - this.shareLeaveAt > ShareDuration) {
                this._shareOk && this._shareOk();
            } else {
                this._shareCancel && this._shareCancel();
            }
        }
        this._shareOk = this._shareCancel = null;
        this.shareLeaveAt = 0;
        // AudioMgr.Ins.PlayMusic();
    }

    constructor() {
        if (window['wx']) {
            let info = wx.getSystemInfoSync();
            this.platform = info.platform;
            console.warn('WeChatPlatform', info);
        }

        // 安卓的 2.5 秒假分享需要通过 onShow、onHide
        this.onHide(() => {

            this.isAndroid() && this.shareLeave();
        });
        this.onShow(() => {

            this.isAndroid() && this.shareReturn();
            this.isAndroid() && this.taskReturn();
        });

        wx && wx.showShareMenu({ withShareTicket: true });
        try {
            this.shareTitles = [''];
            this.shareImgs = [''];
        } catch (e) {

        }
        let idx = Math.floor(Math.random() * this.shareTitles.length);
        let idx2 = Math.floor(Math.random() * this.shareImgs.length);
        let self = this;
        wx.onShareAppMessage(() => {
            return {
                title: self.shareTitles[idx],
                imageUrl: self.shareImgs[idx2]
            }
        })
    }

    showNativeAd(type?: any) {
        throw new Error("Method not implemented.");
    }
    reportNativeAdShow(type?: any, adData?: any) {
        throw new Error("Method not implemented.");
    }
    reportNativeAdClick(type?: any, adData?: any) {
        throw new Error("Method not implemented.");
    }

    onShow(cb) {
        wx.onShow(cb);
    }

    onHide(cb) {
        wx.onHide(cb);
    }

    offShow(cb) {
        wx.offShow(cb);
    }

    offHide(cb) {
        wx.offHide(cb);
    }

    getUserSignature(): Promise<string> {
        return new Promise((resolve, reject) => {
            wx.getUserInfo({ success: (res) => resolve(res.signature), fail: reject })
        })
    }

    login(): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.login({
                success(res) {
                    if (res.code) {
                        //发起网络请求
                        resolve(res.code);
                    } else {
                        console.log('登录失败！' + res.errMsg)
                        reject(res.errMsg);
                    }
                },
                fail: reject
            })
        })
    }

    private _getOpenIdPromise: Promise<string>;
    private openId;

    getOpenId(): Promise<string> {
        return this.login().then((code) => {
            let data = { appId: APP_ID, wxCode: code }
            return this.request('https://distribute.jiegames.com/api/wx/wxLogin', data, "POST");
        }).then((res) => {
            if (res.data) {
                console.log(res.data);
                if (res.data.code == 0) {
                    if (res.data.data) {
                        this.openId = res.data.data.openId;
                        return res.data.data.openId;
                    }
                }
            }
            return null;
        });
    }

    request(url: string, _data, _method): Promise<any> {
        return new Promise((resolve, reject) => {
            wx.request({
                url: url,
                data: _data,
                method: _method,
                success: resolve,
                fail: reject,
            })
        });
    }


    private getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => wx.getUserInfo({ success: resolve, fail: reject }));
    }

    private shareTitles: Array<string> = ["据说这是最好玩的3D打击消除游戏了"];
    private shareImgs: Array<string> = ["https://jy-wxgame.oss-cn-hangzhou.aliyuncs.com/shootZ/share_0.jpg"];
    share(title: string = "", imgUrl: string = "", query: string = "", desc = ''): Promise<any> {
        return new Promise((resolve, reject) => {
            // 赋值给成员，也算异步
            console.log("share in: ");
            this._shareOk = resolve;
            this._shareCancel = reject;

            let _q = {};
            try {
                // (<any>Object).assign(_q, querystring.decode(query));
            } catch (e) {
                console.warn(e);
                _q = {};
            }

            // let info = { query: querystring.stringify(_q) };
            let info = { query: "" };
            let idx = Math.floor(Math.random() * this.shareTitles.length);
            let idx2 = Math.floor(Math.random() * this.shareImgs.length);
            info['title'] = this.shareTitles[idx];
            info['imageUrl'] = this.shareImgs[idx2];
            wx.shareAppMessage(info);

            // ios 离开、返回
            if (this.isIos()) {
                this.shareLeave();
                console.log("share leave");
                setTimeout(() => this.shareReturn(), 350);
            }
        });
    }

    private bannerAd = null;

    private showBanner = false;
    showBannerAd() {
        this.showBanner = true;
        if (Laya.Browser.onWeiXin && !Laya.Browser.onQQMiniGame) {
            let sys = wx.getSystemInfoSync();
            this.bannerAd && this.bannerAd.destroy();
            this.bannerAd = wx.createBannerAd({
                adUnitId: "adunit-192a0628d1ca2a31",
                style: { left: sys.screenWidth, top: sys.screenHeight, width: 0 }, // 宽度设0，不然onResize不会调用
            });
            let bH = sys.screenWidth * 200 / 720; // 实际的banner高度
            let dy = sys.screenHeight / sys.screenWidth > 1.9 ? 80 : 0; // 全面屏时大概要减去的高度
            dy = sys.screenWidth * dy / 720;
            this.bannerAd.onResize((res) => {
                if (res) {
                    let w = Math.ceil(res.width * bH / res.height); // 微信只能设置广告宽度，根据高度重新计算
                    if (w != res.width) {
                        this.bannerAd.style.width = w;
                    }
                    this.bannerAd.style.top = sys.screenHeight - res.height // - dy;
                    this.bannerAd.style.left = (sys.screenWidth - res.width) / 2;
                    //console.log(this.bannerAd.style);
                }
            })
            // banner 宽高比例固定，但是是多少呢？这里主动设置一下，上面的回调就可以拿到了。
            this.bannerAd.style.width = 300;
            this.bannerAd.onError(console.warn);
            this.bannerAd.onLoad(() => this.showBanner && this.bannerAd.show().catch(console.warn));
        }
    }

    hideBannerAd() {
        this.showBanner = false;
        this.bannerAd && this.bannerAd.hide();
    }
    // 定义插屏广告
    private interstitialAd = null
    showInsertAd() {
        // 创建插屏广告实例，提前初始化
        if (wx.createInterstitialAd) {
            this.interstitialAd = wx.createInterstitialAd({
                adUnitId: 'adunit-c8e79150ab174edf'
            })
        }
        // 在适合的场景显示插屏广告
        if (this.interstitialAd) {
            this.interstitialAd.show().catch((err) => {
                console.error(err)
            })
        }
    }

    /** 微信视频对象是单例 */
    private video1 = null;

    loadVideoAd(adId = '',): Promise<any> {
        if (adId) {
            // 新 id 重新拉
            this.video1 && this.video1.offError(console.warn);
            this.video1 = wx.createRewardedVideoAd({ adUnitId: adId });
            this.video1 && this.video1.onError(console.warn);
            //console.log(this.video1);
            return this.video1 ? this.video1.load() : Promise.reject('create ad fail');
        } else {
            this.video1 && this.video1.offError(console.warn);
            this.video1 = null;
            return Promise.reject('empty adId');
        }
    }

    private lastOnClose = null;

    playVideoAd(): Promise<void> {
        if (this.video1) {
            // 单例处理
            (this.video1) && this.video1.offClose(this.lastOnClose);
            return new Promise((resolve, reject) => {
                this.lastOnClose = (res) => {
                    // 小于 2.1.0 的基础库版本，res 是一个 undefined
                    (res && res.isEnded || res === undefined) ? resolve() : reject();
                }
                this.video1.onClose(this.lastOnClose);
                this.video1.show();
            })
        } else {
            return Promise.reject('no loaded video');
        }
    }

    playVideo(callback, errCallback, cancelCb = null) {
        this.loadVideoAd("adunit-d5160554bd7bfd6c").then(() => {
            // loadCallback && loadCallback();
            this.playVideoAd().then(() => {
                callback && callback();
            }, () => {
                cancelCb && cancelCb();
                console.log("cancel video");
            })
        }, () => {
            errCallback && errCallback();
        });
    }

    getStorageData(key) {
        return wx.getStorageSync(key)
    }

    saveStorageData(key, data) {
        wx.setStorage({
            key: key,
            data: data
        })
    }

    vibrateLong() {
        wx & wx.vibrateLong();
    }

    vibrateShort() {
        wx & wx.vibrateShort();
    }

    updateCloudStorage(level) {
        wx.setUserCloudStorage({ KVDataList: [{ key: 'level', value: JSON.stringify(level) }] })
    }

    /**
     * 
     */
    taskAd(leaveTime: number, okCb: Function, failCb: Function) { // 成功跳转时调用，加入wx.onShow回调
        this._taskTime = leaveTime;
        this._isTask = true;
        this._taskOk = okCb;
        this._taskFail = failCb;
        this.onShow(() => {
            this.taskReturn();
        });
    }

    taskReturn() {
        if (this._isTask) {
            let now = Math.floor(new Date().getTime() / 1000);
            if (now - this._taskTime > 60) {
                // 大于10秒，给予奖励，调整按钮
                this._taskOk && this._taskOk();
            } else {
                // 小于10秒，弹出提示
                this._taskFail && this._taskFail();
            }
            this._isTask = false;
            this._taskOk = this._taskFail = null;
        }
    }

    showToast(msg?: string) {
        wx.showToast({
            title: msg || "系统繁忙,请稍后重试!",
            mask: true
        })
    }
}
