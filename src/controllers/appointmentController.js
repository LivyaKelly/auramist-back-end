import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


export async function createAppointment(req, res) {

  try {
    const { clientId, professionalId, serviceId, date, time } = req.body;

    if (!clientId || !professionalId || !serviceId || !date || !time) {
      return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios.' });
    }
  

    const client = await prisma.user.findUnique({ where: { id: parseInt(clientId) } });
    if (!client) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado.' });
    }


    const professional = await prisma.user.findUnique({ where: { id: parseInt(professionalId) } });
    if (!professional) {
      return res.status(404).json({ mensagem: 'Profissional não encontrado.' });
    }


    const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
    if (!service) {
      return res.status(404).json({ mensagem: 'Serviço não encontrado.' });
    }

    
    const conflict = await prisma.appointment.findFirst({
      where: {
        professionalId: parseInt(professionalId),
        date: new Date(date),
        time: time
      }
    });
    if (conflict) {
      return res.status(400).json({
        mensagem: 'Já existe um agendamento para esse profissional na data e hora especificadas.'
      });
    }

    
    const newAppointment = await prisma.appointment.create({
      data: {
        clientId: parseInt(clientId),
        professionalId: parseInt(professionalId),
        serviceId: parseInt(serviceId),
        date: new Date(date),
        time,
        status: 'PENDENTE', 
      }
    });

    return res.status(201).json({
      mensagem: 'Agendamento criado com sucesso!',
      agendamento: newAppointment
    });
  } catch (err) {
    console.log('Error creating appointment:', err);
    return res.status(500).json({ mensagem: 'Erro ao criar agendamento.', error: err });
  }
}



export async function getAllAppointments(req, res) {

  try {
    const appointments = await prisma.appointment.findMany();
    return res.status(200).json({
      mensagem: 'Lista de agendamentos',
      agendamentos: appointments
    });
  } catch (err) {
    console.log('Error listing appointments:', err);
    return res.status(500).json({ mensagem: 'Erro ao listar agendamentos.', error: err });
  }
}



export async function getAppointmentById(req, res) {
  
  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    const appointment = await prisma.appointment.findUnique({
      where: { id }
    });

    if (!appointment) {
      return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
    }

    return res.status(200).json({
      mensagem: 'Agendamento encontrado.',
      agendamento: appointment
    });
  } catch (err) {
    console.log('Error fetching appointment:', err);
    return res.status(500).json({ mensagem: 'Erro ao buscar agendamento.', error: err });
  }
}



export async function updateAppointment(req, res) {

  try {
    const id = parseInt(req.params.id);
    const { date, time, status } = req.body;

    if (!id) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
    }


    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: date ? new Date(date) : appointment.date,
        time: time || appointment.time,
        status: status || appointment.status
      }
    });

    return res.status(200).json({
      mensagem: 'Agendamento atualizado com sucesso!',
      agendamento: updatedAppointment
    });
  } catch (err) {
    console.log('Error updating appointment:', err);
    return res.status(500).json({ mensagem: 'Erro ao atualizar agendamento.', error: err });
  }
}



export async function deleteAppointment(req, res) {

  try {
    const id = parseInt(req.params.id);
    if (!id) {
      return res.status(400).json({ mensagem: 'ID inválido.' });
    }

    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ mensagem: 'Agendamento não encontrado.' });
    }

    await prisma.appointment.delete({ where: { id } });

    return res.status(200).json({ mensagem: 'Agendamento cancelado com sucesso!' });
  } catch (err) {
    console.log('Error canceling appointment:', err);
    return res.status(500).json({ mensagem: 'Erro ao cancelar agendamento.', error: err });
  }
};
