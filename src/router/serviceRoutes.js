import express from 'express';
import { getAllServices, getServiceById, createService, updateService, deleteService, } from '../controllers/serviceController.js';

const router = express.Router();

router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.post('/services', createService);
router.put('/services/:id', updateService);
router.delete('/services/:id', deleteService);

export default router;
