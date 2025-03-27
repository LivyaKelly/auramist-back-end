import { PrismaClient } from "@prisma/client";
import multer from "multer";

const prisma = new PrismaClient();
const upload = multer({ dest: "src/uploads/" });

export const uploadImageMiddleware = upload.single("image");

// ✅ GET ALL SERVICES (aberto)
export async function getAllServices(req, res) {
  try {
    const services = await prisma.service.findMany();
    return res.status(200).json(services);
  } catch (err) {
    console.log("Error listing services:", err);
    return res.status(500).json({ mensagem: "Erro ao buscar serviços", error: err });
  }
}

// ✅ GET ONE SERVICE BY ID
export async function getServiceById(req, res) {
  try {
    const serviceId = parseInt(req.params.id);

    if (isNaN(serviceId)) {
      return res.status(400).json({ mensagem: "ID inválido" });
    }

    const service = await prisma.service.findUnique({
      where: { id: serviceId },
    });

    if (!service) {
      return res.status(404).json({ mensagem: "Serviço não encontrado" });
    }

    return res.status(200).json({ mensagem: "Serviço encontrado", servico: service });
  } catch (err) {
    console.log("Error fetching service:", err);
    return res.status(500).json({ mensagem: "Erro ao buscar serviço", error: err.message });
  }
}

// ✅ CREATE SERVICE (pegando ID do token)
export async function createService(req, res) {
  try {
    const { name, description, duration, price, urlImage } = req.body;
    const professionalId = req.userId; // ✅ vem do token, não do body

    if (!name || !description || !duration || !price || !professionalId || !urlImage) {
      return res.status(400).json({
        mensagem: "Todos os campos são obrigatórios, inclusive a URL da imagem!",
      });
    }

    const newService = await prisma.service.create({
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        professionalId: parseInt(professionalId),
        urlImage,
      },
    });

    return res.status(201).json({ mensagem: "Serviço criado com sucesso!", servico: newService });
  } catch (err) {
    console.log("Erro ao criar serviço:", err);
    return res.status(500).json({ mensagem: "Erro ao criar serviço", error: err.message });
  }
}

// ✅ UPDATE SERVICE
export async function updateService(req, res) {
  try {
    const serviceId = parseInt(req.params.id);
    const { name, description, duration, price, professionalId } = req.body;

    if (!name || !description || !duration || !price || !professionalId) {
      return res.status(400).json({ mensagem: "Todos os campos são obrigatórios!" });
    }

    const service = await prisma.service.findUnique({ where: { id: serviceId } });

    if (!service) {
      return res.status(404).json({ mensagem: "Serviço não encontrado" });
    }

    const updatedService = await prisma.service.update({
      where: { id: serviceId },
      data: {
        name,
        description,
        duration: parseInt(duration),
        price: parseFloat(price),
        professionalId: parseInt(professionalId),
      },
    });

    return res.status(200).json({ mensagem: "Serviço atualizado com sucesso!", servico: updatedService });
  } catch (err) {
    console.log("Error updating service:", err);
    return res.status(500).json({ mensagem: "Erro ao atualizar serviço", error: err.message });
  }
}

// ✅ DELETE SERVICE
export async function deleteService(req, res) {
  try {
    const serviceId = parseInt(req.params.id);

    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) {
      return res.status(404).json({ mensagem: "Serviço não encontrado" });
    }

    await prisma.service.delete({ where: { id: serviceId } });
    return res.status(200).json({ mensagem: "Serviço deletado com sucesso!" });
  } catch (err) {
    console.log("Error deleting service:", err);
    return res.status(500).json({ mensagem: "Erro ao deletar serviço", error: err.message });
  }
}

export async function getMyServices(req, res) {
  try {
    const professionalId = req.userId;

    if (!professionalId) {
      return res.status(401).json({ mensagem: 'Usuário não autenticado.' });
    }

    const services = await prisma.service.findMany({
      where: { professionalId },
    });

    return res.status(200).json(services);
  } catch (err) {
    console.error('Erro ao buscar serviços do profissional:', err);
    return res.status(500).json({ mensagem: 'Erro ao buscar serviços', error: err.message });
  }
}
