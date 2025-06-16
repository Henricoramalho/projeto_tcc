const { prisma } = require('../../server'); 

module.exports = {
  async getAll(req, res) {
    try {
      const livros = await prisma.livro.findMany({
        include: {
          registros: true 
        }
      });
      res.json(livros);
    } catch (error) {
      console.error('Erro ao buscar livros:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async getOne(req, res) {
    try {
      const { id } = req.params;
      const livro = await prisma.livro.findUnique({
        where: { id: parseInt(id) },
        include: {
          registros: true
        }
      });

      if (!livro) {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      res.json(livro);
    } catch (error) {
      console.error('Erro ao buscar livro:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async create(req, res) {
    try {
      const { 
        titulo, 
        autor, 
        isbn, 
        editora, 
        anoPublicacao, 
        genero, 
        sinopse, 
        paginas, 
        idioma 
      } = req.body;

      // Validação básica
      if (!titulo || !autor || !isbn) {
        return res.status(400).json({ error: 'Campos obrigatórios faltando' });
      }

      const novoLivro = await prisma.livro.create({
        data: {
          titulo,
          autor,
          isbn,
          editora,
          anoPublicacao: parseInt(anoPublicacao),
          genero,
          sinopse,
          paginas: parseInt(paginas),
          idioma
        }
      });

      res.status(201).json(novoLivro);
    } catch (error) {
      console.error('Erro ao criar livro:', error);
      
      if (error.code === 'P2002') {
        return res.status(400).json({ error: 'ISBN já existe no sistema' });
      }
      
      res.status(500).json({ error: 'Erro ao criar livro' });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      // Remove campos que não devem ser atualizados
      delete data.id;
      delete data.dataCadastro;

      const livroAtualizado = await prisma.livro.update({
        where: { id: parseInt(id) },
        data
      });

      res.json(livroAtualizado);
    } catch (error) {
      console.error('Erro ao atualizar livro:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      res.status(500).json({ error: 'Erro ao atualizar livro' });
    }
  },

  async remove(req, res) {
    try {
      const { id } = req.params;

      await prisma.livro.delete({
        where: { id: parseInt(id) }
      });

      res.status(204).end();
    } catch (error) {
      console.error('Erro ao excluir livro:', error);
      
      if (error.code === 'P2025') {
        return res.status(404).json({ error: 'Livro não encontrado' });
      }
      
      res.status(500).json({ error: 'Erro ao excluir livro' });
    }
  }
};