import { FullScreenMaskPanel } from "../UI/common/FullScreenMaskPanel";
import UI_PopupMaskPanel from "../UIExport/common/UI_PopupMaskPanel";
import { IUIBase } from "./IUIBase";
import { openUIparam } from "./OpenUIParam";
import { PopupQueueMgr } from "./PopupQueueMgr";
import { UIID, UILayer, UIType } from "./UIEnum";
import { UIPanel } from "./UIPanel";
import { UIPopup } from "./UIPopup";
import { UIRegister } from "./UIRegister";
import { UIResource } from "./UIResourceMgr";

export class UIMgr {

    private static UILayer: Map<UILayer, fgui.GComponent> = new Map<UILayer, fgui.GComponent>();

    /** 打开中的UI */
    private static openings: UIID[] = [];

    /** 打开的UI */
    private static openUIs: IUIBase[] = [];

    /** 被隐藏的ui */
    private static concealUIs: IUIBase[] = [];

    /** 全屏遮罩ui */
    private static fullScreenMaskPanel: FullScreenMaskPanel

    /**
     * 打开ui
     * @param UIID id
     * @param data 打开参数
     * @param openCall open回调
     * @param closeCall close回调
     * @param errorCall 打开失败回调
     * @returns 
     */
    static async open(param: openUIparam) {
        let UIRegisterInfo = UIRegister.getUIInfo(param.UIID);
        if (UIMgr.openings.indexOf(param.UIID) >= 0) {
            console.warn(`ui ${param.UIID} is opening`);
            return;
        }
        if (UIRegisterInfo.UIType == UIType.Popup && !param.popuoQueueOpen) {
            //该弹窗不是通过弹窗队列打开的
            console.warn(`ui ${param.UIID} is not popup queue open`);
            return;
        }
        if (UIMgr.openUIs.find(ui => ui.UIID == param.UIID)) {
            if (param.reOpen) {
                UIMgr.close(param.UIID);
            } else {
                console.warn(`ui ${param.UIID} is open`);
                return;
            }
        }
        UIMgr.openings.push(param.UIID);
        this.setFullScreenMaskPanelVisible(true);
        //加载依赖
        await Promise.all([
            UIResource.loadPackage(UIRegisterInfo.uiPackage),
            UIResource.loadResource(UIRegisterInfo.uiRes)
        ])
        let ui = new UIRegisterInfo._class() as IUIBase;
        let openSuccess = ui.open(param);
        if (openSuccess) {
            UIMgr.openUIs.push(ui);
            UIMgr.openings.splice(UIMgr.openings.indexOf(param.UIID), 1);
            ui.openSuccess();
            let layer = UIMgr.getUILayer(UIRegisterInfo.UILayer);
            layer.addChild(ui.m_ui);
        } else {
            console.error(`ui ${param.UIID} open failed`);
            UIMgr.openings.splice(UIMgr.openings.indexOf(param.UIID), 1);
            param.errorCall?.run();
        }
        this.setFullScreenMaskPanelVisible(false);
    }

    /** 打开ui实例,作用只是显示并添加到打开列表，并执行openSuccess */
    static openUIIns(ui: IUIBase) {
        if (!ui || ui.isDisposed) return;
        UIMgr.openUIs.push(ui);
        ui.show();
        UIMgr.concealUIs.splice(UIMgr.concealUIs.indexOf(ui), 1);
    }

    /** 获取ui实例 */
    static getUIInstance(UIID: UIID): IUIBase {
        return UIMgr.openUIs.find(ui => ui.UIID == UIID);
    }

    /**
     * 关闭ui
     * @param UIID 
     * @param dispose 是否销毁，销毁才会执行closeCall，不销毁只是隐藏且从打开列表中移除
     */
    static close(UIID: UIID, dispose: boolean = true) {
        let uiins = UIMgr.openUIs.find(ui => ui.UIID == UIID);
        if (uiins && !uiins.isDisposed) {
            UIMgr.openUIs.splice(UIMgr.openUIs.indexOf(uiins), 1);
            if (dispose) {
                uiins.allowClose = true;
                uiins.close();
            }
            else {
                uiins.hide();
                UIMgr.concealUIs.push(uiins);
            }
        } else {
            console.warn(`ui close error ${UIID} not found or disposed`);
        }
    }

    /**
     *  关闭所有
     * @param exclude 不需要关闭的UI
     */
    static closeAll(exclude: UIID[] = []) {
        let uiArr = UIMgr.openUIs.filter(ui => exclude.indexOf(ui.UIID) == -1);
        for (let i = 0; i < uiArr.length; i++) {
            const element = uiArr[i];
            UIMgr.close(element.UIID);
        }
    }

    /** 初始化ui层级 */
    static initUILayer() {
        for (let layer in UILayer) {
            let com = new fgui.GComponent();
            com.name = layer;
            fgui.GRoot.inst.addChild(com);
            UIMgr.UILayer.set(layer as UILayer, com);
        }
    }

    /** 获取ui层级实例 */
    static getUILayer(layer: UILayer): fgui.GComponent {
        return UIMgr.UILayer.get(layer);
    }

    /** 初始化全屏遮罩 */
    static initFullScreenMaskPanel() {
        return new Promise((resolve) => {
            this.open({
                UIID: UIID.FullScreenMaskPanel, openCall: Laya.Handler.create(this, () => {
                    //打开回调中从opens中移除
                    UIMgr.fullScreenMaskPanel = UIMgr.getUIInstance(UIID.FullScreenMaskPanel) as FullScreenMaskPanel;
                    UIMgr.openUIs.splice(UIMgr.openUIs.indexOf(UIMgr.fullScreenMaskPanel), 1);
                    UIMgr.fullScreenMaskPanel.visible = false;
                    resolve(true);
                })
            });
        })
    }

    /** 设置全屏遮罩 */
    static setFullScreenMaskPanelVisible(visible: boolean) {
        UIMgr.fullScreenMaskPanel && UIMgr.fullScreenMaskPanel.setVisible(visible);
    }


    /** 获取当前正在打开的界面(包含加载中) */
    static getOpenings() {
        return UIMgr.openings.length > 0 ? UIMgr.openings : null;
    }

    /** 获取当前最上层打开的弹窗,(不包含加载中) */
    static getCurTopPopup() {
        let curPopup: IUIBase = null;
        UIMgr.openUIs.forEach(ui => {
            if (ui.UIRegisterInfo.UIType == UIType.Popup) {
                curPopup = ui;
            }
        })
        return curPopup;
    }

    /** 获取当前打开的所有弹窗 */
    static getCurPopupAll() {
        return UIMgr.openUIs.filter(ui => ui.UIRegisterInfo.UIType == UIType.Popup) as UIPopup[];
    }

    /** 刷新弹窗遮罩，只有最上层弹窗有遮罩 */
    static refreshPopupMask() {
        let popAll = UIMgr.getCurPopupAll();
        popAll.forEach((ui, index) => {
            if (index < popAll.length - 1 && ui.popupMask) ui.popupMask.visible = false;
            else if (index == popAll.length - 1 && ui.popupMask) ui.popupMask.visible = true;
        })
    }

    /** 获取当前打开的最上层全屏界面，(不包含加载中) */
    static getCurTopPanel() {
        let curPanel: UIPanel = null;
        UIMgr.openUIs.forEach(ui => {
            if (ui.UIRegisterInfo.UIType == UIType.Panel) curPanel = ui as UIPanel;
        })
        return curPanel
    }

}

