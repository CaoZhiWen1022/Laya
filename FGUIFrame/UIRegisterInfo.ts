import { PopupPriority, UIID, UILayer, UIType } from "./UIEnum"

export type UIRegisterInfo = {
    /** uiid */
    UIID: UIID;

    /** 创建实例 */
    createInstance(): fgui.GComponent;

    /** ui脚本 */
    _class: any;

    /** ui类型 */
    UIType: UIType;

    /** ui层级 */
    UILayer: UILayer;

    /** ui包依赖 */
    uiPackage: string[];

    /** 其他资源依赖 */
    uiRes: string[];
    
    /** 是否允许和同权重的弹窗同时打开 */
    isSamePriorityMeanwhileOpen?: boolean
    /** 弹窗权重 */
    popupPriority?: PopupPriority;
    /** 弹窗的依赖Panel,存在依赖界面才打开 */
    popupDependPanel?: UIID[];
    /** 弹窗超时时间，等不到依赖界面时多久清理 */
    popupTimeout?: number;
}