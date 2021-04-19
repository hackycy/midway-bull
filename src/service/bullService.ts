import { Provide } from '@midwayjs/decorator';

@Provide()
export class BullService {

  async getBookById() {
    return 'hello world'
  }
}