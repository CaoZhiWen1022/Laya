import IPlatform from './IPlatform';

const tt = window["tt"];

const SHARE_DURATION = 100;

const APP_ID = "ttb536c38b2a0dbb3e";

enum AD {
    _1_banner = "4jge50pm21f5250djl", // banner
    _2_激励视频 = "43a79918ldh9h762k8", // 激励式视频
    _3_插屏广告 = "c86bd27a105j1f80q1", // 插屏广告
}

/**
 * ~开发者如果想要展示另一条广告，需要创建一个新的 bannerAd 实例。~
 * 
 * Tip: 竖屏情况下，Banner 广告 接受的最小宽度是 300
 */
interface IBannerAd {
    /** Function	展现广告 */
    show(): Promise<any>
    /** Function	隐藏广告 */
    hide(): void
    /** Function	绑定 load 事件的监听器 */
    onLoad(cb: Function): void
    /** Function	解除绑定 load 事件的监听器 */
    offLoad(cb: Function): void
    /** Function	绑定 error 事件的监听器 */
    onError(cb: (res) => void): void
    /** Function	解除绑定 error 事件的监听器 */
    offError(cb: Function): void
    /** Function	绑定 resize 事件的监听器 */
    onResize(cb: (res) => void): void
    /** Function	解除绑定 resize 事件的监听器 */
    offResize(cb: Function): void
    /** Function	销毁广告实例 */
    destroy()

    style
}

/**
 * load then show
 */
interface IRewardedVideoAd {
    show(): Promise<any>
    load(): Promise<any>
    /** 1.92 */
    destroy(): Promise<any>

    onLoad(cb: () => void): void
    offLoad(cb: () => void): void

    onError(cb: (res) => void): void
    offError(cb: () => void): void

    onClose(cb: (res) => void): void
    offClose(cb: () => void): void
}

interface ILoginResult {
    // "login:ok"	1.0.0
    errMsg: string
    // 临时登录凭证, 有效期 3 分钟。开发者可以通过在服务器端调用 登录凭证校验接口 换取 openid 和 session_key 等信息。	1.0.0
    code: string
    // 用于标识当前设备, 无论登录与否都会返回, 有效期 3 分钟。	1.0.0
    anonymousCode: string
    // 判断在当前 APP（头条、抖音等）是否处于登录状态。
    isLogin: boolean
}

export default class TTPlatform implements IPlatform {

    private platform: string;

    private isIos() {
        return this.platform === 'ios';
    }

    private isAndroid() {
        return this.platform === 'android';
    }

    getSystemInfoSync() {
        return tt.getSystemInfoSync()
    }
    /** 分享，离开时间 */
    private shareLeaveAt = 0;

    /** 分享离开 */
    private shareLeave() {
        this.shareLeaveAt = new Date().getTime()
    }

    private _shareOk = null;
    private _shareCancel = null;
    // 记录任务时间及开关
    private _isTask = false;
    private _taskTime = 0;
    private _taskOk = null;
    private _taskFail = null;
    /** 分享回来了 */
    private shareReturn() {
        if (this.shareLeaveAt) {
            let now = new Date().getTime();
            if (now - this.shareLeaveAt > SHARE_DURATION) {
                this._shareOk && this._shareOk();
            } else {
                this._shareCancel && this._shareCancel();
            }
        }
        this._shareOk = this._shareCancel = null;
        this.shareLeaveAt = 0;
    }

