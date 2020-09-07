const auth = require('../middleware/auth');
const { createCategoria } = require('../services/lojaService')

const router = app => {
  app.post('/api/caixadev/categorias', auth, createCategoria)
}

module.exports = router
