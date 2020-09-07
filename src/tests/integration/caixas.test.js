const request = require('supertest')
const { Loja } = require('../../models/lojas')
const { Caixa } = require('../../models/caixas')
const { Categoria } = require('../../models/categorias')
const { Movimento } = require('../../models/movimentacoes')
let server

describe('/api/caixadev/caixas', () => {
  beforeEach(() => { server = require('../../server/index') })
  afterEach(async () => {
    await server.close()
    await Categoria.deleteMany({})
    await Caixa.deleteMany({})
    await Movimento.deleteMany({})
  })

  describe('GET', () => {
    let token
    let saldoTotal
    let categoriaId
    let categoria
    let caixa
    let movimentacoes
    let tipo
    let valor
    let descricao

    const exec = async () => {
      return await request(server)
        .get('/api/caixas')
        .set('x-auth-token', token)
    }

    beforeEach(() => {
      token = new Loja().generateAuthToken()
      saldoTotal = 1000
      tipo = 'Entrada'
      valor = 10
      descricao = '1234567891'
    })

    it('Deve retornar 401 se não for fornecido nenhum token', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('Deve retornar 400 se não foi criado nenhum caixa', async () => {
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 200 se não foi criado nenhum caixa', async () => {
      await request(server)
        .post('/api/categorias')
        .set('x-auth-token', token)
        .send({ nome: 'Categoria1' })

      categoria = await Categoria.findOne({ nome: 'Categoria1' })
      categoriaId = categoria._id

      caixa = new Caixa({ loja: categoria.loja, saldoTotal })
      await caixa.save()
      caixaId = caixa._id

      movimentacoes = new Movimento({
        caixa: caixa._id,
        categoria: {
          _id: categoriaId,
          nome: '12345'
        },
        tipo,
        valor,
        descricao
      })

      await movimentacoes.save()

      const res = await request(server).get('/api/caixas').set('x-auth-token', token)
      expect(res.status).toBe(200)
    })
  })

  describe('POST', () => {
    let token
    let saldoTotal

    const exec = async () => {
      return await request(server)
        .post('/api/caixas')
        .set('x-auth-token', token)
        .send({ saldoTotal })
    }

    beforeEach(() => {
      token = new Loja().generateAuthToken()
      saldoTotal = 1000
    })

    it('Deve retornar 401 se não for fornecido nenhum token', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('Deve retornar 400 se valor do saldo inicial for negativo', async () => {
      saldoTotal = -1;
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve salvar caixa se for um caixa valido', async () => {
      await exec()
      const caixa = Caixa.find({ saldoTotal: 1000 })
      expect(caixa).not.toBeNull()
    })

    it('Deve retornar o caixa se for um caixa valido', async () => {
      const res = await exec()
      expect(res.body).toHaveProperty('_id')
      expect(res.body).toHaveProperty('saldoTotal', 1000)
    })
  })
})
