export * from './dist/index';

declare module '@midwayjs/core/dist/interface' {
  interface MidwayConfig {
    bull?: {
      default: {
        redis: {
          port: number;
          host: string;
          username?: string;
          password?: string;
          db: number;
        };
      };
      prefix: string;
    };
  }
}
