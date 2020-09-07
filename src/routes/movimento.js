const auth = require('../middleware/auth')
const { createMovimento } = require('../services/lojaService')

const router = app => {
  app.post('/api/caixa/movimentos', auth, createMovimento)
}

module.exports = router
