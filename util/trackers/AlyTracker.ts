interface IAlyTracker {
    /** 1)	32位用户id */
    userID: string
    /** 2)	当前游戏appID */
    appID: string

    /**
     * 1)	视频打点
     * @param videoPosition 打开视频的位置，如”观看视频获得体力”
     * @param result 
     * @param ext 
     */
    videoDot(videoPosition: string, result: "show" | "success" | "fail", ext?: string): void;

    /**
     * 2)	导出位打点
     * @param exportPosition 触发导出的位置，如"猜你喜欢"
     * @param name 导出游戏的名称，如"熊猫突突突"
     * @param result 
     * @param ext 
     */
    exportDot(exportPosition: string, name: string, result: "click" | "success" | "fail", ext?: string): void;

    /**
     * 3)	事件打点
     * @param logType 日志类型；如"点击开始"
     * @param logDetail 日志详细内容；格式固定，根据类型解析
     */
    eventDot(logType: string, logDetail?: string): void;
    /**
     * 4)	区分新老用户事件打点
     * @param logType 日志类型；如"点击开始"
     * @param logDetail 日志详细内容；格式固定，根据类型解析
     */
    eventDotOldorNew(logType: string, logDetail?: string): void;
}

/**
 * 这家只上 tt
 */
export default class AlyTracker {

    static get Ins(): AlyTracker { return this['ins'] || (this['ins'] = new this()) }

    private _enabled = true;
    private get enabled() { return this._enabled && !!this.tracker };

    private _tracker: IAlyTracker;
    private get tracker(): IAlyTracker {
        if (!this._tracker) {
            if (Laya.Browser.onTTMiniGame) this._tracker = window['tt'] && window['tt'].aly;
            // if (Laya.Browser.onMiniGame) this._tracker = window['wx'] && window['wx'].aly;
        }
        return this._tracker;
    }

    sendEvent(event: string, param: string) {
        if (this.enabled) { this.tracker.eventDot(event, param) };
    }

    sendEventOldOrNew(event: string, param: string) {
        if (this.enabled) { this.tracker.eventDotOldorNew(event, param) };
    }

    /**
     * 
     * @param stage 
     * @param duration 毫秒
     */
    sendStage(stage: string, duration: number) {
        let t: string;
        if (duration >= 5 * 60 * 1000) {
            t = "5分外"
        } else if (duration >= 60 * 1000) {
            t = Math.floor(duration / 60 / 1000) + "分钟"
        } else {
            t = "1分内"
        }
        if (this.enabled) { this.tracker.eventDot("_stage", `${stage},${t}`) }
    }

    sendPage(from: string, to: string) {
        if (this.enabled) { this.tracker.eventDot("_page", [from, to].join(',')) }
    }

    videoDot(desc: string, result: "show" | "success" | "fail") {
        if (this.enabled) { this.tracker.videoDot(desc, result) }
    }

    exportDot(desc: string, gameName: string, result: "click" | "success" | "fail") {
        if (this.enabled) { this.tracker.exportDot(desc, gameName, result) }
    }
}