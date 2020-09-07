const Joi = require('joi')
const mongoose = require('mongoose')
const { categoriaSchema } = require('./categorias')

const schemaMovimento = new mongoose.Schema({
  caixa: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'caixas'
  },
  data: {
    type: Date,
    default: Date.now
  },
  categoria: {
    type: categoriaSchema,
    required: true
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Entrada', 'Saida']
  },
  valor: {
    type: Number,
    required: true
  },
  descricao: {
    type: String,
    required: true,
    min: 10,
    max: 255
  }
})

const Movimento = mongoose.model('Movimento', schemaMovimento)

function validateMovimento (movimento) {
  const schema = Joi.object({
    data: Joi.date(),
    categoriaId: Joi.objectId().required(),
    tipo: Joi.string().valid('Entrada', 'Saida').required(),
    valor: Joi.number().min(0).required(),
    descricao: Joi.string().min(10).max(255).required()
  })

  return schema.validate(movimento)
}

module.exports = {
  Movimento,
  validateMovimento,
  schemaMovimento
}
