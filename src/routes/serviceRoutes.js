import express from 'express';
import { getAllServices, getServiceById, createService, updateService, deleteService, uploadImageMiddleware} from '../controllers/serviceController.js';
import { authorizeService } from '../middlewares/authorizeService.js';
import verifyToken from '../middlewares/verifyToken.js';


const router = express.Router();


router.get('/', getAllServices);

router.get('/:id', getServiceById);

router.post('/', verifyToken, authorizeService, uploadImageMiddleware, createService);

router.put('/:id', verifyToken, authorizeService, updateService);

router.delete('/:id', verifyToken, authorizeService, deleteService);



export default router;
