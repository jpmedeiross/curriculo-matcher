import { IsArray, IsString } from "class-validator";

export class AnalyseCvDto {

    @IsArray()
    @IsString({ each: true })
    keywords: string[]
}
