import { Enum_Temp } from "../../../core/template/Enum_Temp";
import { TemplateReader } from "../../../core/template/TemplateReader";
import { ILayOut } from "../ILayOut";

export class FormationLayOut implements ILayOut {
    private mapID: string;
    public setData(data: string) { this.mapID = data; }
    public getLayOutPos(index: number): number[] {
        return TemplateReader.getTemplateById<cfg.battlemap>(Enum_Temp.battlemap, this.mapID).heropos.split("|")[index].splitNum("#");
    }
}