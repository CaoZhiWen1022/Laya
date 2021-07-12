export default class EventMgr {
    static get Ins(): Laya.EventDispatcher { return this['ins'] || (this['ins'] = new Laya.EventDispatcher) }
}