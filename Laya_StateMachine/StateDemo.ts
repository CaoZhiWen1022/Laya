import { IState } from "./IState";
import { StateMachine } from "./StateMachine";

enum PlayerState
{
    a=0,
    b=1,
    c=2
}
export default class StateDemo extends Laya.Script {
    public PlayerStateMachine:StateMachine=new StateMachine();
    public monkey:Laya.Image;
    constructor() { super(); }
    onAwake():void
    {        
        this.monkey=this.owner.getChildByName("monkey") as Laya.Image;
        this.PlayerStateMachine.RegisterState(new aState(this,this.monkey));
        this.PlayerStateMachine.RegisterState(new bState(this,this.monkey));
        this.PlayerStateMachine.RegisterState(new cState(this,this.monkey));
        
        this.InitBtn();
    }
    InitBtn():void
    {
        let a_Btn=new Laya.Button("comp/button.png");
        Laya.stage.addChild(a_Btn);
        a_Btn.label="状态A";
        a_Btn.on(Laya.Event.CLICK,this,this.SwitchStateToA);
        let b_Btn=new Laya.Button("comp/button.png");
        Laya.stage.addChild(b_Btn);
        b_Btn.label="状态B";
        b_Btn.y=50;
        b_Btn.on(Laya.Event.CLICK,this,this.SwitchStateToB);

        let c_Btn=new Laya.Button("comp/button.png");
        Laya.stage.addChild(c_Btn);
        c_Btn.label="状态C";
        c_Btn.y=100;
        c_Btn.on(Laya.Event.CLICK,this,this.SwitchStateToC);

    }
    onStart():void
    {
        this.PlayerStateMachine.SwitchState(PlayerState.a, null, null);
    }
    onUpdate():void
    {
        this.PlayerStateMachine.OnUpdate();
    }
    SwitchStateToA():void
    {
        this.PlayerStateMachine.SwitchState(PlayerState.a, null, null);
    }
    SwitchStateToB():void
    {
        this.PlayerStateMachine.SwitchState(PlayerState.b, null, null);
    }
    SwitchStateToC():void
    {
        this.PlayerStateMachine.SwitchState(PlayerState.c, null, null);
    }
}
export class aState implements IState{
    private mPlayer:StateDemo=null;
    private mMonkey:Laya.Image;
    constructor(player:StateDemo,monkey:Laya.Image){
        this.mPlayer=player;
        this.mMonkey=monkey;
    }
    GetStateID(): number {
        return PlayerState.a;
    }
    OnEnter(machine: StateMachine, prevState: IState, param1: object, param2: object) {
        console.log("进入状态A,设置猴子默认值");
        this.mMonkey.rotation=0;
        Laya.Tween.to(this.mMonkey,{scaleX:1,scaleY:1},300);
    }
    OnLeave(nextState: IState, param1: object, param2: object) {
        console.log("离开状态A");
        
    }
    OnUpdate() {        
    }
    OnFixedUpdate() {

    }
    OnleteUpdate() {
    }
}
export class bState implements IState{
    private mPlayer:StateDemo=null;
    private mMonkey:Laya.Image;
    private monkeyRoatation_Tween:Laya.Tween;
    constructor(player:StateDemo,monkey:Laya.Image){
        this.mPlayer=player;
        this.mMonkey=monkey;
    }
    GetStateID(): number {
        return PlayerState.b;
    }
    OnEnter(machine: StateMachine, prevState: IState, param1: object, param2: object) {
        console.log("进入状态b,开始旋转"); 
        this.mMonkey.rotation=0;
        this.MonkeyRotation();
    }
    MonkeyRotation(): void {
        this.monkeyRoatation_Tween=Laya.Tween.to(this.mMonkey, { rotation: 360 },500, Laya.Ease.linearIn);
        this.monkeyRoatation_Tween.repeat=0;
    }
    OnLeave(nextState: IState, param1: object, param2: object) {
        console.log("离开状态b");
        this.monkeyRoatation_Tween.clear();
    }
    OnUpdate() {
        
    }
    OnFixedUpdate() {

    }
    OnleteUpdate() {
    }
}
export class cState implements IState{
    private mPlayer:StateDemo=null;
    private mMonkey:Laya.Image;
    private monkeyScale_Tween:Laya.Tween;
    constructor(player:StateDemo,monkey:Laya.Image){
        this.mPlayer=player;
        this.mMonkey=monkey;
    }
    GetStateID(): number {
        return PlayerState.c;
    }
    OnEnter(machine: StateMachine, prevState: IState, param1: object, param2: object) {
        console.log("进入状态c开始缩放");
        this.MonkeyScale();
    }
    MonkeyScale(): void {
        this.monkeyScale_Tween=Laya.Tween.to(this.mMonkey, { scaleX:0,scaleY:0 },500, Laya.Ease.linearIn);
        this.monkeyScale_Tween.repeat=0;
    }
    OnLeave(nextState: IState, param1: object, param2: object) {
        console.log("离开状态c");
        this.monkeyScale_Tween.clear();
    }
    OnUpdate() {
        
    }
    OnFixedUpdate() {

    }
    OnleteUpdate() {
    }
}