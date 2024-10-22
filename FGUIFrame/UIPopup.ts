import UI_PopupMaskPanel from "../UIExport/common/UI_PopupMaskPanel";
import { UIBase } from "./UIBase";
import { UILayer, UIType } from "./UIEnum";
import { UIMgr } from "./UIMgr";

export class UIPopup extends UIBase {

    /** 是否显示遮罩 */
    showMask: boolean = true;
    /** 是否点击遮罩关闭 */
    isMaskClickCloseThis: boolean = true;
    /** 遮罩透明度 */
    maskAlpha: number = 0.5;
    popupMask: fairygui.GComponent;

    /** 是否开启动画，默认开启，会修改弹窗锚点 */
    isOpenAni: boolean = true;

    thisHideOtherPopup: UIPopup[] = [];
    resize(): void {
        //居中适配
        let x = Laya.stage.width / 2 - this.m_ui.width / 2;
        let y = Laya.stage.height / 2 - this.m_ui.height / 2;
        this.m_ui.setXY(x, y);
    }

    openSuccess(): void {
        super.openSuccess();
        this.initMask()
        this.openAni();
        this.hideOtherPopup();
        UIMgr.refreshPopupMask();
    }

    openAni(): void {
        if (this.isOpenAni) {
            this.m_ui.setPivot(0.5, 0.5);
            this.m_ui.alpha = 0.6;
            this.m_ui.setScale(0.3, 0.3);
            Laya.Tween.to(this.m_ui, { alpha: 1, scaleX: 1, scaleY: 1 }, 80)
        }
    }

    initMask(): void {
        if (this.showMask && !this.popupMask) {
            this.popupMask = UI_PopupMaskPanel.createInstance();
            this.popupMask.name = "popupMask";
            this.popupMask.alpha = this.maskAlpha;
            this.popupMask.makeFullScreen();
            this.popupMask.x = 0;
            this.popupMask.y = 0;
            UIMgr.getUILayer(UILayer.popupLayer).addChild(this.popupMask);
            if (this.isMaskClickCloseThis) {
                this.popupMask.onClick(this, UIMgr.close, [this.UIID]);
            }
        }
        if (this.popupMask) this.popupMask.visible = true;
    }

    closeSuccess(): void {
        super.closeSuccess();
        this.popupMask?.dispose();
        this.showThisHideOtherPopup();
        UIMgr.refreshPopupMask();
    }

    hide(): void {
        super.hide();
        if (this.popupMask) this.popupMask.visible = false;
        UIMgr.refreshPopupMask();
    }

    private hideOtherPopup(): void {
        //关闭其他弹窗
        let allPopup = UIMgr.getCurPopupAll();
        for (let i = 0; i < allPopup.length; i++) {
            const element = allPopup[i];
            if (element != this) {
                let isclose = false
                if (this.UIRegisterInfo.isSamePriorityMeanwhileOpen) {
                    if (element.UIRegisterInfo.popupPriority != this.UIRegisterInfo.popupPriority) {
                        isclose = true;
                    }
                } else {
                    isclose = true;
                }
                if (isclose) {
                    UIMgr.close(element.UIID, false);
                    this.thisHideOtherPopup.push(element);
                }
            }
        }
    }

    private showThisHideOtherPopup(): void {
        for (let i = 0; i < this.thisHideOtherPopup.length; i++) {
            const element = this.thisHideOtherPopup[i];
            UIMgr.openUIIns(element);
        }
        this.thisHideOtherPopup.length = 0;
    }
}