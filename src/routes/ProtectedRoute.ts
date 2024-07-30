import { Route } from './Route';
import { Handler, Method, Middleware } from './types/types';
import { authenticateToken } from '../middleware/jwt';

export class ProtectedRoute extends Route {
  constructor(method: Method, path: string, handler: Handler, protectedAuthMiddleware: Middleware = authenticateToken) {
    super(method, path, handler);
  }
}
