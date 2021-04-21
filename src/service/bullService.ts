import { Inject, Provide } from '@midwayjs/decorator';
import { Queue, JobOptions, Job } from 'bull';

@Provide()
export class BullService {
  @Inject('queueMap')
  queueMap;

  async excute<T>(iqueue: any, data: T, options: JobOptions): Promise<Job<T>> {
    const queue = this.queueMap[iqueue.name] as Queue;
    return await queue.add(data, options);
  }

  getQueue(iqueue: any): Queue {
    return this.queueMap[iqueue.name] as Queue;
  }
}
