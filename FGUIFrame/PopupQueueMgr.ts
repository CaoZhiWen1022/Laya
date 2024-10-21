import { IUIBase } from "./IUIBase";
import { openUIparam } from "./OpenUIParam";
import { UIType } from "./UIEnum";
import { UIMgr } from "./UIMgr";
import { UIPopup } from "./UIPopup";
import { UIRegister } from "./UIRegister";
import { UIRegisterInfo } from "./UIRegisterInfo";

export class PopupQueueMgr {

    static queue: openUIparam[] = [];

    static curPopup: IUIBase = null;

    /** 入队 */
    static push(param: openUIparam) {
        if (PopupQueueMgr.queue.find(p => p.UIID == param.UIID)) {
            //弹窗已经在队列
            console.warn(`ui ${param.UIID} already in queue`);
        }
        else if (UIMgr.getCurPopupAll().find(ui => ui.UIID == param.UIID)) {
            //弹窗已打开
            console.warn(`ui ${param.UIID} already open`);
        }
        let registerInfo = UIRegister.getUIInfo(param.UIID);
        if (!registerInfo) {
            //弹窗未注册
            console.warn(`ui ${param.UIID} not register`);
            return;
        }
        if (registerInfo.UIType != UIType.Popup || !registerInfo.popupPriority) {
            //弹窗注册信息不正确
            console.warn(`ui ${param.UIID} popup register error`);
            return;
        }
        console.log(`ui ${param.UIID} push queue`);
        PopupQueueMgr.queue.push(param);
        PopupQueueMgr.checkQueue();
    }

    /** 检查 */
    public static checkQueue() {
        if (PopupQueueMgr.queue.length == 0) return;
        if (UIMgr.getOpenings()) return//如果有界面正在打开，则return
        //队列进行排队
        PopupQueueMgr.queue.sort((a, b) => UIRegister.getUIInfo(b.UIID).popupPriority - UIRegister.getUIInfo(a.UIID).popupPriority);
        let target: openUIparam;
        let targetInfo: UIRegisterInfo;
        for (let i = 0; i < PopupQueueMgr.queue.length; i++) {//找到一个可以打开的弹窗
            const popup = PopupQueueMgr.queue[i];
            let popupInfo = UIRegister.getUIInfo(popup.UIID);
            let curPanel = UIMgr.getCurTopPanel();
            let curPopupPriority = UIMgr.getCurTopPopup() ? UIMgr.getCurTopPopup().UIRegisterInfo.popupPriority : -1;
            if (popupInfo.popupPriority > curPopupPriority
                && (!popupInfo.popupDependPanel || popupInfo.popupDependPanel.length == 0 || popupInfo.popupDependPanel.indexOf(curPanel.UIID) >= 0)
                || (popupInfo.popupPriority == curPopupPriority && popupInfo.isSamePriorityMeanwhileOpen)) {
                target = popup;
                targetInfo = popupInfo;
                break;
            }
        }
        if (target) PopupQueueMgr.show(target);
    }

    private static show(param: openUIparam) {
        let registerInfo = UIRegister.getUIInfo(param.UIID);
        if (!registerInfo.isSamePriorityMeanwhileOpen) {
            let curPopupAll = UIMgr.getCurPopupAll();
            curPopupAll.forEach(ui => {
                UIMgr.close(ui.UIID, false);
            })
            param.closeCall2 = Laya.Handler.create(null, () => {
                curPopupAll.forEach(ui => {
                    UIMgr.openUIIns(ui);
                })
            })
        }

        param.popuoQueueOpen = true;
        UIMgr.open(param);
        PopupQueueMgr.queue.splice(PopupQueueMgr.queue.indexOf(param), 1);
    }
}