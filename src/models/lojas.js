const jwt = require('jsonwebtoken')
const config = require('config')
const Joi = require('joi')
const mongoose = require('mongoose')

const lojaSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  senha: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255
  },
  isAdmin: Boolean
})

lojaSchema.methods.generateAuthToken = function () {
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'))
  return token
}

const Loja = mongoose.model('Loja', lojaSchema)

function validateLoja (loja) {
  const schema = Joi.object({
    nome: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    senha: Joi.string().min(5).max(255).required()
  })

  return schema.validate(loja)
}

module.exports = {
  Loja,
  validateLoja
}
