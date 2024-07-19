import { ILayOut } from "../ILayOut";

export class CirCleLayOut implements ILayOut {
    setData(data: any) {
        throw new Error("Method not implemented.");
    }
    public getLayOutPos(index: number): number[] {
        let rad = 30;
        const x = 100 * Math.sin(rad * index / 180 * Math.PI);
        const y = 100 * Math.cos(rad * index / 180 * Math.PI);
        return [x, y];
    }
}