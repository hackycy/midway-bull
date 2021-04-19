import { Inject, Provide } from '@midwayjs/decorator';
import { Queue, JobOptions, Job } from 'bull';

@Provide()
export class BullService {
  @Inject('queueMap')
  queueMap;

  async excute<T>(
    queueName: string,
    data: T,
    options: JobOptions
  ): Promise<Job<T>> {
    const queue = this.queueMap[queueName] as Queue;
    return await queue.add(data, options);
  }

  getQueue(queueName: string): Queue {
    return this.queueMap[queueName] as Queue;
  }
}
