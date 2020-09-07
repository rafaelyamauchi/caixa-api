const { createLoja } = require('../services/lojaService')

const router = app => {
  app.post('/api/lojas', createLoja)
}

module.exports = router
