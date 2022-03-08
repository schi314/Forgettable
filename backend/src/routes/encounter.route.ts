import { Router } from 'express';
import { createEncounter } from '../controllers/encounter.controller';

const routes = Router();

routes.post('/create', createEncounter);

export default routes;