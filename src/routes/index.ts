import { Route } from './Route';
import { Controller } from '../controllers/Controller';
import { ProtectedRoute } from './ProtectedRoute';


/* @formatter:off */
export const createRoutes = (transactionsController: Controller): Route[] => [

  // User routes
  new Route('get', '/get-transactions', (req, res ) => transactionsController.getTransactions(req, res)),
  new Route('post', '/set-permissions', transactionsController.createTransaction),
  new ProtectedRoute('get', '/transaction/:id', transactionsController.fetchSingleTransaction),
  new ProtectedRoute('post', '/transaction/correct/:id', transactionsController.correctSingleTransaction),
  new ProtectedRoute('get', '/user-details/:id', (req, res) => transactionsController.getUserDetails(req, res))
];
