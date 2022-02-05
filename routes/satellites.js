import express from 'express';
import {
  getSatellites, updateSatellites, getSatellite, getSatellitesWithin,
} from '../controllers/satellites.js';

import {query} from 'express-validator';


const router = express.Router();

router.get(
    '/',
    query('name').not().isEmpty(),
    query('limit').if(query('limit').not().isEmpty()).isInt(),
    getSatellite,
);
router.get('/all', getSatellites);
// could develop auth for the next endpoint
// router.post('/refresh', updateSatellites);
router.get(
    '/within',
    query('l1').notEmpty().isFloat(),
    query('l2').notEmpty().isFloat(),
    query('d').notEmpty().isFloat(),
    getSatellitesWithin,
);
export default router;
