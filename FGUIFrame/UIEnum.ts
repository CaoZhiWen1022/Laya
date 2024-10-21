/** ui的id，注册和打开关闭等使用
 *  panel 从100开始
 *  popup 从10000开始
 */
export enum UIID {
    LoadPanel = 100,
    FullScreenMaskPanel,
    MainPanel,
    TestPopupQueue,

    popup1 = 10000,
    popup2,
    popup3,
    popup4,
    popup5,
}

/** ui类型 */
export enum UIType {
    /** 全屏 */
    Panel = 0,
    /** 弹窗 */
    Popup = 1,
}

/** ui层级 */
export enum UILayer {
    /** 全屏界面层 */
    panelLayer = 'panelLayer',
    /** 弹窗层 */
    popupLayer = 'popupLayer',
    /** 引导层 */
    GuideLayer = 'GuideLayer',
    /** 全屏遮罩层 */
    FullScreenMask = 'FullScreenMask',
}

/**
 * 弹窗权重 同权重按照入队顺序打开，高权重进入队列时关闭低权重并打开，等待高权重关闭后再打开被关闭的界面
 */
export enum PopupPriority {
    /** 普通 */
    Normal = 1,
    /** 中 */
    Middle = 2,
    /** 高 */
    High = 3,
    /** 最高 */
    Highest = 4,
}