import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnalysisService } from './analysis.service';
import { AnalyseJobDto } from './dtos/analyse-job.dto';
import { AnalyseCvDto } from './dtos/analyze-cv.dto';

@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('job')
  async analyzeJob(@Body() analyzeJobDto: AnalyseJobDto) {
    return this.analysisService.analyzeJob(analyzeJobDto.jobDescription);
  }


  @Post('cv')
  @UseInterceptors(FileInterceptor('cvFile'))
  async analyzeCv(
    @UploadedFile() file: Express.Multer.File,
    @Body() analyzeCvDto: AnalyseCvDto,
  ) {
    return this.analysisService.analyzeCv(
      file,
      analyzeCvDto.keywords,
    );
  }
}
