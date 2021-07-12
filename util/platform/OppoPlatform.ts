import IPlatform from './IPlatform';

const qg = window["qg"];

export enum AD {
    appId = 30522791,
    _1_横幅 = 100000, // 272224,
    // _2_九宫格 = 272223,
    // _3_视频 = 272222,
    // _4_原生2 = 272218,
    // _5_原生640 = 272217, 
    // _7_banner = 272212,

    // 奥特曼守卫光之国-开屏
    _6_开屏 = 316540,
    // 奥特曼守卫光之国-banner广告
    _7_banner = 316541,
    // 奥特曼守卫光之国-激励视频
    _3_视频 = 316542,
    // 奥特曼守卫光之国-原生512*512
    _8_原生512 = 316543,
    // 奥特曼守卫光之国-原生1280*720
    _4_原生2 = 316545,
    // 奥特曼守卫光之国-原生320*210
    _5_原生320 = 316546,
    // 奥特曼守卫光之国-互推九宫格
    _2_九宫格 = 316547,

}

interface INativeAdArg { adId: string }

export interface INativeAdRes {
    adList: INativeAdInfo[];
    code: number
    msg: string
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
     - 0: 无
     - 1: 纯文字
     - 2: 图片
     - 3: 图文混合
     - 4: 视频
     - 6: 640x320 大小图文混合
     - 7: 320x210 大小图文单图
     - 8: 320x210 大小图文多图
    */
    creativeType: number
    /**
     获取广告点击之后的交互类型，取值说明：
     - 0: 无
     - 1: 浏览类
     - 2: 下载类
     - 3: 浏览器（下载中间页广告）
     - 4: 打开应用首页
     - 5: 打开应用详情页
      */
    interactionType: number
}

export interface INativeAd {
    load(): Promise<INativeAdRes>
    reportAdShow(object: INativeAdArg)
    reportAdClick(object: INativeAdArg)
    onLoad(callback: Function)
    offLoad(callback?: Function)
    onError(callback: Function)
    offError(callback?: Function)
    destroy()
}


interface IGameBannerAd {
    show()
    hide()
    onLoad(callback: Function)
    offLoad(callback: Function)
    onError(callback: Function)
    offError(callback: Function)
    destroy()
}

interface IGamePortalAd {
    load(): Promise<any>
    show(): Promise<any>
    onLoad(callback: Function)
    offLoad(callback: Function)
    onClose(callback: Function)
    offClose(callback: Function)
    onError(callback: Function)
    offError(callback: Function)
    destroy(): Promise<any>
}

/**
 * 创建激励视频广告组件，全局单例，如果创建新的广告位 Ad 对象，会导致之前的 Ad **被销毁**
 */
interface IRewardedVideoAd {
    /** 手动拉取广告，成功回调 onLoad，失败回调 onError */
    load(): Promise<any>
    /** 视频广告组件默认是隐藏的，调用 show 方法展示广告 */
    show(): Promise<any>

    /** 设置视频广告加载成功回调 */
    onLoad(callback: Function)
    /** 移除视频广告加载成功回调 */
    offLoad(callback: Function)

    /** 设置视频关闭回调 */
    onClose(callback: (res: { isEnded: any }) => void)
    /** 移除视频关闭回调 */
    offClose(callback: Function)

    /** 设置视频广告出错回调 */
    onError(callback: Function)
    /** 移除视频广告出错回调 */
    offError(callback: Function)

    /** 销毁组件，释放资源 */
    destroy()
}

// laya 2.8，1060+
export default class OppoPlatform implements IPlatform {

    private platform: string;
    private info: any;

    private isIos() {
        return this.platform === 'ios';
    }

    private isAndroid() {
        return this.platform === 'android';
    }

    /** 分享离开 */
    private shareLeave() {
        return
    }

    /** 分享回来了 */
    private shareReturn() {
        return
    }

