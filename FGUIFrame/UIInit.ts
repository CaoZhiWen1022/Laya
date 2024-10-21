import commonBinder from "../UIExport/common/commonBinder";
import LoadBinder from "../UIExport/Load/LoadBinder";
import MainBinder from "../UIExport/Main/MainBinder";
import PopTestBinder from "../UIExport/PopTest/PopTestBinder";
import { UIMgr } from "./UIMgr";
import { UIRegister } from "./UIRegister";
import { UIResource } from "./UIResourceMgr";

export class UIInit {

    //初始加载的pkg
    static startLoadPkgList: string[] = ['common'];

    static popupMaskAlpha: number = 0.5;

    static async init() {
        //初始化fairygui
        UIInit.bindAll();
        Laya.stage.addChild(fgui.GRoot.inst.displayObject);
        //初始化注册
        UIRegister.init();
        //初始化uiLayer
        UIMgr.initUILayer();
        await UIResource.loadPackage(this.startLoadPkgList);
        await UIMgr.initFullScreenMaskPanel();
    }

    static bindAll() {
        //绑定fairygui
        LoadBinder.bindAll();
        commonBinder.bindAll();
        PopTestBinder.bindAll();
        MainBinder.bindAll();
    }
}