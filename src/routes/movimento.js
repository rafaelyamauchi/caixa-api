const auth = require('../middleware/auth');
const { createMovimento } = require('../services/lojaService')

const router = app => {
  app.post('/api/caixadev/caixa/movimentos', auth, createMovimento)
}

module.exports = router