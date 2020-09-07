const auth = require('../middleware/auth');
const { getCaixa, createCaixa } = require('../services/lojaService')

const router = app => {
  app.get('/api/caixadev/caixas', auth, getCaixa)
  app.post('/api/caixadev/caixas', auth, createCaixa)
}

module.exports = router