import IPlatform from './IPlatform';

// 从1078版本开始，接口前缀由hbs修改为qg，原hbs仍支持。
const qg = window["qg"] || window["hbs"];

const appId = 103894893;
export enum AD {
    _1_开屏 = "t5db2ctcuy",
    _2_banner = "x5xe4xv4ab",
    _3_视频 = "x4r3kec7mm",
    /** 
     * 原生大图
     * - 1080x432 - 5:2 = 2.5
     * - 1080x607 - 16:9 = 1.778
     * - 225x150 - 3:2 = 1.5
     * */
    _4_原生大图 = "x6oj4khoym",
    /** 原生icon
     * - 160x160 - 1:1 = 1
     * */
    _5_原生icon = "h9od6rd96n",
    /** 原生视频
     * - 640x360 - 横屏 16:9
     * - 720x1080 - 竖屏 3:2
     * */
    _6_原生视频 = "n04w6c695i",
}

interface INativeAdArg {
    adId: string
    /** 跳转到落地页后是否自动下载，缺省为 false。1078 */
    isAutoDownload?: boolean
}

export interface INativeAdRes {
    /** 华为目前每次调用返回一条广告数据 */
    adList: INativeAdInfo[];
    code?: number
    msg?: string
}

enum _CreativeType {
    _1_文字 = 1,
    _2_大图片 = 2,
    _3_大图文 = 3,
    _6_视频文 = 6,
    _7_小图文 = 7,
    _8_三小图文 = 8,
    _9_视频 = 9,
    _10_图标_文 = 10,
    _101_文字带下载按钮 = 101,
    _102_大图片带下载按钮 = 102,
    _103_大图文带下载按钮 = 103,
    _106_视频文带下载按钮 = 106,
    _107_小图文带下载按钮 = 107,
    _108_三小图文带下载按钮 = 108,
    _110_图标_文_带下载按钮 = 110,
}
/** 
 * 
     获取广告类型，取值说明：
    - 1	文字
    - 2	大图片
    - 3	大图文
    - 6	视频文
    - 7	小图文
    - 8	三小图文
    - 9	视频
    - 10	图标（文）
    - 101	文字带下载按钮
    - 102	大图片带下载按钮
    - 103	大图文带下载按钮
    - 106	视频文带下载按钮
    - 107	小图文带下载按钮
    - 108	三小图文带下载按钮
    - - 109	视频带下载按钮 没有这个
    - 110	图标（文）带下载按钮
    */

class CreativeType {
    private type: _CreativeType;
    has_download: boolean;
    has_bigImage: boolean;
    has_tinyImage: boolean;
    has_icon: boolean;
    has_text: boolean;
    has_video: boolean;

    constructor(type: number) {
        this.type = type;
        const typeDesc = _CreativeType['type'] as string;
        this.has_download = !!typeDesc.indexOf("下载");
        this.has_bigImage = !!typeDesc.indexOf("大图");
        this.has_tinyImage = !!typeDesc.indexOf("小图");
        this.has_icon = !!typeDesc.indexOf("图标");
        this.has_text = !!typeDesc.indexOf("文");
        this.has_video = !!typeDesc.indexOf("视频");
    }
}

