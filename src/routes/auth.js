const { authUser } = require('../services/lojaService')

const router = app => {
  app.post('/api/authorization', authUser);
}


module.exports = router;