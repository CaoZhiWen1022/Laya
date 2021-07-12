import effw from "../effendi/effw";

/** 这是后台预定义的，每个游戏不一样。注意更新 */
export enum SDK_EVENT {
    /** 加载 */
    load = "load",
    /** 解锁建筑 */
    room = "room",
    /** 造炮 */
    cannon = "cannon",
    /** 传送门 */
    portal = "portal",
    /** 原生点击 */
    board = "board",

    intro = "intro",
}

export enum STAGE_EVENT {
    /** 进⼊关卡 */
    enter = "stage_enter",
    /** 关卡失败（通关失败） */
    fail = "stage_fail",
    /** 完成关卡（通关成功，上报通过时间，单位毫秒） `{"passing_time": 20000}` */
    success = "stage_success",
    /** 没有完成当前关卡，中途退出 */
    suspend = "stage_suspend",
    /** 通过分享或激励视频获取奖励 */
    earn_rewards = "earn_rewards",
}

export interface StageEvent {
    /** 过关描述，比较统一即可 */
    stageDesc: string,
    /** 过关时间（毫秒） */
    passing_time?: number,
    /** 使用道具的名称 */
    name?: string,
    /** 使用道具的数量 */
    num?: string,
}

export enum LEVEL_EVENT {
    /** 游戏⽣命周期中⾸次读取到⽤户等级信息 */
    level_start = "level_start",
    /** ⽤户等级升级 */
    level_up = "level_up",
}

interface IEffendi {
    init?(): void
    setOpenId(openId): void
    sendPage(prePageId, pageId)
    sendEvent(event, eventParam)
    sendStage(stageId, event, eventParam)
    sendLevel(levelId, event, eventParam)
    sendPay(stageId, levelId, event, eventParam)
}

/**
 * - PrivateTracker
 * - PrivateTracker
 * - PrivateTracker
 */
export default class PrivateTracker {

    static get Ins(): PrivateTracker { return this['ins'] || (this['ins'] = new this()) }

    private get effendi(): IEffendi {
        if (!this['_effendi']) {
            /**/ if (Laya.Browser.onMiniGame) { this["_effendi"] = window["effendi"] } /* 微信小游戏 */
            // else if (Laya.Browser.onBDMiniGame) { this["_effendi"] = window["effendi"] } /* 百度小游戏 */
            // else if (Laya.Browser.onKGMiniGame) { this["_effendi"] = window["effendi"] } /* 小米戏小游戏 */
            else if (Laya.Browser.onQGMiniGame) { this["_effendi"] = window["effendi"] = effw.effendi_oppo.getInstance() } /* OPPO小游戏 */
            // else if (Laya.Browser.onVVMiniGame) { this["_effendi"] = window["effendi"] = effw.effendi_vivo.getInstance() } /* VIVO小游戏 */
            // else if (Laya.Browser.onAlipayMiniGame) { this["_effendi"] = window["effendi"] } /* 阿里小游戏 */
            // else if (Laya.Browser.onQQMiniGame) { this["_effendi"] = window["effendi"] } /* 手机QQ小游戏 */
            // else if (Laya.Browser.onBLMiniGame) { this["_effendi"] = window["effendi"] } /* BILIBILI小游戏 */
            // else if (Laya.Browser.onTTMiniGame) { this["_effendi"] = window["effendi"] } /* 字节跳动小游戏 */
            // else if (Laya.Browser.onHWMiniGame) { this["_effendi"] = window["effendi"] } /* 华为快游戏 */
            // else if (Laya.Browser.onTBMiniGame) { this["_effendi"] = window["effendi"] } /* 淘宝小游戏 */
        }
        return this['_effendi'];
    }

    constructor() {
        let ef = this.effendi;
        ef && ef.init && ef.init();
    }

    private _openId = Laya.LocalStorage.getItem('_p_openId');
    get openId() { return this._openId }
    set openId(x) {
        Laya.LocalStorage.setItem('_p_openId', this._openId = x);
        this.effendi && this.effendi.setOpenId(x);
    }

    /** 一般事件 */
    sendEvent(event: SDK_EVENT, params: { [key: string]: string | number }) {
        if (this.effendi) { this.effendi.sendEvent(event, params); }
    }

    /** 关卡 */
    sendStage(stageId: number | string, event: STAGE_EVENT, eventParam: StageEvent) {
        if (this.effendi) { this.effendi.sendStage(stageId, event, eventParam); }
    }

    /** 用户等级 */
    sendLevel(levelId: string, event: LEVEL_EVENT, eventParam?) {
        if (this.effendi) { this.effendi.sendLevel(levelId, event, eventParam); }
    }

    /** 页面跳转。从哪来，到哪去 */
    sendPage<T extends string>(lastPageId: T, currPageId: T) {
        if (this.effendi) { this.effendi.sendPage(lastPageId, currPageId); }
    }

    // sendPay(stageId,levelId,event,eventParam)
    // onShareAppMessage(obj)
}