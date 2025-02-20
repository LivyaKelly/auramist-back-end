import express from 'express';
import { addAdmin, listAdmins, deleteAdmin } from '../controllers/adminController.js';
import verifyToken from '../middlewares/verifyToken.js';
import { authorizeAdmin } from '../middlewares/authorizeAdmin.js';

const router = express.Router();


router.post('/', verifyToken, authorizeAdmin, addAdmin);


router.get('/', verifyToken, authorizeAdmin, listAdmins);


router.delete('/:id', verifyToken, authorizeAdmin, deleteAdmin);


export default router;