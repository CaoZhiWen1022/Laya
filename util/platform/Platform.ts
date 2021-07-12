import HwPlatform from "./HwPlatform";
import IPlatform from "./IPlatform";
import OppoPlatform from "./OppoPlatform";
import TTPlatform from "./TTPlatform";
import VivoPlatform from "./VivoPlatform";
import WeChatPlatform from "./WechatPlatform";

export default class Platform {
    static get Ins(): Platform { return this["_ins"] || (this["_ins"] = new this) }


    private platform;

    /**
     * 不分平台就用这个
     */
    get api(): IPlatform { return this.platform }

    constructor() {
        window["Plat1"] = this;
        /*--*/ if (Laya.Browser.onMiniGame) {
            this.platform = new WeChatPlatform();
        } else if (Laya.Browser.onQGMiniGame) {
            this.platform = new OppoPlatform();
        } else if (Laya.Browser.onVVMiniGame) {
            this.platform = new VivoPlatform();
        } else if (Laya.Browser.onTTMiniGame) {
            this.platform = new TTPlatform();
        } else if (Laya.Browser.onHWMiniGame) {
            this.platform = new HwPlatform();
        }
    }

    getByType<T extends IPlatform>(t: new () => T): T {
        return this.platform instanceof t ? this.platform : null;
    }

    get wx() { return this.getByType(WeChatPlatform) }

    get oppo() { return this.getByType(OppoPlatform) }

    get vivo() { return this.getByType(VivoPlatform) }

    get tt() { return this.getByType(TTPlatform) }

    get hw() { return this.getByType(HwPlatform) }
}
