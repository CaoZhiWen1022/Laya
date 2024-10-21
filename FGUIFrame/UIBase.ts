import { IUIBase } from "./IUIBase";
import { openUIparam } from "./OpenUIParam";
import { PopupQueueMgr } from "./PopupQueueMgr";
import { UIID } from "./UIEnum";
import { UIMgr } from "./UIMgr";
import { UIRegister } from "./UIRegister";
import { UIRegisterInfo } from "./UIRegisterInfo";

export class UIBase implements IUIBase {

    allowClose: boolean;
    UIRegisterInfo: UIRegisterInfo;
    UIID: UIID;
    openParam: openUIparam;
    m_ui: fairygui.GComponent;
    data: any;

    get isDisposed(): boolean {
        return this.m_ui.isDisposed;
    }

    open(openParam: openUIparam): boolean {
        this.UIID = openParam.UIID;
        this.openParam = openParam;
        this.data = openParam.data;
        this.UIRegisterInfo = UIRegister.getUIInfo(openParam.UIID);
        this.m_ui = this.UIRegisterInfo.createInstance();
        this.m_ui.name = this.constructor.name;
        if (!this.m_ui) {
            console.error(`ui ${UIID} not found`);
            return false;
        }
        return true;
    }

    resize(): void {
        this.m_ui.makeFullScreen();
    }

    openSuccess(): void {
        this.openParam.openCall?.run();
        this.resize();
        this.m_ui.displayObject.on(Laya.Event.RESIZE, this, this.resize);
        PopupQueueMgr.checkQueue();
    }

    close(): void {
        if (!this.allowClose) return;
        if (this.isDisposed) return;
        Laya.Tween.clearAll(this.m_ui);
        this.m_ui.displayObject.off(Laya.Event.RESIZE, this, this.resize);
        this.m_ui.dispose();
        this.closeSuccess();
    }

    closeSuccess(): void {
        this.openParam.closeCall?.run();
        PopupQueueMgr.checkQueue();
    }

    set visible(value: boolean) {
        this.m_ui.visible = value;
    }

    get visible(): boolean {
        return this.m_ui.visible;
    }

    hide(): void {
        this.visible = false;
    }

    show(): void {
        this.visible = true;
        this.openSuccess();
    }
}