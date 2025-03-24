import express from 'express';
import { getAllAppointments, getAppointmentById, createAppointment, updateAppointment, deleteAppointment } from '../controllers/appointmentController.js';
import { authorizeAppointment } from '../middlewares/authorizeAppointment.js';
import verifyToken from '../middlewares/verifyToken.js';

const router = express.Router();

router.get('/',
    // #swagger.tags = ['Agendamentos']
    getAllAppointments
  );
  
  router.get('/:id',
    // #swagger.tags = ['Agendamentos']
    getAppointmentById
  );
  
  router.post('/', verifyToken, authorizeAppointment,
    // #swagger.tags = ['Agendamentos']
    createAppointment
  );
  
  router.put('/:id', verifyToken, authorizeAppointment,
    // #swagger.tags = ['Agendamentos']
    updateAppointment
  );
  
  router.delete('/:id', verifyToken, authorizeAppointment,
    // #swagger.tags = ['Agendamentos']
    deleteAppointment
  );


export default router;
