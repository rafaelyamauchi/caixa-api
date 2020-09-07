const request = require('supertest')
const { Loja } = require('../../models/lojas')
let server

describe('/api/lojas', () => {
  beforeEach(() => { server = require('../../server/index') })
  afterEach(async () => {
    await server.close()
    await Loja.deleteMany({})
  })

  describe('POST', () => {
    let nome
    let email
    let senha

    const exec = async () => {
      return await request(server)
        .post('/api/lojas')
        .send({ nome, email, senha })
    }

    beforeEach(() => {
      nome = '12345'
      email = 'teste1@teste1.com'
      senha = '12345'
    })

    it('Deve retornar 400 se nome não for informado', async () => {
      nome = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 400 se nome informado for maior que 50', async () => {
      nome = new Array(52).join('a')
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 400 se email não for informado', async () => {
      email = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 400 se senha não for informado', async () => {
      email = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar loja se for uma loja valida', async () => {
      const res = await exec()
      const loja = await Loja.find({ email })
      expect(loja).not.toBeNull()
    })

    it('Deve retornar a loja se for uma loja valida', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('email', 'teste1@teste1.com')
    })
  })
})