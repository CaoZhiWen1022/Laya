const tt = window["tt"];

export default class TTRecordVideoMgr {

    static get Ins(): TTRecordVideoMgr { return this["_ins"] || (this["_ins"] = new this) }

    private recorder = null;
    public recorderPath = null;
    public recordStatus: boolean = null

    private isDevTools = false;

    constructor() {
        this.recorder = tt.getGameRecorderManager();
        this.recordStatus = false;
        this.recorder.onStart(res => {
            //console.log('录屏开始');
            this.recordStatus = false;
        })
        this.recorder.onStop(res => {
            //console.log('录屏结束');
            this.recorderPath = res.videoPath;
            this.recordStatus = true;
        })
        this.recorder.onError(res => {
            //console.log('录屏错误');
            this.recordStatus = false;
        })

        let info = tt.getSystemInfoSync();
        this.isDevTools = !!(info && info.platform == "devtools");
    }

    startRecord() {
        this.isDevTools || this.recorder.start({
            duration: 120
        })
    }

    stopRecord() {
        this.isDevTools || this.recorder.stop();
    }

    shareVideo() {
        this.isDevTools || tt.shareAppMessage({
            channel: 'video',
            // title: '测试分享视频',
            // desc: "测试描述",
            imageUrl: '',
            templateId: '',
            query: '',
            extra: {
                videoPath: this.recorderPath, // 可替换成录屏得到的视频地址
                // videoTopics: ['话题1', '话题2']
            },
            success() {
                //console.log('分享视频成功');
            },
            fail(e) {
                if (e.errMsg.indexOf("short") != -1) {
                    // new Tips().showTips("录屏失败：录制时间低于3秒");
                } else {
                    // new Tips().showTips("分享视频失败");
                }
                //console.log('分享视频失败');
            }
        })
    }

}