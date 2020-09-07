const auth = require('../middleware/auth')
const { getCaixa, createCaixa } = require('../services/lojaService')

const router = app => {
  app.get('/api/caixas', auth, getCaixa)
  app.post('/api/caixas', auth, createCaixa)
}

module.exports = router
