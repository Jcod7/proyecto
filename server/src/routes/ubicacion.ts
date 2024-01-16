import { Router } from 'express';
import { obtenerUbicacion, crearUbicacion } from '../controlers/ubicacion';

import validateToken from './validate-token';

const router = Router();

router.get('/', validateToken,obtenerUbicacion);

router.post('/', validateToken,crearUbicacion);


export default router;