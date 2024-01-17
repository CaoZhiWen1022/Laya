import HyperLink from "../logic/hyperLink/HyperLink";

export default class Extends {
    /**增加我们自己的属性 */
    public static addOurProperties() {

        const LayaResource = Laya.Resource as any;
        Laya.Resource.clearResourcesByUrl = (urls) => {
            //g.clog("准备清除gpu", urls)
            if ((Laya.loader as any).loading) {
                Laya.timer.once(100, null, Laya.Resource.clearResourcesByUrl, [urls])
                return
            }
            urls = urls.filter(url => url && url.length > 0)
            var keys = Object.keys(LayaResource._idResourcesMap);
            for (let index = 0; index < keys.length; index++) {
                var k = keys[index];
                var res = LayaResource._idResourcesMap[k];
                if (!res) continue;
                if (!res.lock && res.url && (res.constructor.name == "Texture2D" || res.constructor.name == "SpineTemplet")) {
                    if (urls.some(url => res.url.indexOf(url) != -1)) {
                        res._referenceCount = 0;
                        res.destroy();
                        //g.clog("清除gpu成功", res.url)
                    }
                }
            }
        }

        const old_fgui_UIPackage_createObject = fgui.UIPackage.createObject;
        fgui.UIPackage.createObject = function (pkgName, resName, userClass) {
            Laya.Browser['getQueryString']("uilog") === '1' &&
                (g.clog('ui>createObject:pkgName, resName:', pkgName, resName));
            return old_fgui_UIPackage_createObject(pkgName, resName, userClass)
        }

        fgui.UIPackage.addPackage = (resKey, descData: any) => {

            console.warn('废弃方法，建议使用 fgui.UIPackage.loadPackage');

            if (!descData) {
                descData = fgui.AssetProxy.inst.getRes(resKey + "." + fgui.UIConfig.packageFileExtension);
                if (!descData || descData.byteLength == 0)
                    throw new Error("resource '" + resKey + "' not found");
            }
            var buffer = new fgui.ByteBuffer(descData.data || descData);
            var pkg = new fgui.UIPackage() as any;
            pkg._resKey = resKey;
            pkg.loadPackage(buffer);
            (fgui.UIPackage as any)._instById[pkg.id] = pkg;
            (fgui.UIPackage as any)._instByName[pkg.name] = pkg;
            (fgui.UIPackage as any)._instById[resKey] = pkg;
            return pkg;
        }

        Object.defineProperties(String.prototype, {
            splitNum: {
                value: function (separator: string | RegExp, limit?: number) { return this.split(separator, limit).map(value => { return parseFloat(value); }); },
                enumerable: false
            }
        });
        Object.defineProperties(fgui.GRichTextField.prototype, {
            addLinkClick: { value: function () { (this as fgui.GRichTextField).onClick(Extends, Extends.openLinkWhenClick); } },
            removeLinkClick: { value: function () { this && (this as fgui.GRichTextField).offClick(Extends, Extends.openLinkWhenClick); } }
        });
        Object.defineProperties(fgui.GObject.prototype, {
            offAll: { value: function () { console.warn('offAll为老版fui2.0 api，请勿使用') } }
        });
        Object.defineProperties(fgui.GComponent.prototype, {
            showRedPoint: {
                value:
                    function (val, dir = 2, offsex_x = 0, offsex_y = 0, pkgName = "Common") {
                        if (val) {
                            if (this.redPoint == null) {
                                this.redPoint = fgui.UIPackage.createObject(pkgName, "red_dot").asImage;
                                this.redPoint.name = "red_dot";
                            }
                            //btn_tab3 长条形tab按钮特殊处理
                            if (this.resourceURL == "ui://uxxzm1azr3v83") {
                                offsex_x = -15;
                                offsex_y = 13;
                            }
                            this.redPoint.visible = true;
                            this.redPoint.removeFromParent();
                            if (dir == 2) {
                                this.redPoint.x = this.width - this.redPoint.width + offsex_x;
                                this.redPoint.y = offsex_y;
                            }
                            else if (dir == 1) {
                                this.redPoint.x = -this.redPoint.width + offsex_x;
                                this.redPoint.y = offsex_y;
                            }
                            this.addChild(this.redPoint);
                        }
                        else if (this.redPoint)
                            this.redPoint.visible = false;
                    }
            }
        });
        Object.defineProperties(Map.prototype, {
            getS: { value: function (key: Long) { return this.get(getLongString(key)); } },
            setS: { value: function (key: Long, value: any) { this.set(getLongString(key), value); } },
        });
        Object.defineProperties(Laya.Skeleton.prototype, {
            _frameUpdate: {
                value: function (value) {
                    if (this.player) {
                        this._index = value;
                        this._player.currentTime = this._index * 1000 / this._player.cacheFrameRate;
                        this._indexControl = true;
                        if (this._aniClipIndex < 0 || this._aniClipIndex >= this.getAnimNum()) {
                            this._aniClipIndex = 0;
                            this._currAniIndex = 0;
                            this._curOriginalData = new Float32Array(this._templet.getTotalkeyframesLength(this._currAniIndex));
                            this._drawOrder = null;
                            this._eventIndex = 0;
                        }
                        let tCurrTime = this.timer.currTimer;
                        let preIndex = this._player.currentKeyframeIndex;
                        let dTime = tCurrTime - this._lastTime;
                        this._player._update(dTime);

                        this._lastTime = tCurrTime;
                        this._index = this._clipIndex = this._player.currentKeyframeIndex;
                        if (this._index < 0)
                            return;
                        if (dTime > 0 && this._clipIndex == preIndex && this._lastUpdateAniClipIndex == this._aniClipIndex) {
                            return;
                        }
                        this._lastUpdateAniClipIndex = this._aniClipIndex;
                        if (preIndex > this._clipIndex && this._eventIndex != 0) {
                            this._emitMissedEvents(this._player.playStart, this._player.playEnd, this._eventIndex);
                            this._eventIndex = 0;
                        }
                        let tEventArr = this._templet.eventAniArr[this._aniClipIndex];
                        if (tEventArr && this._eventIndex < tEventArr.length) {
                            let tEventData = tEventArr[this._eventIndex];
                            if (tEventData.time >= this._player.playStart && tEventData.time <= this._player.playEnd) {
                                if (this._player.currentPlayTime >= tEventData.time) {
                                    this.event(Laya.Event.LABEL, tEventData);
                                    this._eventIndex++;
                                    if (this._playAudio && tEventData.audioValue && tEventData.audioValue !== "null" && tEventData.audioValue !== "undefined") {
                                        let channel = Laya.SoundManager.playSound(this._player.templet._path + tEventData.audioValue, 1, Laya.Handler.create(this, this._onAniSoundStoped));
                                        Laya.SoundManager.playbackRate = this._player.playbackRate;
                                        channel && this._soundChannelArr.push(channel);
                                    }
                                }
                            }
                            else if (tEventData.time < this._player.playStart && this._playAudio && tEventData.audioValue && tEventData.audioValue !== "null" && tEventData.audioValue !== "undefined") {
                                this._eventIndex++;
                                let channel = Laya.SoundManager.playSound(this._player.templet._path + tEventData.audioValue, 1, Laya.Handler.create(this, this._onAniSoundStoped), null, (this._player.currentPlayTime - tEventData.time) / 1000);
                                Laya.SoundManager.playbackRate = this._player.playbackRate;
                                channel && this._soundChannelArr.push(channel);
                            }
                            else {
                                this._eventIndex++;
                            }
                        }
                        if (this._aniMode == 0) {
                            let tGraphics = this._templet.getGrahicsDataWithCache(this._aniClipIndex, this._clipIndex) || this._createGraphics();
                            if (tGraphics && this.graphics != tGraphics) {
                                this.graphics = tGraphics;
                            }
                        }
                        else if (this._aniMode == 1) {
                            let tGraphics = this._getGrahicsDataWithCache(this._aniClipIndex, this._clipIndex) || this._createGraphics();
                            if (tGraphics && this.graphics != tGraphics) {
                                this.graphics = tGraphics;
                            }
                        }
                        else {
                            this._createGraphics();
                        }
                    }
                }
            }
        })
        Object.defineProperties(Laya.SpineSkeleton.prototype, {
            _frameUpdate: {
                value: function (index) {
                    let trackEntry = this._state.getCurrent(this.trackIndex);
                    let delta = this._timeKeeper.delta * this._playbackRate;
                    index = (index ? index : 0) * delta;
                    let dir = index < 0 ? -1 : 1
                    let value = trackEntry.animationLast + index
                    if (value > trackEntry.animationEnd) {
                        trackEntry.animationLast = Math.min(trackEntry.animationEnd, trackEntry.animationLast);
                        return
                    }
                    if (value < 0) {
                        trackEntry.animationLast = Math.max(0, trackEntry.animationLast)
                        return;
                    }
                    this._timeKeeper.update();
                    this._state.update(delta * dir);
                    this._state.apply(this._skeleton);
                    trackEntry.animationLast = value;
                    let animationLast = trackEntry.animationLast;
                    this._currentPlayTime = Math.max(0, animationLast);
                    if (!this._state || !this._skeleton) {
                        return;
                    }
                    this._skeleton.updateWorldTransform();
                    this.graphics.clear();
                    this._renerer.draw(this._skeleton, this.graphics, -1, -1);
                }
            }
        });
        //#region GLoader 废弃

        // // 修改fgui.GLoader.prototype.dispose方法
        // const GLoaderDispose = fgui.GLoader.prototype.dispose;
        // fgui.GLoader.prototype.dispose = function () {
        //     // 修改后的方法体
        //     if (this._url && this._url.length > 0) GPUSystem.clearImg(this._url)
        //     // 调用原方法体
        //     GLoaderDispose.call(this);
        // };

        // // 修改fgui.GLoader.prototype.url set方法
        // const GLoaderUrlSet = Object.getOwnPropertyDescriptor(fgui.GLoader.prototype, 'url').set;
        // // 修改 set 方法
        // Object.defineProperty(fgui.GLoader.prototype, 'url', {
        //     set: function (newValue) {
        //         if (this._url && this._url.length > 0) GPUSystem.clearImg(this._url)
        //         if (newValue && newValue.length > 0) GPUSystem.useImg(newValue)
        //         // 在修改后的 set 中调用原 set 方法
        //         GLoaderUrlSet.call(this, newValue);
        //     },
        // });

        //#endregion

        //#region Laya.Animation
        const Animation = Laya.Animation;
        //修改 loadAtlas方法
        Animation.prototype.loadAtlas = function (url, loaded = null, cacheName = "") {
            this._url = "";
            if (this.aniUrl) GPUSystem.clearAtlas(this.aniUrl)
            this.aniUrl = url;
            if (!this._setFramesFromCache(cacheName)) {
                let onLoaded = (loadUrl) => {
                    if (url === loadUrl) {
                        this.frames = Animation.framesMap[cacheName] ? Animation.framesMap[cacheName] : Animation.createFrames(url, cacheName);
                        if (!this._isPlaying && this._autoPlay)
                            this.play();
                        if (loaded)
                            loaded.run();
                        if (this.parent && !this.parent.destroyed && !this.destroyed) { //判断父物体是否被销毁，没有销毁则增加资源引用计数
                            GPUSystem.useAtlas(url)
                        }
                    }
                };
                if (Laya.Loader.getAtlas(url))
                    onLoaded(url);
                else
                    Laya.loader.load(url, Laya.Handler.create(null, onLoaded, [url]), null, Laya.Loader.ATLAS);
            }
            return this;
        };

        const AniClear = Animation.prototype.clear;
        Animation.prototype.clear = function () {
            if (this.aniUrl) GPUSystem.clearAtlas(this.aniUrl)
            this.aniUrl = "";
            return AniClear.call(this)
        }

        const AniDestroy = Animation.prototype.destroy;
        Animation.prototype.destroy = function () {
            // this.frames&&this.frames.forEach((frame:Laya.Graphics) => {
            //     frame && frame.destroy();
            // });
            if (this.aniUrl) {
                GPUSystem.clearAtlas(this.aniUrl)
            }
            AniDestroy.call(this)
        }

        //#endregion
    };

    /**
     * 富文本的点击事件
     * @param event 点击事件
     */
    private static openLinkWhenClick(event) {
        const needWord = Extends.findNeedWord(event.target._element._children, event.target.globalToLocal(new Laya.Point(event.stageX, event.stageY)));
        needWord && needWord.href && HyperLink.ins.openLinkById(needWord.href);
    }

    /**
     * 依据鼠标的点击判断点击到了富文本的哪一段
     * @param arrHtmlElement 富文本的父节点
     * @param point 鼠标点击点（局部坐标）
     * @returns
     */
    private static findNeedWord(arrHtmlElement, point: Laya.Point) {
        for (let i in arrHtmlElement) {
            if (arrHtmlElement[i]._text && arrHtmlElement[i]._text.words) {
                if (arrHtmlElement[i]._text.words.some(value => {
                    const [XD, YD] = [point.x - value.x, point.y - value.y];
                    return XD > 0 && XD < value.width && YD > 0 && YD < value.height;
                })) return arrHtmlElement[i];
            } else if (arrHtmlElement[i]._children) {
                const ClickWord = Extends.findNeedWord(arrHtmlElement[i]._children, point);
                if (ClickWord) return ClickWord;
            }
        }
    }
}