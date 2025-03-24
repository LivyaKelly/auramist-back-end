import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    version: '1.0.0',
    title: 'AuraMist API',
    description: 'Documentação da API do sistema de agendamento AuraMist',
  },
  host: 'localhost:3000',
  basePath: '/',
  schemes: ['http'],
  consumes: ['application/json'],
  produces: ['application/json'],
  tags: [
    {
      name: 'Usuários',
      description: 'Operações relacionadas a usuários',
    },
    {
      name: 'Serviços',
      description: 'Gerenciamento de serviços de beleza',
    },
    {
      name: 'Agendamentos',
      description: 'Criação, listagem e cancelamento de agendamentos',
    },
    {
      name: 'Autenticação',
      description: 'Login e registro de usuários',
    },
    {
      name: 'Admin',
      description: 'Funcionalidades administrativas do sistema',
    },
    {
      name: 'Avaliações',
      description: 'Avaliações e reviews de serviços/profissionais',
    },
  ],
  securityDefinitions: {},
  definitions: {},
};

const outputFile = './swagger-output.json';
const routes = ['./src/app.js'];

swaggerAutogen()(outputFile, routes, doc);