/** 广告item说明
 * 
 * 仔细看，只有4种确定的显示内容：
 * - title 文
 * - icon 图标
 * - imgs 区分：大图、小图、3小图
 * - videos 忽略
 * 
 * 广告素材、
 * 广告标识、
 * 广告来源、
 * 广告标题（至少预留22个汉字字符位置，含标点符号）和
 * 关闭按钮、
 * 下载按钮必须清晰完整展示；
*/
export interface INativeAdInfo {
    /** 广告标识，用来上报曝光与点击 */
    adId: string
    /** 广告标题 */
    title: string
    /** @deprecated 广告描述 华为目前仅返回空字符串""。 */
    desc: string
    /** 广告来源 */
    source: string
    /** 推广应用的 Icon 图标 */
    icon: string
    /** 广告图片 */
    imgUrlList: string[]
    /** 广告视频 */
    videoUrlList: string[]
    /** 广告视频宽高比 1078*/
    videoRatio: string[]
    /** @deprecated “广告”标签图片 华为目前仅返回空字符串 */
    logoUrl: string
    /** 点击按钮文本描述 */
    clickBtnTxt: string
    /**
     * 华为类型取值和联盟有所不同。
     * @see CreativeType
    */
    creativeType: number
    /**
     * @deprecated
     * 华为当前始终返回为0。
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

enum DownloadApiResult {
    // 调用应用开始下载或重启下载方法成功标识。
    success = 0,
    // 由于参数错误导致调用应用开始下载或重启下载失败标识，如素材为非应用下载类广告。
    argErr = -1,
    // 由于无下载权限调用应用开始下载或重启下载失败标识。
    accessErr = -2,
}

enum APP_STATUS {
    /** 下载未开始，应用初始状态。*/
    DOWNLOAD = "DOWNLOAD",
    /** 应用下载中。*/
    DOWNLOADING = "DOWNLOADING",
    /** 下载失败。*/
    DOWNLOADFAILED = "DOWNLOADFAILED",
    /** 下载等待中。*/
    WAITING = "WAITING",
    /** 应用下载暂停中。*/
    PAUSE = "PAUSE",
    /** 等待安装。*/
    INSTALL = "INSTALL",
    /** 安装中。*/
    INSTALLING = "INSTALLING",
    /** 安装完毕，此时应用可打开。*/
    INSTALLED = "INSTALLED",
}

enum ChildProtection {
    /** 您不希望表明您的广告内容是否需要符合COPPA的规定。*/
    _不告诉你 = -1,
    /** 表明您的广告内容不需要符合COPPA的规定。*/
    _不要插手 = 0,
    /** 表明您的广告内容需要符合COPPA的规定（该广告请求无法获取到任何广告）。*/
    _大爱无疆 = 1,
}

enum UnderAge {
    /** 表明您尚未指定广告请求是否要符合未达到法定承诺年龄用户的广告标准。*/
    _不告诉你 = -1,
    /** 表明您不希望广告请求符合未达到法定承诺年龄用户的广告标准。*/
    _不要插手 = 0,
    /** 表明您希望广告请求符合未达到法定承诺年龄用户的广告标准。*/
    _大爱无疆 = 1,
}

enum AdClassify {
    /** 适合幼儿及以上年龄段观众的内容。*/
    _未成年 = "W",
    /** 适合少儿及以上年龄段观众的内容。*/
    _小屁孩 = "PI",
    /** 适合青少年及以上年龄段观众的内容。*/
    _青少年 = "J",
    /** 仅适合成人观众的内容。*/
    _成年人 = "A",
}

enum PersonalizedAd {
    /** 请求个性化广告与非个性化广告。*/
    _随便搞 = 0,
    /** 请求非个性化广告。*/
    _别跟踪 = 1,
}

export interface INativeAd {
    //// === 1075+
    load(): void // Promise<INativeAdRes>
    reportAdShow(object: INativeAdArg)
    reportAdClick(object: INativeAdArg)
    onLoad(callback: (data: INativeAdRes) => void)
    /** 华为暂不支持移除某个回调对象；支持传空，移除所有回调对象。*/
    offLoad(callback?: Function)
    onError(callback: (err: { errCode: number, errMsg: string }) => void)
    /** 华为暂不支持移除某个回调对象；支持传空，移除所有回调对象。*/
    offError(callback?: Function)

    //// === 1077+
    destroy()

    setTagForChildProtection(childProtection: ChildProtection)
    setTagForUnderAgeOfPromise(underAgeOfPromiseStr: UnderAge)
    setAdContentClassification(adContentClassification: AdClassify)
    setNonPersonalizedAd(personalizedAd: PersonalizedAd)

