import {
  App,
  Config,
  Configuration,
  getClassMetadata,
  listModule,
} from '@midwayjs/decorator';
import { IMidwayApplication, IMidwayContainer } from '@midwayjs/core';
import * as Bull from 'bull';
import { Queue } from 'bull';
import { MODULE_TASK_QUEUE_KEY, MODULE_TASK_QUEUE_OPTIONS } from './const';
import { IQueue } from './type';

@Configuration({
  namespace: 'bull',
})
export class AutoConfiguration {
  @App()
  app: IMidwayApplication;

  @Config('bull')
  bullConfig: any;

  queueList: Queue[] = [];

  async onReady(container: IMidwayContainer): Promise<void> {
    await this.loadQueue(container);
  }

  async onStop(): Promise<void> {
    this.queueList.forEach(q => {
      q.close();
    });
  }

  async loadQueue(container: IMidwayContainer): Promise<void> {
    const event = [
      'error',
      'waiting',
      'active',
      'stalled',
      'progress',
      'completed',
      'failed',
      'paused',
      'resumed',
      'removed',
      'cleaned',
      'drained',
    ];
    const modules = listModule(MODULE_TASK_QUEUE_KEY);
    const queueMap = {};
    for (const module of modules) {
      const rule = getClassMetadata(MODULE_TASK_QUEUE_OPTIONS, module);
      // new queue
      const queue = new Bull(
        rule.name,
        rule.options ?? this.bullConfig[rule.name]
      );
      // init
      const ctx = this.app.createAnonymousContext();
      const service: IQueue = await ctx.requestContext.getAsync(module);
      queue.process(async job => {
        await service.excute.call(service, job.data);
      });
      for (const e of event) {
        queue.on(e, (...args) => {
          service.onEvent(e, ...args);
        });
      }
      queueMap[rule.name] = queue;
      this.queueList.push(queue);
    }
    container.registerObject('queueMap', queueMap);
  }
}
