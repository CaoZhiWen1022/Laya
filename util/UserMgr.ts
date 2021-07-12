/**
 * 几种值
 * - `string`
 *   - 含 `AutoValue`
 * - `number`
 *   - 含 `boolean`
 */
export enum USER_KEY {

    IS_OLD = "IS_OLD",

    /** 货币1 */
    COIN_VALUE = "COIN_VALUE",
    /** 货币2 */
    ENERGY_VALUE = "ENEGY_VALUE",

    SELECTED_ROLE = "SELECTED_ROLE",

    TIGA_LVLS = "TIGA_LVLS",
    ZETA_LVLS = "ZETA_LVLS",
    ZERO_LVLS = "ZERO_LVLS",


    BGM_OFF = "BGM_OFF",
    SFX_OFF = "SFX_OFF",
}

export default class UserMgr {
    static get Ins(): UserMgr { return this['ins'] || (this['ins'] = new this()) }

    private _userInfo = {};

    constructor() {
        try {
            let data = Laya.LocalStorage.getItem("user1") || null;
            data = JSON.parse(data);
            console.log("用户数据:", data);

            Object.assign(this._userInfo, data);
        } catch (e) {
            console.warn(e);
        }
        window['userMgr'] = this;
    }

    save() {
        Laya.LocalStorage.setItem("user1", JSON.stringify(this._userInfo));
    }

    readBool(key: USER_KEY): boolean {
        return this._userInfo[key] ? true : false;
    }

    readNum(key: USER_KEY): number {
        return this._userInfo[key] || 0;
    }

    readStr(key: USER_KEY): string {
        return this._userInfo[key] || "";
    }

    write(key: USER_KEY, value: string | number | boolean) {
        this._userInfo[key] = value;
    }

    addTo(key: USER_KEY, delta: number): number {
        let old = this._userInfo[key] || 0;
        return this._userInfo[key] = old + delta;
    }

}
