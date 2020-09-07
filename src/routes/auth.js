const { authUser } = require('../services/lojaService')

const router = app => {
  app.post('/api/caixadev/authorization', authUser);
}


module.exports = router;