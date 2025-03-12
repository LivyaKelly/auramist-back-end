import swaggerAutogen from 'swagger-autogen';

const doc = {
  info: {
    title: 'API AuraMist',
    description: 'Documentação automática da API do AuraMist',
  },
  host: 'localhost:3001',
  schemes: ['http'],
};

const outputFile = './swagger-output.json';
const endpointsFiles = ['./src/app.js'];

swaggerAutogen()(outputFile, endpointsFiles, doc).then(() => {
  console.log('Documentação gerada com sucesso!');
});
