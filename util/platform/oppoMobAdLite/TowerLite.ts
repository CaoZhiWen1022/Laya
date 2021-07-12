import SoundMgr from "../../../mgrs/SoundMgr";
import BridgeLite, { IMessage } from "./BridgeLite";

export default class TowerLite {
    static get Ins(): TowerLite { return this['ins'] || (this['ins'] = new this()) }

    constructor() {
        window["layaTower"] = this;
    }

    private onNativeMessage(json: string) {
        try {
            console.log(json);
            const msg = JSON.parse(json) as IMessage;
            console.log(msg);
            switch (msg.api) {
                case "loadVideoAd": {
                    !!msg.args
                        ? this.videoLoadOk && this.videoLoadOk()
                        : this.videoLoadErr && this.videoLoadErr();
                    this.videoLoadOk = this.videoLoadErr = null;
                } break;
                case "playVideoAd": {
                    !!msg.args
                        ? this.videoPlayOk && this.videoPlayOk()
                        : this.videoPlayErr && this.videoPlayErr()
                    this.videoPlayOk = this.videoPlayErr = null;
                } break;
                case "loadInsertAd": {
                    !!msg.args
                        ? this.insertLoadOk && this.insertLoadOk()
                        : this.insertLoadErr && this.insertLoadErr()
                    this.insertLoadOk = this.insertLoadErr = null;
                } break;
            }
        } catch (e) {
            console.warn('cant parse', json);
        }
    }



    private videoLoadOk: Function
    private videoLoadErr: Function

    loadVideoAd(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.videoLoadOk = resolve;
            this.videoLoadErr = reject;
            BridgeLite.Ins.callFunc("loadVideoAd");
        })
    }

    private videoPlayOk: Function
    private videoPlayErr: Function

    playVideoAd(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.videoPlayOk = resolve;
            this.videoPlayErr = reject;
            BridgeLite.Ins.callFunc("playVideoAd");
        })
    }

    private insertLoadOk: Function
    private insertLoadErr: Function

    loadInsertAd(): Promise<any> {
        return new Promise((resolve, reject) => {
            this.insertLoadOk = resolve;
            this.insertLoadErr = reject;
            BridgeLite.Ins.callFunc("loadInsertAd");
        })
    }

    playVideo(callback, errCallback, cancelCb = null) {
        this.loadVideoAd().then(() => {
            console.log("1 mobad v loaded")
            // 加载成功，暂停音乐
            // SoundMgr.Ins.stopMusic();
            this.playVideoAd().then(() => {
                // 播完了，播音乐
                // SoundMgr.Ins.playDefaultMusic();

                console.log("2 mobad v played")
                callback && callback();
            }, () => {
                // 播完了，播音乐
                // SoundMgr.Ins.playDefaultMusic();

                console.log("3 mobad v cancelled")
                cancelCb && cancelCb();
            })
        }, () => {
            console.log("4 mobad v loaded")
            errCallback && errCallback();
        });
    }


    private playDefaultMusic() {
        SoundMgr.Ins.playDefaultMusic();
    }
    private stopMusic() {
        SoundMgr.Ins.stopMusic();
    }
}