module.exports = (app) => {
  const controller = require('./controller')
  
  // Criar novo produto
  app.post('/produto', controller.create);
  
  // Atualizar produto
  app.put('/produto', controller.update);
  
  // Excluir produto
  app.delete('/produto', controller.destroy);

  // Busca todos os produtos
  app.get('/produto', controller.findAll);

  app.use((error, req, res, next) => {
    return res.status(200).send(
      { 
        messageError: error.messageError,
        hasError: true,
        techError: error.techError
      }
    );
  });
}