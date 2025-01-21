
module.exports = (app) => {
  app.use('/auth',require('../ROUTES/Auth/auth'));

  app.use('/ticket',require('../ROUTES/TICKET/ticket'));

  app.use('/tools',require('../ROUTES/TOOLS/ban'));
};