    constructor() {
        if (tt) {
            let info = tt.getSystemInfoSync();
            this.platform = info.platform;
            console.warn('TTPlatform', info);
        }

        // 安卓的 2.5 秒假分享需要通过 onShow、onHide
        // if (this.isAndroid()) {
        this.onHide(() => { this.shareLeave() });
        this.onShow(() => {
            this.shareReturn();
        });
        // }

        tt && tt.showShareMenu({ withShareTicket: true });
        let idx = Math.floor(Math.random() * this.shareTitles.length);
        let idx2 = Math.floor(Math.random() * this.shareImgs.length);
        // res.channel 
        // - article	在头条内用户点击「发头条 - 发图文」时
        // - video	在头条内用户点击「发头条 - 发视频」时
        // - undefined	其它场景均为 undefined
        tt.onShareAppMessage((res) => {
            return {
                // 直接用后台默认设置的
                // title: this.shareTitles[idx],
                // imageUrl: this.shareImgs[idx2],
                // query: '',
                success: () => {
                    //console.log('分享成功')
                },
                fail: (e) => {
                    //console.log('分享失败', e)
                }
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
        tt.onShow(cb);
    }

    onHide(cb) {
        tt.onHide(cb);
    }

    offShow(cb) {
        tt.offShow(cb);
    }

    offHide(cb) {
        tt.offHide(cb);
    }

    getUserSignature(): Promise<string> {
        return new Promise((resolve, reject) => {

        })
    }

    login(): Promise<ILoginResult> {
        return new Promise((resolve, reject) => {
            tt.login({ force: false, success: resolve, fail: reject, })
        })
    }

    private _getOpenIdPromise: Promise<any>;
    private openid;
    getOpenId() {
        // https://openapi.jiegames.com/SDKBase/getQQOpenId
        // https://openapi.jiegames.com/SDKBase/getTTOpenId
        return this._getOpenIdPromise;

        if (!this._getOpenIdPromise) {
            this._getOpenIdPromise = this.login().then((res) => {
                console.log('haha', res);
                let data = { appId: APP_ID, code: res.code, anonymous_code: res.anonymousCode }
                return this.request("https://openapi.jiegames.com/SDKBase/getTTOpenId", data, "POST");
            }).then(console.log, console.warn);
        }
        return this._getOpenIdPromise;
    }



    request(url: string, _data, _method): Promise<any> {
        return new Promise((resolve, reject) => {
            tt.request({
                url: url,
                data: _data,
                method: _method,
                success: resolve,
                fail: reject,
            })
        });
    }

    private getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => tt.getUserInfo({ success: resolve, fail: reject }));
    }

    private shareTitles = ["手指也能开飞车，是时候展示真正的技术了"];
    private shareImgs = ["https://jy-wxgame.oss-cn-hangzhou.aliyuncs.com/chasingCar/share_0.jpg"];
    share(title: string, imgUrl: string, query: string): Promise<any> {
        return Promise.all([
            this.getUserSignature(),
            this.getOpenId(),
            this.getUserInfo().then((res) => res.userInfo.nickName),
            this.getUserInfo().then((res) => res.userInfo.avatarUrl),
        ]).catch(e => [])
            .then((args) => {
                return new Promise((resolve, reject) => {
                    // 赋值给成员，也算异步
                    this._shareOk = resolve;
                    this._shareCancel = reject;

                    let _q = {};
                    try {
                        // (<any>Object).assign(_q, querystring.decode(query));
                    } catch (e) {
                        console.warn(e);
                        _q = {};
                    }
                    (<any>Object).assign(_q, {
                        timestamp: new Date().getTime(),
                        signature: args[0],
                        openId: args[1],
                        nickName: args[2],
                        avatarUrl: args[3],
                    });

                    // let info = { query: querystring.stringify(_q) };
                    let info = { query: "" };
                    let idx = Math.floor(Math.random() * this.shareTitles.length);
                    let idx2 = Math.floor(Math.random() * this.shareImgs.length);
                    info['title'] = this.shareTitles[idx];
                    info['imageUrl'] = this.shareImgs[idx2];
                    tt.shareAppMessage(info);
                });
            })
    }

    private bannerAd: IBannerAd = null;

    private showBanner = false;
    showBannerAd(recreate = true) {
        this.showBanner = true;
        if (tt) {
            let sys = tt.getSystemInfoSync();
            if (recreate || !this.bannerAd) {
                this.bannerAd && this.bannerAd.destroy();
                this.bannerAd = tt.createBannerAd({
                    adUnitId: AD._1_banner,
                    style: { left: sys.screenWidth, top: sys.screenHeight, width: 0 }, // 宽度设0，不然onResize不会调用
                    // adIntervals: 30,
                });
            }
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
            // this.bannerAd.style.width = 300;
            this.bannerAd.onError((e) => {
                console.warn(e); this.bannerAd.destroy(); this.bannerAd = null;
            });
            this.bannerAd.onLoad(() => this.showBanner && this.bannerAd.show().then(() => {
                this.bannerAd.style.width = 299; // 最小300，设299触发一下
            }, (e) => {
                console.warn(e); this.bannerAd.destroy(); this.bannerAd = null;
            }));
        }
    }

    hideBannerAd() {
        this.showBanner = false;
        this.bannerAd && this.bannerAd.hide();
    }
    // 定义插屏广告 头条无插屏

    private _showInsertAdTime = 0;
    showInsertAd() {
        let now = (new Date).getTime();
        // Tip：出现 2002 错误码意味着至少需要等待 30 秒后再重新请求，建议开发者在代码中自行处理。
        if (now - this._showInsertAdTime > 30000) {
            this._showInsertAdTime = now;
            let insert = tt.createInterstitialAd({ adUnitId: AD._3_插屏广告 });
            insert && insert.load().then(() => { insert.show(); });
        }
    }

    /** 微信视频对象是单例 */
    private video1: IRewardedVideoAd = null;

    loadVideoAd(adId = AD._2_激励视频): Promise<any> {
        if (adId) {
            // 新 id 重新拉
            this.video1 && this.video1.offError(console.warn);
            this.video1 = tt.createRewardedVideoAd({ adUnitId: adId });
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

    playVideoAd(): Promise<any> {
        if (this.video1) {
            // 单例处理
            (this.video1) && this.lastOnClose && this.video1.offClose(this.lastOnClose);
            return new Promise((resolve, reject) => {
                this.lastOnClose = (res) => {
                    (res && res.isEnded) ? resolve(null) : reject();
                }
                this.video1.onClose(this.lastOnClose);

                this.video1.show()
            })
        } else {
            return Promise.reject('no loaded video');
        }
    }

    playVideo(callback, errCallback, cancelCB) {
        this.loadVideoAd().then(() => {
            this.playVideoAd().then(() => {
                callback && callback();
            }, () => {
                cancelCB && cancelCB();
            })
        }, () => {
            errCallback && errCallback();
        });
    }

    playVideo1(cb, errCb, cancelCb) {
        let video: IRewardedVideoAd = tt.createRewardedVideoAd({ adUnitId: AD._2_激励视频 });
        video.onClose(res => {
            if (res && res.isEnded) {
                cb && cb();
            } else {
                cancelCb && cancelCb();
            }
            video && video.destroy();
        });
        video.onError((res) => {
            console.warn(res);
            errCb && errCb();
            video && video.destroy();
        });
        video.load().then(() => video.show());
    }

    getStorageData(key) {
        return tt.getStorageSync(key)
    }

    saveStorageData(key, data) {
        tt.setStorage({
            key: key,
            data: data
        })
    }

    vibrateLong() {
        tt & tt.vibrateLong();
    }

    vibrateShort() {
        tt & tt.vibrateShort();
    }

    updateCloudStorage(level) {
        tt.setUserGroup({
            groupId: 'normal_group'
        })
        let data = {
            "ttgame": {
                "level": level,
                "update_time": Math.floor(new Date().getTime() / 1000)
            },
            "mode": 0
        };

        tt.setUserCloudStorage({
            KVDataList: [
                // key 需要在开发者后台配置，且配置为排行榜标识后，data 结构必须符合要求，否则会 set 失败
                { key: 'level', value: JSON.stringify(data) }
            ]
        });
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
}
