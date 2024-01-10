import { PieceBase } from "./PieceScripts/PieceBase";

export class AStar {

    /**
     * 找到从给定的起点到终点的路径。如果找不到路径，则return 一个空列表。
     * @param startPoint 起点
     * @param endPoint 终点
     * @param isNoWalkRun 不可行走时是否返回结果
     * @returns 
     */
    public static FindPath(startPoint: PieceBase, endPoint: PieceBase, isNoWalkRun = false):PieceBase[] {
        let openPathTiles: PieceBase[] = []
        let closedPathTiles: PieceBase[] = []

        let currentTile = startPoint;

        currentTile.g = 0;
        currentTile.h = ExploreAStar.getEstimatedPathCost({ x: startPoint.initParam.x, y: startPoint.initParam.y }, { x: endPoint.initParam.x, y: endPoint.initParam.y });

        openPathTiles.push(currentTile)


        while (openPathTiles.length != 0) {
            // 对打开的列表进行排序，以获得F值最低的那块地格。
            openPathTiles.sort((a, b) => { return a.F - b.F; })
            currentTile = openPathTiles[0];
            // 将当前地格从开放列表中移除，并将其添加到封闭列表中。
            openPathTiles.splice(openPathTiles.indexOf(currentTile), 1);
            closedPathTiles.push(currentTile);

            let g = currentTile.g + 1;
            if (closedPathTiles.indexOf(endPoint) != -1) {
                break;
            }


            for (let i = 0; i < currentTile.adjacentChunk.length; i++) {
                const chunk = currentTile.adjacentChunk[i];

                if (chunk.isWalk() == false) {
                    continue
                }

                if (closedPathTiles.indexOf(chunk) != -1) {
                    continue
                }

                // 如果它不在开放列表中--添加它并计算G和H。
                if (openPathTiles.indexOf(chunk) == -1) {
                    chunk.g = g;
                    chunk.h = ExploreAStar.getEstimatedPathCost({ x: chunk.initParam.x, y: chunk.initParam.y }, { x: endPoint.initParam.x, y: endPoint.initParam.y });
                    openPathTiles.push(chunk)
                }
            }
        }

        let finalPathTiles: PieceBase[] = [];

        //回溯--设置最终路径。
        if (closedPathTiles.indexOf(endPoint) != -1) {//目标点在路径中
            currentTile = endPoint;
            finalPathTiles.push(currentTile)
            for (let i = endPoint.g - 1; i >= 0; i--) {
                currentTile = closedPathTiles.find(x => x.g == i && currentTile.adjacentChunk.indexOf(x) != -1);
                finalPathTiles.push(currentTile);
            }
            finalPathTiles.reverse();
        } else if (isNoWalkRun) {//不包含目标点 但要返回路径
            //所有点按照距离排序，找到可到达的点
            closedPathTiles = closedPathTiles.filter(a => a.isWalk())
            closedPathTiles.sort((a, b) => ComFunConfig.getPointLength(startPoint.initParam.x, startPoint.initParam.y, a.initParam.x, a.initParam.y)
                - ComFunConfig.getPointLength(startPoint.initParam.x, startPoint.initParam.y, b.initParam.x, b.initParam.y)).sort((a, b) =>
                    ComFunConfig.getPointLength(endPoint.initParam.x, endPoint.initParam.y, a.initParam.x, a.initParam.y)
                    - ComFunConfig.getPointLength(endPoint.initParam.x, endPoint.initParam.y, b.initParam.x, b.initParam.y)
                )
            for (let i = 0; i < closedPathTiles.length; i++) {
                const element = closedPathTiles[i];
                let path = ExploreAStar.FindPath(startPoint, element);
                if (path.length > 0) return path;
            }
        }
        return finalPathTiles;
    }

    // <summary> //
    /// 从给定的起始位置到六角地格的目标位置的估计路径成本。
    // </summary>
    /// <param name="startPosition">起始位置。</param>。
    /// <param name="targetPosition">目标位置。</param>
    protected static getEstimatedPathCost(startPosition: { x, y }, targetPosition: { x, y }): number {
        let dx = startPosition.x - targetPosition.x;
        let dy = startPosition.y - targetPosition.y;
        let s = Math.sqrt(dx * dx + dy * dy);
        s = Math.abs(s);
        return s;
    }

}