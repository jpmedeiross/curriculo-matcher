import { Controller, Post, Body } from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { AnalyseJobDto } from './dtos/analyse-job.dto';


@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Post('job')
  async analyzeJob(@Body() analyzeJobDto: AnalyseJobDto) {
    return this.analysisService.analyzeJob(analyzeJobDto.jobDescription);
  }
}
