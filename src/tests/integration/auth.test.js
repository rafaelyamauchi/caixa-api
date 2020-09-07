const request = require('supertest')
const { Loja } = require('../../models/lojas')
const { Categoria } = require('../../models/categorias')
let server

describe('auth middleware', () => {
  beforeEach(() => { server = require('../../server/index') })
  afterEach(async () => {
    await server.close()
    await Categoria.deleteMany({})
  })
  let token

  const exec = async () => {
    return await request(server)
      .post('/api/categorias')
      .set('x-auth-token', token)
      .send({ nome: 'Categoria1' })
  }

  beforeEach(() => {
    token = new Loja().generateAuthToken()
  })

  it('Deve retornar 401 se não for fornecido nenhum token', async () => {
    token = ''
    const res = await exec()
    expect(res.status).toBe(401)
  })

  it('Deve retornar 400 se o token for invalido', async () => {
    token = 'a'
    const res = await exec()
    expect(res.status).toBe(400)
  })

  it('Deve retornar 201 se o token for valido e processar o request', async () => {
    const res = await exec()
    expect(res.status).toBe(201)
  })
})