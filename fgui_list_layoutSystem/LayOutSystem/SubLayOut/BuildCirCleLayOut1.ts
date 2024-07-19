import { ILayOut } from "../ILayOut";

export class BuildCirCleLayOut1 implements ILayOut {
    setData(data: any) {
        throw new Error("Method not implemented.");
    }

    private IconPosArr: number[][] = [
        [540, -10],
        [600, -140],
        [490, -95],
        [430, 20],
        [100, 45],
        [-150, 45],
        [-400, 45],
        [-650, 45],
        [-900, 45],
    ];

    public getLayOutPos(index: number): number[] {
        return this.IconPosArr[index];
    }
}
