import { IsNotEmpty, IsString } from "class-validator";

export class AnalyseJobDto {
    @IsString()
    @IsNotEmpty()
    jobDescription: string
}
