const { Loja } = require('../../../models/lojas')
const auth = require('../../../middleware/auth')
const mongoose = require('mongoose')

describe('auth middleware', () => {
  it('Deve popular req.user com o payload de um Jsonwebtoken valido', () => {
    const loja = { _id: mongoose.Types.ObjectId().toHexString() }
    const token = new Loja(loja).generateAuthToken()
    const req = {
      header: jest.fn().mockReturnValue(token)
    };
    const res = {}
    const next = jest.fn()

    auth(req, res, next)

    expect(req.user).toMatchObject(loja)
  })
})