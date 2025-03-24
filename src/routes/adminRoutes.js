import express from 'express';
import { changeRoleToAdmin, listAdmins, changeRoleFromAdminToClient } from '../controllers/adminController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { authorizeAdmin } from '../middlewares/authorizeAdmin.js';

const router = express.Router();

router.post('/', verifyToken, authorizeAdmin,
    // #swagger.tags = ['Admin']
    changeRoleToAdmin
  );
  
  router.get('/', verifyToken, authorizeAdmin,
    // #swagger.tags = ['Admin']
    listAdmins
  );
  
  router.delete('/:id', verifyToken, authorizeAdmin,
    // #swagger.tags = ['Admin']
    changeRoleFromAdminToClient
  );


export default router;