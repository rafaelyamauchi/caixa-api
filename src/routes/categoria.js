const auth = require('../middleware/auth');
const { createCategoria } = require('../services/lojaService')

const router = app => {
  app.post('/api/categorias', auth, createCategoria)
}

module.exports = router
