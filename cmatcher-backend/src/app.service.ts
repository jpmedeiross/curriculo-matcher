import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getTeste(): { message: string } {
    return { message: 'teste' }
  }
}
