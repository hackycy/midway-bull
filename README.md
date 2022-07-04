# midway-bull (Deprecated)

请使用官方包代替：[@midwayjs/task@3](https://midwayjs.org/docs/extensions/task)

[![NPM version][npm-image]][npm-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/midway-bull.svg?style=flat-square
[npm-url]: https://npmjs.org/package/midway-bull
[download-image]: https://img.shields.io/npm/dm/midway-bull.svg?style=flat-square
[download-url]: https://npmjs.org/package/midway-bull

[bull](https://github.com/OptimalBits/bull) component for MidwayJs.

## 安装

```bash
$ npm i --save midway-bull
$ npm i --save-dev @types/bull
```

## 使用方法

在`configuration.ts`导入子组件

```typescript
import * as bull from 'midway-bull';

@Configuration({
  imports: [bull],
})
export class ContainerLifeCycle implements ILifeCycle {}
```

## 配置

在`config.${env}.ts`中配置对应信息，与代码配置队列名一一对应

```typescript
export const bull = {
  SysTask: {
    redis: {
      port: 6379,
      host: '127.0.0.1',
      password: '123456',
      db: 0,
    },
    prefix: 'admin:task',
  },
};
```

## 代码编写

**定义队列**

``` typescript
import { IMidwayWebApplication } from '@midwayjs/web';
import { IQueue, Queue } from 'midway-bull';
import { App, Provide } from '@midwayjs/decorator';

/**
 * 第一个参数对应配置文件中的key，支持string或者直接为QueueOptions配置对象
 * 第二参数为需要监听队列触发的event事件，该项不注册则不会回调onEvent
 */
@Queue('SysTask', ['completed'])
@Provide()
export class SysTaskQueue implements IQueue {
  @App()
  app: IMidwayWebApplication;

  async excute(data: any): Promise<void> {
    // exec something
  }

  onEvent(e: string, ...args: any[]): void {
    // on event
  }
}
```

**获取队列**

``` typescript
import { App, Inject, Provide } from '@midwayjs/decorator';
import { BullService } from 'midway-bull';
import { SysTaskQueue } from './sys-task'

@Provide()
export class AdminSysTaskService extends BaseService {
  @Inject('bull:bullService')
  bullService: BullService;

  @App()
  app: IMidwayApplication;

  async addTask() {
    // 3秒后触发分布式任务调度。
    await this.bullService.excute(SysTaskQueue, { name: '' }, { delay: 3000 })
  }

  async getQueue() {
    return this.bullService.getQueue(SysTaskQueue)
  }
}
```

