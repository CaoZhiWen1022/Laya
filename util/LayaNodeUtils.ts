/** wx、qg 应该都支持 */
interface SubpackageProgress {
    // 加载进度百分比
    progress
    // 下载数据
    totalBytesWritten
    // 总长度
    totalBytesExpectedToWrite
}

interface SubpackageProgressHw {
    /** 分包下载进度百分比。*/
    progress: number
    /** 已经下载的数据长度，单位Bytes。*/
    loadSize: number
    /** 数据总长度，单位Bytes。*/
    totalSize: number
}

export default class LayaNodeUtils {

    /**
     * 根据前缀找子节点
     * @param mode 前缀、后缀、匹配
     * @param keyword 关键字
     * @param root 根节点
     * @param amount 找几个就够了？
     * @returns 总是返回一个数组
     */
    static findChild(mode: "start" | "match" | "end", keyword: string, root: Laya.Node, amount: number): Laya.Node[] {
        let nodes = [];
        let roots = [root];
        while (nodes.length < amount && (root = roots.shift())) {
            roots.push(...root["_children"]);
            nodes.push(...root["_children"].filter((x: Laya.Node) => {
                switch (mode) {
                    case "match": return x.name == keyword
                    case "start": return x.name.startsWith(keyword)
                    case "end": return x.name.endsWith(keyword)
                    default: return false;
                }
            }));
        }
        return nodes;
    }

    /** 找子节点，根据类型 */
    static getChildrenByType<T extends Laya.Node>(t: new () => T, root: Laya.Node, amount: number = Infinity) {
        let nodes = [];
        let roots = [root];
        while (nodes.length < amount && (root = roots.shift())) {
            roots.push(...root["_children"]);
            nodes.push(...root["_children"].filter((x: Laya.Node) => x && x instanceof t));
        }
        return nodes;
    }

    static getChildByType<T extends Laya.Node>(t: new () => T, root: Laya.Node) {
        for (let i = 0; i < root.numChildren; i++) {
            let c = root.getChildAt(i);
            if (c instanceof t) { return c }
        }
        return null;
    }

    /**
     * 返回节点的路径，直到遇到 scend3d
     * @param node 
     * @returns 
     */
    static pathOfSprite3D(node: Laya.Sprite3D) {
        let path = node && node.name;
        let tmp = node && node.parent;
        while (tmp) {
            path = tmp.name + "/" + path;
            if (tmp instanceof Laya.Scene3D) break;
            tmp = tmp.parent;
        }
        return path;
    }

    /**
     * 根据路径找节点
     * @param path path
     * @param root root
     */
    static getChildByPath(path: string, root: Laya.Node) {
        let paths = path.split('/');
        let child = root;
        while (paths.length) {
            let name = paths.shift();
            child = child && child.getChildByName(name);
        }
        return child;
    }

    static loadOne(url: string): Promise<any> {
        return new Promise((resolve, reject) => {
            try { Laya.loader.load(url, Laya.Handler.create(null, resolve)); } catch (e) { reject(e) }
        })
    }

    static loadArray(urls: any[], progress?: Laya.Handler): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                Laya.loader.load(urls, Laya.Handler.create(null, succ => {
                    succ ? resolve() : reject("load fail");
                }), progress);
            } catch (e) {
                reject(e)
            }
        })
    }

    static create3D<T extends Laya.Sprite3D | Laya.Scene3D>(url: string, progress?: Laya.Handler): Promise<T> {
        return new Promise((resolve, reject) => {
            try { Laya.loader.create(url, Laya.Handler.create(null, resolve), progress); } catch (e) { reject(e) }
        })
    }

    static create3DArray(urls: string[], progress?: Laya.Handler): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                Laya.loader.create(urls, Laya.Handler.create(null, succ => {
                    succ ? resolve(null) : reject('load fail');
                }), progress);
            } catch (e) {
                reject(e)
            }
        })
    }

    /**
     * 有 wx 或 qg 即可加载
     * - 调用时判断是否需要
     * @param name subpkg name
     * @param progress
     */
    static loadSubpackage(name: string, progress?: Laya.Handler) {
        let wx: any = window['wx'] || window['qg'];
        if (wx && wx.loadSubpackage) {
            return new Promise((resolve, reject) => {
                console.log('loadSubpackage try', name)
                console.log('wx', !!window['wx'], 'qg', !!window['qg']);
                if (Laya.Browser.onHWMiniGame) {
                    console.log('loadSubpackage try3 hw', name)
                    wx.loadSubpackage({
                        subpackage: name,
                        success: (res) => { resolve(res) },
                        fail: () => { reject() },
                    }).onprogress((res: SubpackageProgressHw) => progress && progress.runWith(res.progress / 100))
                } else {
                    wx.loadSubpackage({
                        name,
                        success: resolve,
                        fail: reject,
                        complete: () => console.log("loadSubpackage complete", name)
                    }).onProgressUpdate((res: SubpackageProgress) => progress && progress.runWith(res.progress / 100))
                }
            })
        } else {
            console.log('loadSubpackage try2', name)
            return Promise.resolve(null);
        }
    }

    /**
     * 用 frameOnce 延迟一下
     * - iOS 上，await 一个 Promise.resolve 会卡住
     * @param frame 帧数
     */
    static delayFrame(frame: number) {
        return new Promise((resolve, reject) => Laya.timer.frameOnce(frame, null, resolve));
    }

    /**
     * 用 once 延迟一下
     * - iOS 上，await 一个 Promise.resolve 会卡住
     * @param ms 毫秒
     */
    static delayTime(ms: number) {
        return new Promise((resolve, reject) => Laya.timer.once(ms, null, resolve));
    }

    /**
     * 确保节点有一个所指定的组件，并返回它
     * @param node 
     * @param t 
     * @returns 
     */
    static checkComp<T extends Laya.Component>(node: Laya.Node, t: new () => T): T {
        if (node && t) { return node.getComponent(t) || node.addComponent(t) } else return null;
    }

    /**
     * 
     * @param delayMS loop 延迟
     * @param checker 回调函数，成功时应返回 `true`
     * @returns 成功 1 失败 0
     */
    static waitForChecker(delayMS: number, checker: () => boolean): Promise<number> {
        if (checker instanceof Function) {
            let callback: Function
            return new Promise((resolve, reject) => {
                callback = () => checker() && resolve(1)
                Laya.timer.loop(delayMS, null, callback);
            }).then((x: number) => {
                Laya.timer.clear(null, callback)
                return x
            })
        } else {
            return this.delayTime(delayMS).then(() => 0);
        }
    }

    /**
     * 类似普通的 tween，不要有 complete 即可，props 里也不要有
     * @param target 
     * @param props 
     * @param duration 
     * @param ease 
     * @param ~complete~
     * @param delay 
     * @param coverBefore 
     * @param autoRecover 
     * @returns 
     */
    static tweenTo(
        target: any,
        props: any,
        duration: number,
        ease?: Function | null,
        // complete?: Handler | null,
        delay?: number,
        coverBefore?: boolean,
        autoRecover?: boolean): Promise<void> {

        return new Promise((resolve) => {
            Laya.Tween.to(
                target,
                props,
                duration,
                ease,
                Laya.Handler.create(null, resolve),
                delay,
                coverBefore,
                autoRecover)
        })
    }
}