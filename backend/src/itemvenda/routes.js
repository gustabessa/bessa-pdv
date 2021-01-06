module.exports = (app) => {
  const controller = require('./controller')
  
  // Criar nova itemvenda
  app.post('/itemvenda', controller.create);
  
  // Atualizar itemvenda
  app.put('/itemvenda', controller.update);
  
  // Excluir itemvenda
  app.delete('/itemvenda', controller.destroy);

  // Busca todos os itemvendas
  app.get('/itemvenda', controller.findAll);

  app.use((error, req, res, next) => {
    return res.status(200).json({ messageError: error.toString(), hasError: true });
  });
}