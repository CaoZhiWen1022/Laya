import { RuinsData } from "../../../model/RuinsData";
import { ILayOut } from "../ILayOut";

export class RuinsRoomLayOut implements ILayOut {
    setData(data: any) {
        throw new Error("Method not implemented.");
    }
    public getLayOutPos(index: number): number[] {
        const cfg_Rooms = RuinsData.ins.arr_Cfg_Rooms[index];
        const [posy, posx, width] = cfg_Rooms.position.splitNum("#");
        const x = posx * 480;
        const y = posy * 300;
        return [x, y];
    }
}