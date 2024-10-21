import { FullScreenMaskPanel } from "../UI/common/FullScreenMaskPanel";
import { LoadPanel } from "../UI/Load/LoadPanel";
import { MainPanel } from "../UI/Main/MainPanel";
import { popup1 } from "../UI/popup/popup1";
import { popup2 } from "../UI/popup/popup2";
import { popup3 } from "../UI/popup/popup3";
import { popup4 } from "../UI/popup/popup4";
import { TestPopupQueue } from "../UI/popup/TestPopupQueue";
import UI_FullScreenMaskPanel from "../UIExport/common/UI_FullScreenMaskPanel";
import UI_LoadPanel from "../UIExport/Load/UI_LoadPanel";
import UI_MainPanel from "../UIExport/Main/UI_MainPanel";
import UI_TestPopup from "../UIExport/PopTest/UI_TestPopup";
import UI_TestPopupQueue from "../UIExport/PopTest/UI_TestPopupQueue";
import { PopupPriority, UIID, UILayer, UIType } from "./UIEnum";
import { UIRegisterInfo } from "./UIRegisterInfo";

export class UIRegister {

    public static ALLUIINFO: UIRegisterInfo[] = [];

    public static init() {
        UIRegister.ALLUIINFO = [
            {
                UIID: UIID.LoadPanel,
                createInstance: UI_LoadPanel.createInstance,
                _class: LoadPanel,
                UIType: UIType.Panel,
                UILayer: UILayer.panelLayer,
                uiPackage: ["Load"],
                uiRes: []
            },
            {
                UIID: UIID.FullScreenMaskPanel,
                createInstance: UI_FullScreenMaskPanel.createInstance,
                _class: FullScreenMaskPanel,
                UIType: UIType.Panel,
                UILayer: UILayer.FullScreenMask,
                uiPackage: ["common"],
                uiRes: []
            },
            {
                UIID: UIID.MainPanel,
                createInstance: UI_MainPanel.createInstance,
                _class: MainPanel,
                UIType: UIType.Panel,
                UILayer: UILayer.panelLayer,
                uiPackage: ["Main"],
                uiRes: []
            },
            {
                UIID: UIID.TestPopupQueue,
                createInstance: UI_TestPopupQueue.createInstance,
                _class: TestPopupQueue,
                UIType: UIType.Panel,
                UILayer: UILayer.GuideLayer,
                uiPackage: ["PopTest"],
                uiRes: []
            },
            {
                UIID: UIID.popup1,
                createInstance: UI_TestPopup.createInstance,
                _class: popup1,
                UIType: UIType.Popup,
                UILayer: UILayer.popupLayer,
                uiPackage: ["PopTest"],
                uiRes: [],
                popupPriority: PopupPriority.Normal,
                popupDependPanel: [],
                popupTimeout: 5000,
            },
            {
                UIID: UIID.popup2,
                createInstance: UI_TestPopup.createInstance,
                _class: popup2,
                UIType: UIType.Popup,
                UILayer: UILayer.popupLayer,
                uiPackage: ["PopTest"],
                uiRes: [],
                popupPriority: PopupPriority.Normal,
                popupDependPanel: [],
                isSamePriorityMeanwhileOpen: true,
                popupTimeout: 5000,
            },
            {
                UIID: UIID.popup3,
                createInstance: UI_TestPopup.createInstance,
                _class: popup3,
                UIType: UIType.Popup,
                UILayer: UILayer.popupLayer,
                uiPackage: ["PopTest"],
                uiRes: [],
                popupPriority: PopupPriority.Middle,
                popupDependPanel: [],
                popupTimeout: 5000,
            },
            {
                UIID: UIID.popup4,
                createInstance: UI_TestPopup.createInstance,
                _class: popup4,
                UIType: UIType.Popup,
                UILayer: UILayer.popupLayer,
                uiPackage: ["PopTest"],
                uiRes: [],
                popupPriority: PopupPriority.High,
                popupDependPanel: [],
                popupTimeout: 5000,
            }
        ]
    }

    public static getUIInfo(uiID: UIID): UIRegisterInfo {
        return UIRegister.ALLUIINFO.find(info => info.UIID == uiID);
    }
}