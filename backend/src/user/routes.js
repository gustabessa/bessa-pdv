module.exports =  (app) => {
  const controller = require('./controller')
  
  // Criar novo user
  app.post('/user', controller.create);
  
  // Excluir user
  app.delete('/user', controller.destroy);

  // Busca todos os users
  app.get('/user', controller.findAll);

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