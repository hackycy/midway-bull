import { QueueOptions } from 'bull';
import { saveModule, saveClassMetadata } from '@midwayjs/core';
import { MODULE_TASK_QUEUE_KEY, MODULE_TASK_QUEUE_OPTIONS } from '../const';

export function Queue(options: QueueOptions | string, on?: string[]) {
  return function (target) {
    saveModule(MODULE_TASK_QUEUE_KEY, target);
    saveClassMetadata(
      MODULE_TASK_QUEUE_OPTIONS,
      {
        options,
        on,
        name: target.name,
      },
      target
    );
  };
}
