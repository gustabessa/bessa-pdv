module.exports = (app) => {
  const controller = require('./controller')
  
  // Criar nova venda
  app.post('/venda', controller.create);
  
  // Atualizar venda
  app.put('/venda', controller.update);
  
  // Excluir venda
  app.delete('/venda', controller.destroy);

  // Busca todos os vendas
  app.get('/venda', controller.findAll);

  app.use((error, req, res, next) => {
    return res.status(200).json({ messageError: error.toString(), hasError: true });
  });
}