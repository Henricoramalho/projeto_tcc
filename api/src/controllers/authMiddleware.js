const jwt = require('jsonwebtoken');
require('dotenv').config();

module.exports = {
  autenticar: (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(' ')[1];
      
      if (!token) {
        return res.status(401).json({ error: 'Token não fornecido' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.usuario = decoded;
      next();
    } catch (error) {
      console.error('Erro na autenticação:', error);
      res.status(401).json({ error: 'Token inválido ou expirado' });
    }
  },

  autorizar: (tiposPermitidos) => {
    return (req, res, next) => {
      if (!tiposPermitidos.includes(req.usuario.tipo)) {
        return res.status(403).json({ error: 'Acesso não autorizado' });
      }
      next();
    };
  }
};