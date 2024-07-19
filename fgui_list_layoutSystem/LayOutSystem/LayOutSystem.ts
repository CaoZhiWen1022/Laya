import { ILayOut } from "./ILayOut";
import { BuildCirCleLayOut1 } from "./SubLayOut/BuildCirCleLayOut1";
import { BuildCirCleLayOut2 } from "./SubLayOut/BuildCirCleLayOut2";
import { CirCleLayOut } from "./SubLayOut/CirCleLayOut";
import { DivineBeast_Line } from "./SubLayOut/DivineBeast_Line";
import { DivineBeast_Node } from "./SubLayOut/DivineBeast_Node";
import { FormationLayOut } from "./SubLayOut/FormationLayOut";
import { MainInterfaceLayOut } from "./SubLayOut/MainInterfaceLayOut";
import { PostRewardLayout } from "./SubLayOut/PostRewardLayout";
import { Ruin_Table_CircleLayout } from "./SubLayOut/Ruin_Table_CircleLayout";
import { RuinsRoomLayOut } from "./SubLayOut/RuinsRoomLayOut";
import { TreasureCubeLayOut } from "./SubLayOut/TreasureCubeLayOut";

export class LayOutSystem {
    private static _instance: LayOutSystem;
    public static get instance(): LayOutSystem {
        !LayOutSystem._instance && (LayOutSystem._instance = new LayOutSystem());
        return LayOutSystem._instance;
    }
    private map_LayOut: Map<number, ILayOut> = new Map();
    private constructor() {
        const t = this;
        t.map_LayOut.set(LayOut.TestLayOut, new CirCleLayOut());
        t.map_LayOut.set(LayOut.BuildLayOut1, new BuildCirCleLayOut1());
        t.map_LayOut.set(LayOut.BuildLayOut2, new BuildCirCleLayOut2());
        t.map_LayOut.set(LayOut.RuinsRoom, new RuinsRoomLayOut());
        t.map_LayOut.set(LayOut.RubeItem, new TreasureCubeLayOut());
        t.map_LayOut.set(LayOut.MainInterface, new MainInterfaceLayOut());
        t.map_LayOut.set(LayOut.Formation, new FormationLayOut());
        t.map_LayOut.set(LayOut.PostReward, new PostRewardLayout());
        t.map_LayOut.set(LayOut.Ruin_Table_Circle, new Ruin_Table_CircleLayout());
        t.map_LayOut.set(LayOut.DivineBeast_Node, new DivineBeast_Node());
        t.map_LayOut.set(LayOut.DivineBeast_Line, new DivineBeast_Line());
    }
    public getLayOut(layOut: LayOut, index: number): number[] { return this.map_LayOut.get(layOut).getLayOutPos(index); }
    public setData(layOut: LayOut, data: string) { this.map_LayOut.get(layOut).setData(data); }
}
/**从6号开始，因为5以下的layout是fairyGUI自己占用的 */
export enum LayOut {
    /**示例Layout，这个Layout用于给同学们参考，没有地方进行使用，如果同学们要用务必修改这段注释 */
    TestLayOut = 6,
    BuildLayOut1 = 7,
    BuildLayOut2 = 8,
    /**废墟房间排列 */
    RuinsRoom = 9,
    /**寻宝序列 */
    RubeItem = 10,
    MainInterface = 11,
    /**布阵排列 */
    Formation,
    /** 悬赏列表排列 */
    PostReward,
    /**废墟转盘 */
    Ruin_Table_Circle,
    /**基因节点 */
    DivineBeast_Node,
    /**基因线 */
    DivineBeast_Line,
}