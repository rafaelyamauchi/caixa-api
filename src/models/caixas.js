const Joi = require('joi')
const mongoose = require('mongoose')

const schemaCaixa = new mongoose.Schema({
  loja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lojas'
  },
  saldoTotal: {
    type: Number,
    min: 0
  }
})

schemaCaixa.index({ loja: 1 }, { unique: true })

const Caixa = mongoose.model('Caixa', schemaCaixa)

function validateCaixa(caixa) {
  const schema = Joi.object({
    saldoTotal: Joi.number().min(0).required()
  })

  return schema.validate(caixa)
}

module.exports = {
  Caixa,
  validateCaixa
}
