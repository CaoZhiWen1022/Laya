/// 1.当前状态
/// 2.注册一个状态
/// 3.移除一个状态
/// 4.获取一个状态
/// 5.停止当前状态
/// 6.切换状态的回调
/// 7.切换状态回调委托
/// 8.切换状态
/// 9.判断当前状态是否是某个状态
import { Dictionary } from "./framework/structure/dictionary";
import { IState } from "./IState";
export class StateMachine {

    /**所有的状态集合 */
    mStateDic:{[key:number]:IState}=null;
    /**当前状态 */
    private mCurrentState: IState = null;
    constructor()
    {
        this.mStateDic={};
        this.mCurrentState = null;
    }
    get CurrentState(): IState {
        return this.mCurrentState;
    }
    /**当前状态id */
    get CurrentID(): number {
        return this.mCurrentState == null ? -1 : this.mCurrentState.GetStateID();
    }
    /**
    * @注册一个状态
    * @状态对象
    * @成功还是失败
    */
    public RegisterState(state: IState): boolean {
        if (state == null) {
            console.log("StateMachine.RegisterState state is Null!");
            return false;
        }
        //判断状态是否重复
        if (this.HasHey(state.GetStateID())) {
            console.log("状态重复 = " + state.GetStateID());
            return false;
        }
        this.AddState(this.mStateDic, state);
        return true;
    }

    /**
    * @移除一个状态
    * @状态id
    * @当状态不存在或者状态正在运行那么返回失败
    */
    public RemoveState(stateId: number): boolean {
        //判断是否存在
        if (!this.HasHey(stateId)) {
            return false;
        }
        if (this.mCurrentState != null && this.CurrentState.GetStateID() == stateId) {
            return false;
        }
        this.DicRemove(this.mStateDic, stateId);
        return true;
    }
    /**
    * @停止当前状态
    * @参数1
    * @参数2
    */
    public StopState(param1: object, param2: object): void {
        if (this.mCurrentState == null) {
            return;
        }
        this.mCurrentState.OnLeave(null, param1, param2);
        this.mCurrentState = null;
    }
   
    /**
    * @切换状态
    * @要切换的状态id
    * @参数1
    * @参数2
    * @如果不存在这个状态或者当前状态等于要切换的那个状态返回失败
    */
    public SwitchState(newStateId: number, param1: object, param2: object): boolean {
        if (this.mCurrentState != null && this.mCurrentState.GetStateID() == newStateId) {
            console.log("----1");
            
            return false;
        }
        var newState = this.GetState(newStateId);
        if (newState == null) {
            console.log("-----2");
            
            return false;
        }
        if (this.mCurrentState != null) {
            console.log("-----3");
            
            this.mCurrentState.OnLeave(newState, param1, param2);
        }
        var oldState = this.mCurrentState;
        this.mCurrentState = newState;
        newState.OnEnter(this, oldState, param1, param2);

        return true;
    }
    /**
    * @判断当前状态是不是某个状态
    * @状态id
    * @是不是
    */
    public IsInState(stateId: number): boolean {
        return this.mCurrentState == null ? false : this.mCurrentState.GetStateID() == stateId;
    }

    public OnUpdate(): void {
        if (this.mCurrentState != null) {
            this.mCurrentState.OnUpdate();
        }
    }
    public OnFixedUpdate(): void {
        if (this.mCurrentState != null) {
            this.mCurrentState.OnFixedUpdate();
        }
    }
    public OnLeteUpdate(): void {
        if (this.mCurrentState != null) {
            this.mCurrentState.OnleteUpdate();
        }
    }
    /**判断状态Dic中是否存在状态key */
    public HasHey(stateId: number): boolean {
        for(let key in this.mStateDic)
        {
            if(Number(key)==stateId)
            {
                return true ;
            }
        }
        return false;
    }
    /**向数组添加一组元素 */
    public AddState(dic, state: IState) {
        console.log("添加状态"+state);
        dic[state.GetStateID()]=state;
    }
    /**移除数组的一个元素 */
    public DicRemove(Dic, stateId: number): void {
        for (var i = 0; i < Dic.length; i++) {
            if (Dic[i].key == stateId) {
                Dic.splice(i, 1);
            }
        }
    }
     /**通过id查找状态 */
     public GetState(stateId: number): IState {
        for(let key in this.mStateDic)
        {
            if(Number(key)==stateId)
            {
                return this.mStateDic[key];
            }
        }

        console.log("没有查找到状态",stateId);
        
        return null;
    }
}