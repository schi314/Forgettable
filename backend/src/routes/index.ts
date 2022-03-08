import { Router } from 'express';
import person from './person.route';
import encounter from './encounter.route';

const routes = Router();

routes.use('/api/person', person);
routes.use('/api/encounters', encounter);

export default routes;
