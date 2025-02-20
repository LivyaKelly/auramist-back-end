import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();


export async function createReview(req, res) {

    try{
        const {rating, comment} = req.body;
        const clientId = req.userId;

        if(!rating || rating < 1 || rating > 5){
            return res.status(400).json({messagem: 'Avaliação inválida'});
        }

        const client = await prisma.user.findUnique({where: {id: clientId}});

        if(!client || !client.hasCompletedService){
            return res.status(403).json({messagem:'Apenas Clientes que concluiram o servico podem avaliar' })
        }

        const review = await prisma.review.create({
            data: {
                rating,
                comment,
                clientId,
            }
        })

        return res.status(201).json({messagem: 'Avaliação criada com sucesso', review});

    }catch(err){
        console.error('Erro ao criar avaliação:', err);
        return res.status(500).json({messagem: 'Erro ao criar avaliação', error: err.message});
    }

}

