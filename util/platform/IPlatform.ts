export default interface IPlatform {

    /**
     * 类似微信的 onShow
     * 
     * 注意：onShow 中需要进行 null check，防止场景还未加载完
     * @param callback 
     */
    onShow(callback: (result) => void),
    onHide(callback: () => void),

    offShow(callback),
    offHide(callback),

    getOpenId(): Promise<string>,

    getSystemInfoSync(): object,

    /**
     * 主动分享
     */
    share(title: string, imgUrl: string, query: string, desc?: string): Promise<any>,

    showBannerAd(),
    hideBannerAd(),
    showInsertAd(cb?),
    showNativeAd(type?),
    reportNativeAdShow(type?, adData?),
    reportNativeAdClick(type?, adData?),

    /**
     * 返回 promise，使用者自己觉得要不要进行 play
     * @param adId 广告Id
     */
    loadVideoAd(): Promise<any>,

    /**
     * 播放视频
     * 
     * 注意取消也是 reject
     */
    playVideoAd(): Promise<any>,
    /**
     * 成功观看回调，加载失败回调，取消观看
     */
    playVideo(callback, errCallback, cancelCb?, id?),

    getStorageData(key: string),

    saveStorageData(key: string, data: string),

    vibrateLong(),

    vibrateShort(),

    updateCloudStorage(level),

    taskAd(leaveTime: number, okCb: Function, failCb: Function),

    taskReturn(),
}
