import { openUIparam } from "./OpenUIParam";
import { UIID } from "./UIEnum";
import { UIRegisterInfo } from "./UIRegisterInfo";

export interface IUIBase {

    UIID: UIID;
    openParam: openUIparam;
    UIRegisterInfo: UIRegisterInfo;
    m_ui: fgui.GComponent;
    visible: boolean;
    /** 是否已经销毁 */
    isDisposed: boolean;
    /** 是否允许销毁 */
    allowClose: boolean;

    /**
     * 打开ui
     * @param data 参数
     * @param openCall 打开回调
     * @param closeCall 关闭回调
     * @returns 是否成功打开
     */
    open(openParam: openUIparam): boolean;

    /** 打开成功,会在打开成功或隐藏后打开时被调用 */
    openSuccess(): void;

    /** 关闭,只能由UIMgr.close调用 */
    close(): void;

    /** 关闭成功,ui已经销毁，不要在访问ui的任何属性 */
    closeSuccess(): void;

    /** 隐藏ui但不销毁，不会执行closeCall，只能由UIMgr.close调用 */
    hide(): void;

    /** 被hide后的重新显示,会执行openSuccess,只能由UIMgr.openUIIns调用 */
    show(): void;

    /** 适配 */
    resize(): void;
}