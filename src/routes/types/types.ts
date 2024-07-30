import express from 'express';

export type Middleware = express.RequestHandler | express.RequestHandler[];
export type Handler = express.RequestHandler;
export type Method = 'get' | 'post' | 'put' | 'delete';