    //// === 1078+
    startDownload(OBJECT: INativeAdArg): DownloadApiResult
    resumeDownload(OBJECT: INativeAdArg): DownloadApiResult
    pauseDownload(OBJECT: INativeAdArg): void
    cancelDownload(OBJECT: INativeAdArg): void
    /** @returns 0-100 */
    getDownloadProgress(OBJECT: INativeAdArg): number

    getAppStatus(OBJECT): APP_STATUS
    onStatusChanged(callback: (data: { status: APP_STATUS, uniqueId: string }) => void)
    offStatusChanged()
    onDownloadProgress(callback: (data: { progress: number, uniqueId: string }) => void)
    offDownloadProgress()
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

// laya 2.8，1078+
export default class HwPlatform implements IPlatform {

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

            qg.login({
                success: (res: any) => {
                    console.log("成功登陆：", res);
                },
                fail: (err: any) => {
                    console.warn("失败登陆：", err);
                },
                complete: (res: any) => {
                    console.log("完成登陆：", res);
                }
            })

            if (this.info.platformVersionCode >= 1060) {
                qg.reportMonitor('game_scene', 0);
            }

            //qg.reportMonitor('game_scene', 0)
            console.warn('HwPlatform', this.info);

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
            reject('Hw no signature')
        })
    }

    getOpenId(): Promise<string> {
        return new Promise((resolve, reject) => {
            reject('Hw no open id')
        })
    }

    private getUserInfo(): Promise<any> {
        return new Promise((resolve, reject) => reject('Hw no user info'));
    }

    share(title: string, imgUrl: string, query: string): Promise<any> {
        return new Promise((resolve, reject) => reject('Hw no share'));
    }

    private bannerAd = null;
    /** @deprecated */
    private showBanner = false;

    showBannerAd(top: boolean = false, reCreate = false) {
        qg.showToast({ title: "showBannerAd", icon: "none" });
        this.showBanner = true;
        // 创建
        // Hw banner 会自己刷新！30s
        if (reCreate || !this.bannerAd) {
            console.log('reCreate banner');

            const sys = qg.getSystemInfoSync();
            // 360	57	普通Banner广告，适用于1080*170px的广告素材。
            // 360	144	大型Banner广告，适用于1080*432px的广告素材。
            this.bannerAd && this.bannerAd.destroy();
            this.bannerAd = qg.createBannerAd({
                adUnitId: AD._2_banner,
                adIntervals: 31,
                style: {
                    top: 30, // sys.screenHeight - sys.pixelRatio * 57,
                    left: 30, // (sys.screenWidth - sys.pixelRatio * 360) / 2,
                    width: 360,
                    height: 57,
                },
            });


            let bH = sys.screenWidth * 300 / 720; // 实际的banner高度
            let dy = sys.screenHeight / sys.screenWidth > 1.9 ? 50 : 0; // 全面屏时大概要减去的高度
            dy = sys.screenWidth * dy / 720;

            // 监听 banner 广告尺寸变化事件（华为暂未实现功能）。
            this.bannerAd.onResize((res: any) => {

            })

            this.bannerAd.onError((err: any) => {
                console.warn("普通banner错误: ", err);
                qg.showToast({ title: "普通banner err" + err.errCode + "" + err.errMsg, icon: "none" })
            })
            this.bannerAd.onLoad((res) => {
                console.log("普通banner load: ", res)
                qg.showToast({ title: "普通banner load", icon: "none" })
            });
            this.bannerAd.onHide((res) => { console.log("隐藏banner load: ", res) })

            top && (this.bannerAd.style.top = sys.screenHeight / 2);
        }
        // 展示
        if (this.bannerAd) {
            this.bannerAd.show();
            console.log("展示普通banner: ", this.bannerAd);
            qg.showToast({ title: "展示普通banner", icon: "none" })
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

    rewardVideo: any;
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
        return Promise.reject('Hw has no cloud storage')
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

    private meetVersion(ver: number): boolean {
        return qg && qg.getSystemInfoSync().platformVersionCode >= ver;

    }
}
