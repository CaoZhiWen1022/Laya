import { StateMachine } from "./StateMachine";

export interface IState{
    /**获取这个状态机的状态 */
    GetStateID():number;
    /**
     * @进入这个状态
     * @param machine 状态机
     * @param prevState 上一个状态
     * @param param1 参数1
     * @param param2 参数2
     */
    OnEnter( machine:StateMachine,  prevState:IState,  param1:object,  param2:object);
    /**
     * 离开这个状态
     * @param nextState 下一个要进入的状态
     * @param param1 参数1
     * @param param2 参数2
     */
    OnLeave( nextState:IState,  param1:object,  param2:object);
    OnUpdate();
    OnFixedUpdate();
    OnleteUpdate();
}