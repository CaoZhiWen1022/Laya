import IPlatform from './IPlatform';

const qg = window["qg"];

export enum AD {
    "Cp-ID" = "0954850a3705e549a217",
    "App-ID" = "100012335",
    "App-key" = "27de530cdbaebaf2f5516b727e019cd9",
    "MediaID" = "67063027e98a44b787ed7b717c748acc",
    _3_激励视频 = "87062041b81e40c8a54631289b621cea",
    _4_原生1 = "5931f4073c75403a97603faa1248baec",
    _5_原生2 = "98f2c7b5fe2b49429ef3319829737454",
    _6_开屏 = "5f3af220716848f4b38d2ee7345761e2",
    _7_banner = "9cd2d01d78ae4e2d8b8a5039bbf12446",
    _8_插屏 = "792d86e07780483f927d498469bc97ea",

}

interface INativeAdArg { adId: string }

export interface INativeAdRes {
    adList: INativeAdInfo[];
    code?: number
    msg?: string
}

export interface INativeAdInfo {
    /** 广告标识，用来上报曝光与点击 */
    adId: string
    /** 广告标题 */
    title: string
    /** 广告描述 */
    desc: string
    /** 推广应用的 Icon 图标 */
    icon: string
    /** 广告图片 */
    imgUrlList: string[]
    /** “广告”标签图片 */
    logoUrl: string
    /** 点击按钮文本描述 */
    clickBtnTxt: string
    /**
     获取广告类型，取值说明：
     - 0：混合
    */
    creativeType: number
    /**
     获取广告点击之后的交互类型，取值说明：
     - 1：网址类
     - 2：应用下载类
     - 8：快应用生态应用
    */
    interactionType: number
}

export interface INativeAd {
    load(): Promise<INativeAdRes>
    reportAdShow(object: INativeAdArg)
    reportAdClick(object: INativeAdArg)
    onLoad(callback: Function)
    offLoad(callback?: Function)
    onError?(callback: Function)
    offError?(callback?: Function)
    destroy?()
}

interface VivoBannerAd {
    hide(): void
    show(): Promise<any>
    destroy()
    onLoad(callback: Function)
    offLoad(callback?: Function)
    onClose(callback: Function)
    offClose(callback?: Function)
    onError(callback: Function)
    offError(callback?: Function)
    onSize(callback: Function)
    offSize(callback?: Function)
}

// laya 2.8, 1063+
// vivo 1081+
export default class VivoPlatform implements IPlatform {
    private info: object = null;
    constructor() {
        if (qg) {
            this.info = qg.getSystemInfoSync();
            // qg.login({
            //     success: (res) => {
            //         console.log("成功登陆：", res);
            //         let url = `https://game.test.shiyculture.com/vivo/userInfo?pkgName=com.wsdcw.hx.vivominigame&token=${res.data.token}&appId=100005713`
            //         HttpUtil.requestAsync(url, {}, "GET").then((res) => {
            //             console.log('获取用户id成功：', res.data.openId)
            //             GameData.Ins.openId = res.data.openId;
            //             // this.onHide(() => {
            //             //     GameData.Ins.saveDataToRemote().then((res) => {
            //             //         console.log('存储远程数据：', res);
            //             //     })
            //             // });
            //             Tracker.Ins.enterGame();
            //         }).catch((err) => {
            //             console.log('获取用户id失败：', err)
            //         })
            //     },
            //     fail: (err) => {
            //         console.warn("失败登陆：", err);
            //     },
            //     complete: (res) => {
            //         console.log("完成登陆：", res);
            //     }
            // })
            console.warn('vivoPlatform', this.info);
        }
    }

    createNativeAd(type: AD): INativeAd {
        if (qg) {
            let ad = qg.createNativeAd({ posId: type }) as INativeAd;
            // ad.offError(null);
            // ad.onError(() => ad.destroy());
            return ad;
        }
        return null;
    }

    private nativeAd: { [key: string]: any } = {};
    private nativeAdIdx: number = 1;
    private nativeAdId: { [key: string]: string } = {};
    private nativeAdData: { [key: string]: any } = {};
    private nativeAdIsClick: { [key: string]: boolean } = {};

