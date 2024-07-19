import { ILayOut } from "../ILayOut";

export class PostRewardLayout implements ILayOut {
    setData(data: any) {
        throw new Error("Method not implemented.");
    }

    public getLayOutPos(index: number): number[] {
        let x
        let y
        let offsetX = index % 2 == 1 ? 160 : 0
        if (index % 2 == 1) {
            y = 390
            let i = (index / 2).toString().splitNum(".")[0]
            x = i * 811 + offsetX
        } else {
            y = 0
            x = index / 2 * 811
        }
        return [x, y];

    }
}