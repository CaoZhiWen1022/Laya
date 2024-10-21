import { UIID } from "./UIEnum";

export type openUIparam = {
    UIID: UIID;
    /** 参数 */
    data?: any;
    /** 打开回调 */
    openCall?: Laya.Handler;
    /** 关闭回调 */
    closeCall?: Laya.Handler;
    /** 关闭回调2,用于关闭时打开被关闭的弹窗，其他情况不要使用,由PopupQueueMgr控制 */
    closeCall2?: Laya.Handler;
    /** 打开失败回调 */
    errorCall?: Laya.Handler;
    /** 已打开状态下是否重新打开 */
    reOpen?: boolean;
    /** 标记为弹窗队列打开 */
    popuoQueueOpen?: boolean;
}