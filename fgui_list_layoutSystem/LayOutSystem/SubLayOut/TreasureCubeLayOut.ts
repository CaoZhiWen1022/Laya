import { ILayOut } from "../ILayOut";

export class TreasureCubeLayOut implements ILayOut {
    setData(data: any) {
        throw new Error("Method not implemented.");
    }

    public getLayOutPos(index: number): number[] {
        let x
        let y
        if (index == 0) {
            x = 0
            y = 0
        } else if (index <= 4) {
            x = 201 * index
            y = 0
        } else if (index == 5) {
            x = 201 * (index - 5)
            y = 166 + 26

        } else if (index == 6) {
            x = 201 * 4
            y = 166 + 26
        }
        else {
            x = 201 * (index - 7)
            y = (166 + 26) * 2

        }
        return [x, y];

    }
}
