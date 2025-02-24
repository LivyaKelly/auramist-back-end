import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const getAllServices = async (req, res) => {
    try {
      const services = await prisma.service.findMany();
      res.json(services);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar serviços' });
    }
};

export const getServiceById = async (req, res) => {
    const serviceId = parseInt (req.params.id);
    try {
        const service = await prisma.service.findUnique({
            where: { id: serviceId },
        });
        if (!service) {
            return res.status(404).json ({ error: 'Serviço não encontrado' });
        }
        res.json(service);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar serviço' });
    }
};

export const createService = async (req, res) => {
    const { name, description, duration, price, professionalId } = req.body;
    if (!name || !description || !duration || !price || !professionalId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }
    try {
        const newService = await prisma.service.create({
            data: {
                name,
                description,
                duration: parseInt(duration),
                price: parseFloat(price),
                professionalId: parseInt(professionalId),
            },
        });
        res.status(201).json(newService);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao criar serviço' });
    }
};

export const updateService = async (req, res) => {
    const serviceId = parseInt(req.params.id);
    const { name, description, duration, price, professionalId } = req.body;
    if (!name || !description || !duration || !price || !professionalId) {
        return res.status(400).json({ error: 'Todos os campos são obrigatórios!' });
    }
    try {
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        const updateService = await prisma.service.update({
            where: { id: serviceId },
            data: {
                name,
                description,
                duration: parseInt (duration),
                price: parseFloat(price),
                professionalId: parseInt(professionalId),
            },
    });
    res.json(updateService);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar serviço' });
    }
};

export const deleteService = async (req, res) => {
    const serviceId = parseInt(req.params.id);
    try {
        const service = await prisma.service.findUnique({ where: { id: serviceId } });
        if (!service) {
            return res.status(404).json({ error: 'Serviço não encontrado' });
        }
        await prisma.service.delete({
            where: { id: serviceId },
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar serviço' });
    }
};