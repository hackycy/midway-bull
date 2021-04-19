import { Inject, Provide } from '@midwayjs/decorator';
import { Queue, JobOptions } from 'bull';

@Provide()
export class BullService {
  @Inject('queueMap')
  queueMap;

  async excute(queueName: any, data: any, options: JobOptions) {
    const queue = this.queueMap[queueName.constructor.name] as Queue;
    return await queue.add(data, options);
  }

  getQueue(queueName: any): Queue {
    return this.queueMap[queueName.constructor.name] as Queue;
  }
}
