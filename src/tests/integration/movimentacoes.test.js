const request = require('supertest')
const { Loja } = require('../../models/lojas')
const { Caixa } = require('../../models/caixas')
const { Categoria } = require('../../models/categorias')
const { Movimento } = require('../../models/movimentacoes')
const mongoose = require('mongoose')
let server

describe('/api/caixadev/caixa/movimentos', () => {
  beforeEach(() => { server = require('../../server/index') })
  afterEach(async () => {
    await server.close()
    await Movimento.deleteMany({})
    await Categoria.deleteMany({})
    await Caixa.deleteMany({})
  })

  describe('POST', () => {
    let token
    let categoria
    let caixa
    let categoriaId
    let caixaId
    let saldoTotal
    let tipo
    let valor
    let descricao

    const exec = async () => {
      return await request(server)
        .post('/api/caixadev/caixa/movimentos')
        .set('x-auth-token', token)
        .send({ categoriaId, tipo, valor, descricao })
    }

    const execCategoria = async () => {
      return await request(server)
        .post('/api/caixadev/categorias')
        .set('x-auth-token', token)
        .send({ nome: 'Categoria1' })
    }

    beforeEach(async () => {
      server = require('../../server/index')
      token = new Loja().generateAuthToken()
      saldoTotal = 1000
      tipo = 'Entrada'
      valor = 10
      descricao = '1234567891'


      await execCategoria()
      categoria = await Categoria.findOne({ nome: 'Categoria1' })
      categoriaId = categoria._id

      caixa = new Caixa({ loja: categoria.loja, saldoTotal })
      await caixa.save()
      caixaId = caixa._id
    })

    afterEach(async () => {
      await server.close()
      await Movimento.deleteMany({})
      await Categoria.deleteMany({})
      await Caixa.deleteMany({})
    })

    it('Deve retornar 401 se não for fornecido nenhum token', async () => {
      token = ''
      const res = await exec()
      expect(res.status).toBe(401)
    })

    it('Deve retornar 400 se categoriaId for invalida', async () => {
      categoriaId = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 400 se o tipo informado for invalido', async () => {
      tipo = ''
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 400 se não encontrar a categoria', async () => {
      categoriaId = mongoose.Types.ObjectId()
      const res = await exec()
      expect(res.status).toBe(400)
    })

    it('Deve retornar 201 se for uma movimentacao valida', async () => {
      const res = await exec()
      expect(res.status).toBe(201)
    })
  })
})