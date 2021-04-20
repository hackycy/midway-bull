export interface IQueue {
  excute(data): Promise<void>;
  onEvent(event: string, ...args: any[]): void | Promise<void>;
}
