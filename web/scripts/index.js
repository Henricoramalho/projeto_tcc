document.addEventListener("DOMContentLoaded", async () => {
    const booksContainer = document.getElementById("books-container");

    // Função para carregar livros do backend
    async function loadBooks() {
        try {
            const response = await fetch("http://localhost:3001/livros"); // Endpoint da API
            const books = await response.json();

            // Limpa o contêiner de livros
            booksContainer.innerHTML = "";

            // Exibe os livros
            books.forEach((book) => {
                const bookCard = document.createElement("div");
                bookCard.classList.add("book-card");
                bookCard.innerHTML = `
                    <img src="${book.capa}" alt="Capa do Livro">
                    <h3>${book.titulo}</h3>
                    <p><strong>Autor:</strong> ${book.autor}</p>
                    <p><strong>Gênero:</strong> ${book.genero}</p>
                    <p><strong>Ano:</strong> ${book.anoPublicacao}</p>
                `;
                booksContainer.appendChild(bookCard);
            });
        } catch (error) {
            console.error("Erro ao carregar livros:", error);
        }
    }

    // Carrega os livros ao carregar a página
    loadBooks();
});

async function carregarLivrosGoogle(query) {
  try {
    const res = await fetch(`/buscar-livros/${encodeURIComponent(query)}`);
    const data = await res.json();

    const container = document.getElementById("books-container");
    container.innerHTML = "";

    if (!data.items) {
      container.innerHTML = "<p>Nenhum livro encontrado.</p>";
      return;
    }

    data.items.forEach(book => {
      const info = book.volumeInfo;
      const card = document.createElement("div");
      card.classList.add("book-card");

      card.innerHTML = `
        <img src="${info.imageLinks?.thumbnail || 'default.jpg'}" alt="${info.title}">
        <h3>${info.title}</h3>
        <p>${info.authors ? info.authors.join(", ") : "Autor desconhecido"}</p>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    console.error("Erro ao carregar livros:", error);
  }
}

// Chama a função ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  carregarLivrosGoogle("harry potter");
});
