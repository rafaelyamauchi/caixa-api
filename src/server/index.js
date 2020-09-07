const winston = require('winston')
const morgan = require('morgan')
const helmet = require('helmet')
const compression = require('compression')
const lojas = require('../routes/loja')
const auth = require('../routes/auth')
const categorias = require('../routes/categoria')
const caixas = require('../routes/caixa')
const movimentacoes = require('../routes/movimento')
const express = require('express')
const app = express()

const port = process.env.PORT || 3000

app.use(express.json())
app.use(helmet())
app.use(compression())
app.use(morgan('tiny'))

require('../startup/logging')()
lojas(app)
auth(app)
categorias(app)
caixas(app)
movimentacoes(app)
require('../database')()
require('../startup/validation')()

const server = app.listen(port, () => winston.info(`Listening on port ${port}`))

module.exports = server