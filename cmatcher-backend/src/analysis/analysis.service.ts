import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import * as pdfParse from 'pdf-parse';
import * as mammoth from 'mammoth';

@Injectable()
export class AnalysisService {
  private genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('Chave da API do Gemini não encontrada no .env');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async analyzeJob(jobDescription: string): Promise<{ keywords: string[] }> {
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `Você é um especialista em recrutamento de tecnologia. Analise a seguinte descrição de vaga e extraia as 15 habilidades, tecnologias e competências mais importantes. Retorne o resultado como um objeto JSON com uma única chave chamada "keywords", que contém uma lista de strings. Descrição da vaga: "${jobDescription}"`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().replace('```json', '').replace('```', '').trim();

      return JSON.parse(text);

    } catch (error) {
      console.error('Erro ao chamar a API do Gemini:', error);
      throw new InternalServerErrorException('Falha ao analisar a descrição da vaga.');
    }
  }

  async analyzeCv(
    file: Express.Multer.File,
    keywords: string[],
  ): Promise<any> {
    let cvText = '';

    if (file.mimetype === 'application/pdf') {
      const data = await pdfParse(file.buffer);
      cvText = data.text;
    } else if (
      file.mimetype ===
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      const { value } = await mammoth.extractRawText({ buffer: file.buffer });
      cvText = value;
    } else {
      throw new BadRequestException('Formato de arquivo não suportado. Use PDF ou DOCX.');
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
      const prompt = `
        Você é um assistente de carreira. Baseado na lista de palavras-chave de uma vaga e no texto de um currículo,
        calcule a porcentagem de compatibilidade e identifique quais palavras-chave estão faltando no currículo.
        O score deve ser baseado na quantidade de palavras-chave encontradas.
        Retorne um objeto JSON com as chaves "compatibilityScore" (um número de 0 a 100) e "missingKeywords" (uma lista de strings com as palavras que faltaram).

        Palavras-chave da vaga: ${JSON.stringify(keywords)}

        Texto do currículo: "${cvText}"
      `;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text().replace('```json', '').replace('```', '').trim();

      return JSON.parse(text);
    } catch (error) {
      console.error('Erro ao chamar a API do Gemini para análise de CV:', error);
      throw new InternalServerErrorException('Falha ao analisar o currículo.');
    }
  }
}
