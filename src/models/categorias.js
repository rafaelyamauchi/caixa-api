const Joi = require('joi');
const mongoose = require('mongoose');

const categoriaSchema = new mongoose.Schema({
  loja: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'lojas'
  },
  nome: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

const Categoria = mongoose.model('Categoria', categoriaSchema);

function validateCategoria(categoria) {
  const schema = Joi.object({
    nome: Joi.string().min(5).max(50).required()
  })

  return schema.validate(categoria)
}

module.exports = {
  Categoria,
  validateCategoria,
  categoriaSchema
}