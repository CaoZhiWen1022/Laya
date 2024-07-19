export interface ILayOut {
    getLayOutPos(index: number): number[];
    /**部分LayOut需要再调用之前设置一些东西 */
    setData(data: string);
}