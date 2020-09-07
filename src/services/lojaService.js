const Joi = require('joi')
const bcrypt = require('bcrypt')
const winston = require('winston')
const _ = require('lodash')
const { Loja, validateLoja } = require('../models/lojas')
const { Categoria, validateCategoria } = require('../models/categorias')
const { Caixa, validateCaixa } = require('../models/caixas')
const { Movimento, validateMovimento } = require('../models/movimentacoes')

const validateAuth = (req) => {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    senha: Joi.string().min(5).max(255).required()
  })

  return schema.validate(req)
}

const createLoja = async (req, res) => {
  const { error } = validateLoja(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  let loja = await Loja.findOne({ email: req.body.email })
  if (loja) return res.status(400).json({ message: 'loja já registrada' })

  try {
    loja = new Loja(_.pick(req.body, ['nome', 'email', 'senha']))
    const salt = await bcrypt.genSalt(10)
    loja.senha = await bcrypt.hash(loja.senha, salt)
    await loja.save()

    const token = loja.generateAuthToken()
    res.header('x-auth-token', token).json(_.pick(loja, ['_id', 'nome', 'email']))
  } catch (error) {
    res.status(500).json({ message: error.message })
    winston.info(error.message)
  }
}

const authUser = async (req, res) => {
  const { error } = validateAuth(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const loja = await Loja.findOne({ email: req.body.email })
  if (!loja) return res.status(400).json({ message: 'Email ou Senha inválidos' })

  const validPassword = await bcrypt.compare(req.body.senha, loja.senha)
  if (!validPassword) return res.status(400).json({ message: 'Email ou Senha inválidos' })

  try {
    const token = loja.generateAuthToken()
    res.status(200).json(token)
  } catch (error) {
    res.status(500).json({ message: error.message })
    winston.info(error.message)
  }
}

const createCategoria = async (req, res) => {
  const { error } = validateCategoria(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    const categoria = new Categoria({ loja: req.user._id, nome: req.body.nome })
    await categoria.save()

    res.status(201).json(categoria)
  } catch (error) {
    res.status(500).json({ message: error.message })
    winston.info(error.message)
  }
}

const getCaixa = async (req, res) => {
  const caixa = await Caixa.findOne({ loja: req.user._id })
  if (!caixa) return res.status(400).json({ message: 'Nenhum caixa encontrado' })

  try {
    const movimentos = await Movimento.find({ caixa: caixa._id }).select('-caixa')

    const resumo = {
      saldoTotal: parseFloat(caixa.saldoTotal).toFixed(2),
      movimentacoes: movimentos
    }
    res.status(200).json(resumo)
  } catch (error) {
    res.status(500).json({ message: error.message })
    winston.info(error.message)
  }
}

const createCaixa = async (req, res) => {
  const { error } = validateCaixa(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  try {
    const caixa = new Caixa({
      loja: req.user._id,
      saldoTotal: parseFloat(req.body.saldoTotal).toFixed(2)
    })
    await caixa.save()

    res.status(201).json(caixa)
  } catch (error) {
    res.status(500).json({ message: error.message })
    winston.info(error.message)
  }
}

const createMovimento = async (req, res) => {
  const { error } = validateMovimento(req.body)
  if (error) return res.status(400).json({ message: error.details[0].message })

  const caixa = await Caixa.findOne({ loja: req.user._id })
  if (!caixa) return res.status(400).json({ message: 'Nenhum caixa encontrado' })

  let { categoriaId, tipo, valor, descricao } = req.body

  valor = tipo === 'Entrada' ? valor : (valor * -1)

  const categoria = await Categoria.findById({ _id: categoriaId })
  if (!categoria) return res.status(400).json({ message: 'Categoria inválida' })

  const movimento = new Movimento({
    caixa: caixa._id,
    categoria: {
      _id: categoria._id,
      nome: categoria.nome
    },
    tipo: tipo,
    valor: parseFloat(valor).toFixed(2),
    descricao: descricao
  })

  try {
    await movimento.save()
    const updateSaldo = caixa.saldoTotal + (valor)
    await Caixa.update({ _id: caixa._id },
      {
        $set:
          { saldoTotal: parseFloat(updateSaldo).toFixed(2) }
      },
      {
        new: true
      }
    )
    res.status(201).json(movimento)
  } catch (error) {
    res.status(500).json({ message: error.message })
    winston.info(error.message)
  }
}

module.exports = {
  createLoja,
  createCategoria,
  createMovimento,
  createCaixa,
  getCaixa,
  authUser
}