    showNativeAd(type?: any): Promise<any> {
        console.log("########## 初始化原生广告 ##########");
        if (!qg)
            return Promise.reject();
        let sys = qg.getSystemInfoSync() as any,
            nativeAdId: string;
        // switch (type) {
        //     case NativeAdType.icon:
        //         nativeAdId = AdMgr.Ins.nativeId[0];
        //         break;
        //     case NativeAdType.banner:
        //     case NativeAdType.insert:
        //     default:
        //         this.nativeAdIdx++;
        //         this.nativeAdIdx >= AdMgr.Ins.nativeId.length && (this.nativeAdIdx = 1);
        //         nativeAdId = AdMgr.Ins.nativeId[this.nativeAdIdx];
        //         break;
        // }
        console.log(`########## 原生广告ID ${type} ${this.nativeAdIdx} ${nativeAdId} ##########`);
        console.log("sys.platformVersion ", sys.platformVersionCode);
        if (this.nativeAd[nativeAdId] && !this.nativeAdIsClick[nativeAdId]) {
            console.log(`########## 原生广告 ########## 存在`);
            return new Promise((resolve, reject) => {
                resolve(this.nativeAdData[nativeAdId])
            })
        } else {
            this.nativeAd[nativeAdId] = qg.createNativeAd({ posId: nativeAdId });
            return new Promise((resolve, reject) => {
                this.nativeAd[nativeAdId].onLoad((res) => {
                    console.log('原生广告加载完成', JSON.stringify(res));
                    if (res && res.adList) {
                        this.nativeAdData[nativeAdId] = res;
                        resolve(this.nativeAdData[nativeAdId])
                    }
                })
                this.nativeAd[nativeAdId].onError((res) => {
                    console.log('原生广告加载错误', JSON.stringify(res));
                    this.nativeAd[nativeAdId] = null;
                    reject(res);
                })
                this.nativeAd[nativeAdId].load()
            })
        }
    }

    reportNativeAdShow(type?: any, res?: Array<any>): void {
        let nativeAdId: string;
        // type === NativeAdType.icon ? nativeAdId = AdMgr.Ins.nativeId[0] : nativeAdId = AdMgr.Ins.nativeId[this.nativeAdIdx];
        // this.nativeAdId[nativeAdId] = res[0].adId
        // console.log(`########## 展示原生广告 ${type} ########## \n`, this.nativeAdId[nativeAdId]);
        // this.nativeAd[nativeAdId] && this.nativeAd[nativeAdId].reportAdShow({
        //     adId: this.nativeAdId[nativeAdId]
        // })
    }

    reportNativeAdClick(type?: any): void {
        let nativeAdId: string;
        // type === NativeAdType.icon ? nativeAdId = AdMgr.Ins.nativeId[0] : nativeAdId = AdMgr.Ins.nativeId[this.nativeAdIdx];
        // console.log(`########## 点击原生广告 ${type} ########## \n`, this.nativeAdId[nativeAdId]);
        // this.nativeAd[nativeAdId] && (this.nativeAd[nativeAdId].reportAdClick({
        //     adId: this.nativeAdId[nativeAdId]
        // }), this.nativeAdIsClick[nativeAdId] = true)
    }

    getSystemInfoSync(): object {
        return this.info
    }
    taskAd(leaveTime: number, okCb: Function, failCb: Function) {
        throw new Error("Method not implemented.");
    }
    taskReturn() {
        throw new Error("Method not implemented.");
    }

    onShow(cb) {
        qg.onShow(cb);
    }

    onHide(cb) {
        qg.onHide(cb);
    }

    offShow(cb) {
        qg.offShow(cb);
    }

    offHide(cb) {
        qg.offHide(cb);
    }

    getUserSignature(): Promise<string> {
        return new Promise((resolve, reject) => {
            reject('vivo no signature')
        })
    }

    getOpenId(): Promise<string> {
        return new Promise((resolve, reject) => {
            reject('vivo no open id')
        })
    }

