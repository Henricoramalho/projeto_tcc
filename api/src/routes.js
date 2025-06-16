const express = require('express');
const routes = express.Router();

// Importe o middleware de autenticação
const { autenticar, autorizar } = require('./controllers/authMiddleware');

// Rota raiz (teste)
routes.get('/', (req, res) => {
  return res.json({ titulo: 'Biblioteca Virtual' });
});

// Controllers
const livroController = require('./controllers/livroController');
const usuarioController = require('./controllers/usuarioController');
const registroController = require('./controllers/registroController');
const loginController = require('./controllers/loginController');
const telaloginController = require('./controllers/telaloginController');

// Rotas Públicas (sem autenticação)
routes.post('/login', telaloginController.login);
routes.post('/registrar', telaloginController.registrar);

// Rotas Protegidas (requerem autenticação)
routes.use(autenticar); // Todas as rotas abaixo exigem autenticação

// Rotas de Perfil
routes.get('/perfil', telaloginController.perfil);

// Rotas para Livro
routes.get('/livros', livroController.getAll);
routes.get('/livros/:id', livroController.getOne);
routes.post('/livros', livroController.create);
routes.put('/livros/:id', livroController.update);
routes.delete('/livros/:id', livroController.remove);

// Rotas para Usuario (apenas ADMIN)
routes.get('/usuarios', autorizar(['ADMIN']), usuarioController.getAll);
routes.get('/usuarios/:id', autorizar(['ADMIN']), usuarioController.getOne);
routes.post('/usuarios', autorizar(['ADMIN']), usuarioController.create);
routes.put('/usuarios/:id', autorizar(['ADMIN']), usuarioController.update);
routes.delete('/usuarios/:id', autorizar(['ADMIN']), usuarioController.remove);

// Rotas para Registro
routes.get('/registros', registroController.getAll);
routes.get('/registros/:id', registroController.getOne);
routes.post('/registros', registroController.create);
routes.put('/registros/:id', registroController.update);
routes.delete('/registros/:id', registroController.remove);

module.exports = routes;