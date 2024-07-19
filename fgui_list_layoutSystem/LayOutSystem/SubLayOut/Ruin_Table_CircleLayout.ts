import { ILayOut } from "../ILayOut";

export class Ruin_Table_CircleLayout implements ILayOut {
    public setData(data: any) { throw new Error("Method not implemented."); }

    public getLayOutPos(index: number): number[] {
        const rad = 45;
        const distance = 190;
        const x = distance * Math.sin(rad * index / 180 * Math.PI);
        const y = distance * Math.cos(rad * index / 180 * Math.PI);
        return [x, y];
    }
}