import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class AnalysisService {
  private genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    this.genAI = new GoogleGenerativeAI(
      this.configService.get<any>('GEMINI_API_KEY'),
    );
  }

  async analyzeJob(jobDescription: string): Promise<{ keywords: string[] }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `Você é um especialista em recrutamento de tecnologia. Analise a seguinte descrição de vaga e extraia as 15 habilidades, tecnologias e competências mais importantes. Retorne o resultado como um objeto JSON com uma única chave chamada "keywords", que contém uma lista de strings. Descrição da vaga: "${jobDescription}"`;

      const result = await model.generateContent(prompt);
      const response = result.response;

      const text = response.text().replace('```json', '').replace('```', '').trim();

      const data = JSON.parse(text);

      return data;
    } catch (error) {
      console.error('Erro ao chamar a API do Gemini:', error);
      throw new Error('Falha ao analisar a descrição da vaga.');
    }
  }
}
