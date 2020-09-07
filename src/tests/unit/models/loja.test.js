const { Loja } = require('../../../models/lojas')
const jwt = require('jsonwebtoken')
const config = require('config')
const mongoose = require('mongoose')

describe('loja.generateAuthToken', () => {
  it('Deve retornar um JWT valido', () => {
    const payload = { _id: new mongoose.Types.ObjectId().toHexString() }
    const loja = new Loja(payload)
    const token = loja.generateAuthToken()
    const decode = jwt.verify(token, config.get('jwtPrivateKey'))
    expect(decode).toMatchObject(payload)
  })
})