
export interface IMessage {
    /**
     * 目标对象
     * - 为 0 通常是创建、或者单纯的消息
     * - 否则应该是 native 端的对象的 id
     * - （当然，可以定义特殊对象）
     */
    handler?: number;
    /**
     * 调用具体的方法
     * - 兼容 js、安卓、苹果
     */
    api: string;
    /**
     * 参数列表
     * - 单个参数直接传
     * - 多个参数，尽量使用数组
     * - 很麻烦的时候才考虑使用对象，比如原生广告的数据
     */
    args?: any;
}

interface IJSBridge {

    call(func: string, arg0: string | number | boolean);

    callWithBack(callback: (res) => void, func: string, arg0: string | number | boolean);
}

// bridge、func 都可以不止一个

const NATIVE_CLASS_0_IOS = "JSBridge";
const NATIVE_CLASS_0_ANDROID = "demo.JSBridge";

const NATIVE_FUNC_0_IOS = "onJsMessage:"
const NATIVE_FUNC_0_ANDROID = "onJsMessage"

const NATIVE_FUNC_1_ANDROID = "onJsMessageLite"


type RawType = string | number | boolean

/**
 * - 参考 qg 的接口，提供一个实现
 * - 将具体行为替换到 PlatformClass 上
 */
export default class BridgeLite {
    static get Ins(): BridgeLite { return this['ins'] || (this['ins'] = new this()) }

    sendMessage(msg: IMessage): number {
        if (BridgeLite.bridge) {
            return BridgeLite.bridge.call(NATIVE_FUNC_0_ANDROID, JSON.stringify(msg));
        }
        return 0;
    }

    callFunc(api: string, arg0?: RawType, arg1?: RawType, arg2?: RawType, arg3?: RawType) {
        let msg: IMessage = {
            api: api,
            args: [arg0, arg1, arg2, arg3]
        }
        if (BridgeLite.bridge) {
            return BridgeLite.bridge.call(NATIVE_FUNC_1_ANDROID, JSON.stringify(msg));
        }
        return 0;
    }

    private static get bridge(): IJSBridge {
        if (this['_bridge1']) {
            return this['_bridge1'];
        } else if (Laya.Render.isConchApp) {
            // js -> native
            if (Laya.Browser.onAndroid) {
                // 创建 js 代理
                // 需要完整的类路径，注意与iOS的不同
                return this['_bridge1'] = window["PlatformClass"].createClass(NATIVE_CLASS_0_ANDROID);
            } else if (Laya.Browser.onIOS) {
                // 创建 js 代理
                // return this['_bridge'] = window["PlatformClass"].createClass("JSBridge");
                return null;
            }
        } else {
            return null;
        }
    }

}

export enum adAPIType {

    _属性界面原生512_ = "showNativeIconBanner_1",
    _关卡界面512_ = "showNativeIconBanner_2",
    _争霸赛界面原生512_ = "showNativeIconBanner_3",


    _随机显示原生_="randomShowNative",

    _插屏_ = "showInsertVideoAd",

    _关闭原生Banner_ = "hideNativeBanner5",

    _弹窗_="native_dialog",
}