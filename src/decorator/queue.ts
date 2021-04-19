import { QueueOptions } from 'bull';
import { saveModule, saveClassMetadata } from '@midwayjs/core';
import { MODULE_TASK_QUEUE_KEY, MODULE_TASK_QUEUE_OPTIONS } from '../const';

export function Queue(name: string, options?: QueueOptions) {
  return function (target) {
    saveModule(MODULE_TASK_QUEUE_KEY, target);
    saveClassMetadata(
      MODULE_TASK_QUEUE_OPTIONS,
      {
        options,
        name,
      },
      target
    );
  };
}
