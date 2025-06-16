
const { prisma } = require('../../server'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = {
  async login(req, res) {
    try {
      const { email, senha } = req.body;

      
      if (!email || !senha) {
        return res.status(400).json({ error: 'Email e senha são obrigatórios' });
      }

      
      const usuario = await prisma.usuario.findUnique({
        where: { email }
      });

      if (!usuario) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      
      const senhaValida = await bcrypt.compare(senha, usuario.senha);
      
      if (!senhaValida) {
        return res.status(401).json({ error: 'Credenciais inválidas' });
      }

      
      const token = jwt.sign(
        { 
          id: usuario.id, 
          email: usuario.email, 
          tipo: usuario.tipo 
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

     
      res.json({
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo: usuario.tipo
        }
      });

    } catch (error) {
      console.error('Erro no login:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  },

  async registrar(req, res) {
    try {
      const { nome, email, senha, tipo = 'COMUM' } = req.body;

      
      if (!nome || !email || !senha) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios' });
      }

     
      const usuarioExistente = await prisma.usuario.findUnique({
        where: { email }
      });

      if (usuarioExistente) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }

      
      const saltRounds = 10;
      const senhaHash = await bcrypt.hash(senha, saltRounds);

     
      const novoUsuario = await prisma.usuario.create({
        data: {
          nome,
          email,
          senha: senhaHash,
          tipo
        }
      });

      
      const token = jwt.sign(
        { 
          id: novoUsuario.id, 
          email: novoUsuario.email, 
          tipo: novoUsuario.tipo 
        },
        process.env.JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.status(201).json({
        token,
        usuario: {
          id: novoUsuario.id,
          nome: novoUsuario.nome,
          email: novoUsuario.email,
          tipo: novoUsuario.tipo
        }
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
      
      res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
  },

  async perfil(req, res) {
    try {
      
      const usuario = req.usuario;
      
      if (!usuario) {
        return res.status(401).json({ error: 'Não autorizado' });
      }

      
      const usuarioCompleto = await prisma.usuario.findUnique({
        where: { id: usuario.id },
        select: {
          id: true,
          nome: true,
          email: true,
          tipo: true,
          dataCadastro: true,
          registros: true
        }
      });

      res.json(usuarioCompleto);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  }
};