    constructor() {
        if (qg) {
            this.info = qg.getSystemInfoSync();
            this.platform = this.info.platform;

            // 1051+ 不需要 initAdService

            // qg.login({
            //     success: (res: any) => {
            //         console.log("成功登陆：", res);
            //     },
            //     fail: (err: any) => {
            //         console.warn("失败登陆：", err);
            //     },
            //     complete: (res: any) => {
            //         console.log("完成登陆：", res);
            //     }
            // })

            if (this.info.platformVersionCode >= 1060) {
                qg.reportMonitor('game_scene', 0);
            }

            //qg.reportMonitor('game_scene', 0)
            console.warn('OppoPlatform', this.info);

            this.checkDeskTopIcon();
        }
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
            reject('oppo no signature')
        })
    }

    getOpenId(): Promise<string> {
        return new Promise((resolve, reject) => {
            reject('oppo no open id')
        })
    }

    private getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => reject('oppo no user info'));
    }

    share(title: string, imgUrl: string, query: string): Promise<any> {
        return new Promise((resolve, reject) => reject('oppo no share'));
    }

    private bannerAd = null;
    /** @deprecated */
    private showBanner = false;

    showBannerAd(top: boolean = false, reCreate = false) {
        this.showBanner = true;
        // 创建
        // OPPO banner 会自己刷新！30s
        if (reCreate || !this.bannerAd) {
            console.log('reCreate banner');
            this.bannerAd && this.bannerAd.destroy();
            this.bannerAd = qg.createBannerAd({
                adUnitId: AD._7_banner,
                style: {}, // 宽度设0，不然onResize不会调用
            });

            const sys = qg.getSystemInfoSync();
            let bH = sys.screenWidth * 300 / 720; // 实际的banner高度
            let dy = sys.screenHeight / sys.screenWidth > 1.9 ? 50 : 0; // 全面屏时大概要减去的高度
            dy = sys.screenWidth * dy / 720;

            this.bannerAd.onResize((res: any) => {

            })

            this.bannerAd.onError((err: any) => { console.warn("普通banner错误: ", err); })
            this.bannerAd.onLoad((res) => { console.log("普通banner load: ", res) });
            this.bannerAd.onHide((res) => { console.log("隐藏banner load: ", res) })

            top && (this.bannerAd.style.top = sys.screenHeight / 2);
        }
        // 展示
        if (this.bannerAd) {
            this.bannerAd.show();
            console.log("展示普通banner: ", this.bannerAd);
        }
        return Promise.resolve()
    }

    hideBannerAd() {
        this.showBanner = false;
        this.bannerAd && (this.bannerAd.hide());
    }
    // 定义插屏广告
    private interstitialAd = null
    private interstitialAdCb = null
    showInsertAd(cb = null) {
        // 创建插屏广告实例，提前初始化
        if (qg && this.info.platformVersion > 1050) {
            this.interstitialAd = qg.createInsertAd({
                adUnitId: ""
            })
        } else if (this.info.platformVersion > 1040) {
            this.interstitialAd = qg.createInsertAd({
                posId: ""
            })
        }
        this.interstitialAdCb = cb;
        this.interstitialAd && this.interstitialAd.offClose();
        this.interstitialAd && this.interstitialAd.onClose(this.interstitialAdCb);
        this.interstitialAd && this.interstitialAd.offLoad();
        this.interstitialAd && this.interstitialAd.offError();
        this.interstitialAd && this.interstitialAd.onError((res) => {
            console.log("普通插屏展示错误: ", res);
        })
        this.interstitialAd && this.interstitialAd.offShow();
        this.interstitialAd && this.interstitialAd.onShow((res) => {
            console.log("普通插屏展示成功");
            this.hideBannerAd();
            //EventMgr.Ins.dispatch(EventType1.HIDE_NATIVE_BANNER);
        })
        this.interstitialAd && this.interstitialAd.onLoad(() => {
            console.log('展示普通插屏');
            this.interstitialAd.show();
        })
        this.interstitialAd && this.interstitialAd.load();
    }

    private nativeAds: any[];
    private lastTime: number;

    createNativeAd(type: AD): INativeAd {
        if (qg) {
            let ad = qg.createNativeAd({ adUnitId: type }) as INativeAd;
            ad.offError(null);
            ad.onError(() => ad.destroy());
            return ad;
        }
        return null;
    }

    /** @deprecated */
    showNativeAd(type?: any): Promise<any> {
        if (!qg)
            return

        if (!this.nativeAds) {
            console.log("########## 初始化原生广告 ##########");
            this.nativeAds = ["234663", "234685"].map(s => {
                return qg.createNativeAd({ adUnitId: s })
            })
        }

        const ad = this.nativeAds[type];
        if (!ad) {
            return null;
        }

        const curTime = new Date().getTime();

        if (this.lastTime && (curTime - this.lastTime) / 1000 < 60) {
            return null;
        }

        return ad.load().then((res: any) => {
            this.lastTime = curTime;
            return res;
        })
    }

    /** @deprecated */
    reportNativeAdShow(type: number, adId: string): void {
        const ad = this.nativeAds[type];
        if (ad) {
            ad.reportAdShow({ adId: adId });
        }
    }

    /** @deprecated */
    reportNativeAdClick(type: number, adId: string): void {
        const ad = this.nativeAds[type];
        if (ad) {
            ad.reportAdClick({ adId: adId });
        }
    }

    /** 微信视频对象是单例 */
    private video1 = null;

    private videoLoadCb = null;
    private videoErrorCb = null;
    private videoRewardCb = null;

    private onVideoLoad() {
        // 只执行一次
        this.videoLoadCb && this.videoLoadCb();
        this.videoLoadCb = null;
    }

    private onVideoError() {
        // 只执行一次
        this.videoErrorCb && this.videoErrorCb();
        this.videoErrorCb = null;
    }

    private onVideoReward() {
        // 只执行一次
        this.videoRewardCb && this.videoRewardCb();
        this.videoRewardCb = null;
    }
    loadVideoAd(): Promise<any> {
        // laya 2.8，1060+
        return new Promise((resolve, reject) => {
            this.videoLoadCb = resolve;
            this.videoErrorCb = reject;
            if (qg && !this.video1) {
                // 好像不能 destory，用单例
                this.video1 = qg.createRewardedVideoAd({ adUnitId: AD._3_视频 });
                this.video1.onLoad(() => this.onVideoLoad());
                this.video1.onError((res) => {
                    console.log("error", res);
                    this.onVideoError();
                });
                this.video1.onVideoStart((res) => {
                    console.log("start", res);
                });
                this.video1.onClose((res) => {
                    console.log(res);
                    setTimeout(() => {
                        if (res.isEnded) {
                            this.onVideoReward();
                        } else {
                            qg.showToast({
                                title: '视频未看完无奖励',
                                icon: 'none',
                                duration: 2000
                            });
                        }
                    }, 100);
                });
            }
            if (this.video1) {
                this.video1.load();
            } else {
                reject();
            }
        });
    }

    private lastOnClose = null;

    playVideoAd(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.videoRewardCb = resolve;
            this.videoErrorCb = reject;
            if (this.video1) {
                this.video1.show();
            } else {
                reject();
            }
        });
    }

    rewardVideo: IRewardedVideoAd;
    sucessCb: Function;
    cancelCb: Function;
    errCb: Function;

    private createRewardVideo() {
        this.rewardVideo = qg.createRewardedVideoAd({
            adUnitId: AD._3_视频
        })

        this.rewardVideo.onClose((res: any) => {
            if (res.isEnded) {
                this.sucessCb && this.sucessCb();
            } else {
                this.cancelCb && this.cancelCb();
            }
            this.sucessCb = null;
            this.cancelCb = null;
        })

    }

    private playingVideo = false;
    private xxx = 0;
    // oppo 广告返回的 promise 貌似能用了
    playVideo2(sucessCb: Function, errCallback: Function, cancelCb: Function) {
        if (this.playingVideo) {
            console.log('v isplaying', this.xxx)
            return;
        }
        this.xxx++;
        this.playingVideo = true;
        this.rewardVideo = qg.createRewardedVideoAd({ adUnitId: AD._3_视频 });
        console.log('v ---- new ----', this.xxx)
        this.rewardVideo.load().then(() => {
            console.log('v loaded', this.xxx)
            this.rewardVideo.onClose((res) => {
                this.playingVideo = false;
                if (res.isEnded) {
                    console.log('v played', this.xxx)
                    sucessCb && sucessCb()
                } else {
                    console.log('v cancelled', this.xxx)
                    cancelCb && cancelCb()
                }
            })
            console.log('v shown', this.xxx)
            return this.rewardVideo.show();
        }).catch(() => {
            console.log('v error', this.xxx)
            errCallback && errCallback();
            this.playingVideo = false;
        })
    }

    playVideo(sucessCb: Function, errCallback: Function, cancelCb: Function) {
        if (!this.rewardVideo) {
            this.createRewardVideo();
        }
        const promise: Promise<any> = this.rewardVideo.load();
        promise.then((res: any) => {
            this.rewardVideo.show();
            this.sucessCb = sucessCb;
            this.cancelCb = cancelCb;
        })
        promise.catch((res: any) => {
            console.log('激励视频加载失败');
            errCallback && errCallback();
        })
    }

    getStorageData(key: string) {
        return localStorage.getItem(key);  //qg.getStorageSync(key); localStorage
    }
    saveStorageData(key: string, data: any) {
        localStorage.setItem(key, data);
    }

    vibrateLong() {
        qg & qg.vibrateLong();
    }

    vibrateShort() {
        qg & qg.vibrateShort();
    }

    updateCloudStorage(level) {

    }

    setUserCloudStorage(array: { key: string, value: string }[]) {
        return Promise.reject('oppo has no cloud storage')
    }

    navigateToMiniGame(obj = null) {
        if (this.info.platformVersion < 1050)
            return
        qg.navigateToMiniGame(obj);
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

    /** @deprecated */
    added: boolean = false;
    /** @deprecated */
    checkDeskTopIcon(): Promise<boolean> {

        if (this.added) {
            return Promise.resolve(true);
        }

        return new Promise(resolve => {
            qg.hasShortcutInstalled({
                success: (res: boolean) => {
                    resolve(res);
                    this.added = res;
                },
                fail: () => {
                    resolve(false);
                }
            })
        })
    }

    addDesktopIcon() {
        if (this.added) {
            return;
        }
        qg && qg.installShortcut({});
    }

    /** 判断图标未存在时，创建图标 */
    installShortcut() {
        qg.hasShortcutInstalled({ success: function (res) { res || qg.installShortcut({}) } })
    }

    /** 互推9宫格 */
    createGamePortalAd(): IGamePortalAd {
        if (this.meetVersion(1076)) {
            let ad = qg && qg.createGamePortalAd({ adUnitId: AD._2_九宫格 }) as IGamePortalAd
            if (ad) {
                ad.offClose(null);
                ad.offError(null);
                ad.onClose(() => ad.destroy())
                ad.onError(() => ad.destroy())
                return ad;
            }
        }
        return null;
    }

    /** 互推横幅 */
    createGameBannerAd(): IGameBannerAd {
        if (this.meetVersion(1076)) {
            let ad = qg && qg.createGameBannerAd({ adUnitId: AD._1_横幅 }) as IGameBannerAd
            if (ad) {
                ad.offError(null);
                ad.onError(() => ad.destroy())
                return ad;
            }
        }
        return null;
    }

    private meetVersion(ver: number): boolean {
        return qg && qg.getSystemInfoSync().platformVersionCode >= ver;

    }

    showToast(msg?: string) {
        qg.showToast({
            title: msg,
            icon: 'none',
            duration: 2000
        });
    }
}
