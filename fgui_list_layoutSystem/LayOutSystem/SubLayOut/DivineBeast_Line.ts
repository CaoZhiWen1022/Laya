import { Enum_Temp } from "../../../core/template/Enum_Temp";
import { TemplateReader } from "../../../core/template/TemplateReader";
import { ILayOut } from "../ILayOut";

export class DivineBeast_Line implements ILayOut {
    private animalsoul: string;
    public setData(data: string) { this.animalsoul = data; }
    public getLayOutPos(index: number): number[] {
        const cfg = TemplateReader.getTemplateArray<cfg.animalsoul>(Enum_Temp.animalsoul, { animal: this.animalsoul })[index];
        return cfg.coordiante.split("|")[0].splitNum("#");
    }
}