    private getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => reject('vivo no user info'));
    }

    share(title: string, imgUrl: string, query: string): Promise<any> {
        return new Promise((resolve, reject) => reject('vivo no share'));
    }

    private _installShortcutTime = 0;
    /**
     * 是否经过了 120 秒
     * @param reset false 仅查看，true 更新时间戳 —— 为 true 时，即可紧跟着调用 `installShortcut`
     */
    private _120sPassed(reset = false) {
        let now = (new Date).getTime();
        if (now - this._installShortcutTime > 120000) {
            reset && (this._installShortcutTime = now);
            return true;
        } else {
            return false;
        }
    }

    hasShortcutInstalled(): Promise<boolean> {
        if (this._120sPassed())
            return new Promise((resolve, reject) => { qg.hasShortcutInstalled({ success: resolve, fail: reject }) });
        else
            return Promise.reject();
    }

    installShortcut() {
        if (this._120sPassed(true)) {
            return new Promise((resolve, reject) => {
                qg.installShortcut({
                    // message,         // String	否	权限弹窗上的说明文字，用于向用户解释为什么要创建桌面图标
                    success: resolve,   // Function	否	创建成功
                    fail: reject,       // Function	否	创建失败
                    complete: reject,   // Function	否	取消创建
                })
            });
        } else {
            return Promise.reject('120s');
        }
    }

    /** 无UI，120s */
    installShortcut1() {
        if (this._120sPassed(true)) {
            qg.hasShortcutInstalled({ success: function (res) { res || qg.installShortcut({}) } })
        }
    }

    private bannerAd: VivoBannerAd = null;
    private showBanner = false;
    private _showBannerAdTime = 0;
    /**
     * - 1、如果先调用createBannerAd()后 不能立马调用hide()方法，要等Ad创建成功后，在某个需要的场景下调hide()
     * - 2、如果有场景需要再次展示广告，如果广告被关闭了或者调了close()，必须重新创建才能展示出来，此时show()无效
     * - 3、广告调试时，会有可能因为填充率不足而展示不出来，具体请查看教程中的错误码信息
     * - 4、Banner广告创建间隔不得少于10s
     * @param reCreate 
     */
    showBannerAd(reCreate = false) {
        // 创建
        if (reCreate || !this.bannerAd) {
            let now = (new Date).getTime();
            if (now - this._showBannerAdTime <= 10000) {
                return;
            }
            this._showBannerAdTime = now;

            this.bannerAd && this.bannerAd.destroy();
            this.bannerAd = qg.createBannerAd({
                posId: AD._7_banner,
                // 没有style字段，banner会在上边显示
                // style内无需设置任何字段，banner会在屏幕底部居中显示，
                // 1053以及以上版本支持属性设置
                style: {}, // 底部居中
                adIntervals: 30,
            });

            const sys = qg.getSystemInfoSync();
            let bH = sys.screenWidth * 200 / 720; // 实际的banner高度
            let dy = sys.screenHeight / sys.screenWidth > 1.9 ? 80 : 0; // 全面屏时大概要减去的高度
            dy = sys.screenWidth * dy / 720;

            this.bannerAd.onSize((res) => { this.showBanner = true; console.log('onResize, showbanner true') })
            this.bannerAd.onError((err) => { console.warn("普通banner错误: ", err); })
            this.bannerAd.onLoad((res) => { console.log("普通banner load: ", res); })

            this.bannerAd.onError(() => { this.bannerAd && this.bannerAd.destroy(), this.bannerAd = null })
            this.bannerAd.onClose(() => { this.bannerAd && this.bannerAd.destroy(), this.bannerAd = null })
        }

        // 展示
        if (this.bannerAd) {
            this.bannerAd.show().then(() => this.showBanner = true);
            console.log("展示普通banner: ", this.bannerAd);
        }
        return Promise.resolve();
    }

    hideBannerAd() {
        // if (this.showBanner) {
        this.showBanner = false;
        this.bannerAd && this.bannerAd.hide();
        // }
    }

    private _showInsertAdTime = 0;
    showInsertAd(): Promise<void> {
        let now = (new Date).getTime();
        // 插屏广告创建间隔不得少于10s
        if (now - this._showInsertAdTime > 10000) {
            this._showInsertAdTime = now;
            // 没有 destroy 接口，每次都创建即可
            let interstitialAd = qg.createInterstitialAd({ posId: AD._8_插屏 })
            return interstitialAd.show();
        }
    }

    // 定义插屏广告
    /**
     * vivo 插屏广告实例无法复用，所以每次都需要重新create
     */
    private interstitialAd = null
    private interstitialAdShowTime: number = 0;
    private showInsertAd2(cb = null) {
        let sys = qg.getSystemInfoSync();
        if (sys.platformVersionCode < 1031) {
            return
        }
        if (Math.floor(new Date().getTime() / 1000) - this.interstitialAdShowTime < 10) {
            cb && cb();
            console.log('距离上次展示插屏不满10秒')
            return
        }
        // 创建插屏广告实例，提前初始化
        this.interstitialAd = qg.createInterstitialAd({
            posId: ""
        })
        if (this.interstitialAd) {
            this.interstitialAdShowTime = Math.floor(new Date().getTime() / 1000)
            this.interstitialAd.offClose();
            cb && this.interstitialAd.onClose(cb);
            // 取消监听
            this.interstitialAd.offError();
            // 开始监听
            this.interstitialAd.onError(err => console.warn(err));
            let adShow = this.interstitialAd.show();
            adShow && adShow.then(() => {
                console.log("插屏广告展示成功");
                this.hideBannerAd();
            }).catch((err) => {
                switch (err.code) {
                    case 30003:
                        console.log("新用户1天内不能曝光Banner，请将手机时间调整为1天后，退出游戏重新进入")
                        break;
                    case 30009:
                        console.log("10秒内调用广告次数超过1次，10秒后再调用")
                        // setTimeout(() => {
                        //     show()
                        // }, 10000);
                        break;
                    case 30002:
                        console.log("load广告失败，重新加载广告")
                        // setTimeout(() => {
                        //     retryShow()
                        // }, 10000);  
                        break;
                    default:
                        // 参考 https://minigame.vivo.com.cn/documents/#/lesson/open-ability/ad?id=广告错误码信息 对错误码做分类处理
                        console.log("插屏广告展示失败")
                        console.log(JSON.stringify(err))

                        break;
                }
                cb && cb();
            })
        } else {
            console.log("插屏广告展示失败");
            cb && cb();
        }
    }

    /** 
     * vivo视频对象是单例
     * 第一次创建时自动load，不确定返回什么
     */
    private video1 = null;

    private lastReqTime: number = 0;

    loadVideoAd(adId = ""): Promise<any> {
        let sys = qg.getSystemInfoSync();
        if (sys.platformVersionCode < 1041) {
            return Promise.reject('version need update')
        }
        if (!this.video1) {
            // 新 id 重新拉
            this.video1 = qg.createRewardedVideoAd({
                posId: AD._3_激励视频
            });
            this.lastReqTime = Math.floor(new Date().getTime() / 1000);
            this.video1 && this.video1.offError();
            this.video1.onError((err) => {
                switch (err.errCode) {
                    case -3:
                        console.log("激励广告加载失败---调用太频繁", JSON.stringify(err));
                        break;
                    case -4:
                        console.log("激励广告加载失败--- 一分钟内不能重复加载", JSON.stringify(err));
                        break;
                    case 30008:
                        console.log("激励广告加载失败--- 当前启动来源不支持激励视频广告，请选择其他激励策略", JSON.stringify(err));
                        break;
                    default:
                        console.log("激励广告展示失败");
                        console.log(JSON.stringify(err));
                        break;
                }
            });
            // 加载成功或失败均有video对象
            return Promise.resolve();
        } else {
            return this.video1.load()
        }
    }

    private lastOnClose = null;

    playVideoAd(): Promise<any> {
        if (this.video1) {
            this.video1.offClose();
            return new Promise((resolve, reject) => {
                let adLoad = this.video1.load();//第一次调用 可能会报-3  广告能正常展示就可以忽略
                // 捕捉load失败的错误
                adLoad && adLoad.catch(err => {
                    console.log("激励广告load失败" + JSON.stringify(err))
                })
                this.lastOnClose = (res) => {
                    (res && res.isEnded) ? resolve(null) : reject();
                }
                this.video1.onClose(this.lastOnClose);
                this.video1.onLoad(() => {
                    let adshow = this.video1.show();
                    // 捕捉show失败的错误
                    adshow && adshow.catch(err => {
                        console.log("激励广告展示失败" + JSON.stringify(err))
                    })
                })
            })
        } else {
            return Promise.reject('no loaded video');
        }
    }

    // 所有广告，都应该用最简单的方式去接入，让调用者负责节流、显示
    playVideo(callback, errCallback, cancelCB = null) {
        if (Math.floor(new Date().getTime() / 1000) - this.lastReqTime < 60) {
            console.log('video show interval less than 60s');
            qg.showToast({
                title: '暂无可用视频',
                icon: 'none',
                duration: 2000
            });
            errCallback && errCallback();
            return
        }
        this.loadVideoAd().then(() => {
            this.lastReqTime = Math.floor(new Date().getTime() / 1000);
            // AudioMgr.Ins.StopMusic();
            this.playVideoAd().then(() => {
                // AudioMgr.Ins.PlayMusic();
                callback && callback();
            }, () => {
                // AudioMgr.Ins.PlayMusic();
                cancelCB && cancelCB();
            }).catch(() => {
                // AudioMgr.Ins.PlayMusic();
                qg.showToast({
                    title: '暂无可用视频',
                    icon: 'none',
                    duration: 2000
                });
                console.log('show video error');
            })
        }).catch(() => {
            qg.showToast({
                title: '暂无可用视频',
                icon: 'none',
                duration: 2000
            });
            errCallback && errCallback();
        });
    }

    getStorageData(key) {
        return qg.getStorageSync(key)
    }

    saveStorageData(key, data) {
        qg.setStorage({
            key: key,
            data: data
        })
    }

    setUserCloudStorage(array: { key: string, value: string }[]) {
        return Promise.reject('vivo has no cloud storage')
    }

    vibrateLong() {
        qg & qg.vibrateLong();
    }

    vibrateShort() {
        qg & qg.vibrateShort();
    }

    updateCloudStorage(level) {

    }

    showNativeBanner() {
        return Promise.reject('原生重写')
    }

    showNativeInsert() {
        return Promise.reject('原生重写')
    }

    navigateToMiniGame(obj) {
        return
    }
    updateRankData(data): Promise<any> {
        return Promise.reject('');
    }
    getUserData(): Promise<any> {
        return Promise.reject('');
    }
    getRankData(): Promise<any> {
        return Promise.reject('');
    }
    getChallengeData(): Promise<any> {
        return Promise.reject('');
    }
    getRecentUserData(star: number): Promise<any> {
        return Promise.reject('');
    }
}
