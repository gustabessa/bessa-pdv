module.exports = (app) => {
  const controller = require('./controller')
  
  // Excluir itemvenda
  app.delete('/itemvenda', controller.destroy);

  // Busca todos os itemvendas
  app.get('/itemvenda', controller.findAll);

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