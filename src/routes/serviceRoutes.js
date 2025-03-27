import express from 'express';
import { getAllServices, getServiceById, createService, updateService, deleteService, uploadImageMiddleware, getMyServices} from '../controllers/serviceController.js';
import { authorizeService } from '../middlewares/authorizeService.js';
import verifyToken from '../middlewares/verifyToken.js';


const router = express.Router();

router.get('/my', verifyToken, authorizeService, getMyServices
      // #swagger.tags = ['Serviços']
);

router.get('/', 
    // #swagger.tags = ['Serviços']
    getAllServices
  );
  
//   router.get('/:id', 
//     // #swagger.tags = ['Serviços']
//     getServiceById
//   );
  
  router.post('/', verifyToken, authorizeService, uploadImageMiddleware, 
    // #swagger.tags = ['Serviços']
    createService
  );
  
  router.put('/:id', verifyToken, authorizeService, 
    // #swagger.tags = ['Serviços']
    updateService
  );
  
  router.delete('/:id', verifyToken, authorizeService, 
    // #swagger.tags = ['Serviços']
    deleteService
  );



export default router;
