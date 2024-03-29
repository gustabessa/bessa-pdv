module.exports =  (app) => {
  const controller = require('./controller')
  
  // Autenticar
  app.post('/auth', controller.login);
  
  // Logout
  app.get('/auth', controller.logout);

  // Auth check
  app.get('/auth/check', controller.check);

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