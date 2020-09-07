const request = require('supertest')
const { Loja } = require('../../models/lojas')
const { Categoria } = require('../../models/categorias')
let server

describe('/api/categorias', () => {
  beforeEach(() => { server = require('../../server/index') })
  afterEach(async () => {
    await server.close()
    await Categoria.deleteMany({})
  })

  describe('POST', () => {
    let token
    let nome

    const exec = async () => {
      return await request(server)
        .post('/api/categorias')
        .set('x-auth-token', token)
        .send({ nome })
    }

    beforeEach(() => {
      token = new Loja().generateAuthToken()
      nome = 'Categoria1'
    })

    it('Deve retornar 401 se não for fornecido nenhum token', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('Deve retornar 400 se a categoria for menor que 5 caracteres', async () => {
      nome = '1234'
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 400 se a categoria for maior que 50 caracteres', async () => {
      nome = new Array(52).join('a')
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve salvar a categoria se for uma categoria valida', async () => {
      await exec()
      const categoria = Categoria.find({ nome: 'Categoria1' })
      expect(categoria).not.toBeNull()
    })

    it('Deve retornar a categoria se for uma categoria valida', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('nome', 'Categoria1')
    })
  })
})
