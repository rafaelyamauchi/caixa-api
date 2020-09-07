const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = function (req, res, next) {
  const token = req.header('x-auth-token')
  if (!token) return res.status(401).send('Acesso negado, token não informado')

  try {
    const decode = jwt.verify(token, config.get('jwtPrivateKey'))
    req.user = decode
    next()
  } catch (error) {
    return res.status(400).json({ message: 'Token Invalido.' })
  }
}
