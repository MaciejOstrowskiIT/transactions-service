import express, { Application, Router } from 'express';
import { Controller } from '../controllers/Controller';
import { Route } from '../routes/Route';
import { createRoutes } from '../routes';

export const registerRoutes = (app: Application, controller: Controller): void => {
  const router: Router = express.Router();
  const routes: Route[] = createRoutes(controller);
  routes.forEach((route: Route) => route.registerRoute(router));
  app.use(router);
};