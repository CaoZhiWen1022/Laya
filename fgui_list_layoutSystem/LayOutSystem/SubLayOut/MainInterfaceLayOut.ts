import { ILayOut } from "../ILayOut";

export class MainInterfaceLayOut implements ILayOut {
    setData(data: any) {
        throw new Error("Method not implemented.");
    }

    public getLayOutPos(index: number): number[] {
        let x
        let y
        if (index < 6) {
            x = 116 * (5 - index)
            y = 0
        } else {
            x = 116 * (11 - index)
            y = 117
        }
        return [x, y];

    }
}