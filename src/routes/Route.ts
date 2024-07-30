import { Handler, Method } from './types/types';
import express from 'express';

export class Route {
  constructor(
    private method: Method,
    private path: string,
    private handler: Handler,
  ) {}

  registerRoute(router: express.Router): void {
    router[this.method](this.path, this.handler);
  }
}