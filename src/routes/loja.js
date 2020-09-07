const { createLoja } = require('../services/lojaService')

const router = app => {
  app.post('/api/caixadev/lojas', createLoja)
}

module.exports = router
