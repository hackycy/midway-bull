export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    bull?: {
      [propName: string]:
        | {
            redis: {
              port: number;
              host: string;
              username?: string;
              password?: string;
              db: number;
            };
          }
        | string;
      prefix: string;
    };
  }
}
