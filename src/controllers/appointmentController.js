import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// const UPDATE_DEADLINE_MS = 24 * 60 * 60 * 1000;

export const createAppointment = async (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'customer') {
    return res.status(403).json({ error: 'Somente clientes podem agendar compromissos.' });
  }
  const { serviceId, professionalId, date, time } = req.body;
  if (!serviceId || !professionalId || !date || !time) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios (exceto status).' });
  }
  const service = await prisma.service.findUnique({ where: { id: parseInt(serviceId) } });
  if (!service) {
    return res.status(400).json({ error: 'Serviço não existe.' });
  }
  const professional = await prisma.professional.findUnique({ where: { id: parseInt(professionalId) } });
  if (!professional) {
    return res.status(400).json({ error: 'Profissional não existe.' });
  }
  const appointmentConflict = await prisma.appointment.findFirst({
    where: {
      professionalId: parseInt(professionalId),
      date: new Date(date),
      time: time
    }
  });
  if (appointmentConflict) {
    return res.status(400).json({ error: 'Já existe um compromisso agendado para esse profissional na data e hora especificadas.' });
  }
  try {
    const newAppointment = await prisma.appointment.create({
      data: {
        userId: parseInt(user.id),
        professionalId: parseInt(professionalId),
        serviceId: parseInt(serviceId),
        date: new Date(date),
        time,
        status: 'PENDENTE'
      }
    });
    return res.status(201).json(newAppointment);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao criar compromisso.' });
  }
};

export const getAllAppointments = async (req, res) => {
  const user = req.user;
  if (!user || (user.role !== 'admin' && user.role !== 'professional')) {
    return res.status(403).json({ error: 'Somente administradores e profissionais podem listar todos os compromissos.' });
  }
  try {
    const appointments = await prisma.appointment.findMany();
    return res.status(200).json(appointments);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar compromissos.' });
  }
};

export const getAppointmentById = async (req, res) => {
  const user = req.user;
  if (!user) {
    return res.status(403).json({ error: 'Não autorizado.' });
  }
  const id = parseInt(req.params.id);
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ error: 'Compromisso não encontrado.' });
    }
    if (user.role === 'customer' && appointment.userId !== parseInt(user.id)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    if (user.role === 'professional' && appointment.professionalId !== parseInt(user.id)) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    return res.status(200).json(appointment);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar compromisso.' });
  }
};

export const updateAppointment = async (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'customer') {
    return res.status(403).json({ error: 'Somente o cliente que agendou pode atualizar o compromisso.' });
  }
  const id = parseInt(req.params.id);
  const { date, time, status } = req.body;
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ error: 'Compromisso não encontrado.' });
    }
    if (appointment.userId !== parseInt(user.id)) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode atualizar seus próprios compromissos.' });
    }
    const now = new Date();
    const appointmentDate = new Date(appointment.date);
    if (appointmentDate.getTime() - now.getTime() < UPDATE_DEADLINE_MS) {
      return res.status(400).json({ error: 'O prazo para atualização expirou.' });
    }
    const updatedAppointment = await prisma.appointment.update({
      where: { id },
      data: {
        date: date ? new Date(date) : appointment.date,
        time: time || appointment.time,
        status: status || appointment.status
      }
    });
    return res.status(200).json(updatedAppointment);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao atualizar compromisso.' });
  }
};

export const deleteAppointment = async (req, res) => {
  const user = req.user;
  if (!user || user.role !== 'customer') {
    return res.status(403).json({ error: 'Somente o cliente que agendou pode cancelar o compromisso.' });
  }
  const id = parseInt(req.params.id);
  try {
    const appointment = await prisma.appointment.findUnique({ where: { id } });
    if (!appointment) {
      return res.status(404).json({ error: 'Compromisso não encontrado.' });
    }
    if (appointment.userId !== parseInt(user.id)) {
      return res.status(403).json({ error: 'Acesso negado. Você só pode cancelar seus próprios compromissos.' });
    }
    await prisma.appointment.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao cancelar compromisso.' });
  }
};
