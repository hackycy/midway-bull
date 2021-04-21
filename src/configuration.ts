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
    const modules = listModule(MODULE_TASK_QUEUE_KEY);
    const queueMap = {};
    for (const module of modules) {
      const rule = getClassMetadata(MODULE_TASK_QUEUE_OPTIONS, module);
      const queueOptions =
        typeof rule.options === 'string'
          ? this.bullConfig[rule.options]
          : rule.options;
      // new queue
      const queue = new Bull(rule.name, queueOptions);
      // init
      const ctx = this.app.createAnonymousContext();
      const service: IQueue = await ctx.requestContext.getAsync(module);
      queue.process(async job => {
        await service.excute.call(service, job.data);
      });
      // resgiter custom event
      if (rule.on && Array.isArray(rule.on) && rule.on.length > 0) {
        for (const e of rule.on) {
          queue.on(e, (...args) => {
            service.onEvent.call(this, e, ...args);
          });
        }
      }
      queueMap[rule.name] = queue;
      this.queueList.push(queue);
    }
    container.registerObject('queueMap', queueMap);
  }
}
