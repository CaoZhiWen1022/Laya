import { ILayOut } from "../ILayOut";

export class BuildCirCleLayOut2 implements ILayOut {
    setData(data: any) {
        throw new Error("Method not implemented.");
    }

    private IconPosArr: number[][] = [
        [0, 10],
        [290, 55],
        [370, 55],
        [450, 55],
        [530, 55],
    ];

    public getLayOutPos(index: number): number[] {
        return this.IconPosArr[index];
    }
}
