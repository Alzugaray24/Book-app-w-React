import { useEffect, useState } from "react";
import bookData from "../books.json";
import "../AllBooks.css";

const AllBooks = () => {
  const [originalBooks, setOriginalBooks] = useState([]);
  const [books, setBooks] = useState([]);
  const [lecture, setLecture] = useState([]);
  const [error, setError] = useState(null);
  const [numAvailable, setNumAvailable] = useState(0);
  const [numLecture, setNumLecture] = useState(0);
  const [filterPages, setFilterPages] = useState("");
  const [selectedGenre, setSelectedGenre] = useState(null);

  useEffect(() => {
    const fetchBooks = () => {
      try {
        const library = bookData.library;
        const parsedBooks = library.map((item) => item.book);
        setOriginalBooks(parsedBooks);
        setBooks(parsedBooks);
        setNumAvailable(parsedBooks.length);
      } catch (error) {
        setError("Error al cargar los libros");
        console.error("Error al cargar los libros:", error);
      }
    };

    fetchBooks();
  }, []);

  const handleAddLecture = (value) => {
    try {
      const foundBook = originalBooks.find((book) => book.ISBN === value);
      if (foundBook) {
        const newOriginalBooks = originalBooks.filter(
          (book) => book.ISBN !== value
        );
        setOriginalBooks(newOriginalBooks);
        setBooks(newOriginalBooks);
        setLecture((prevLecture) => [...prevLecture, foundBook]);
        setNumAvailable((prev) => prev - 1);
        setNumLecture((prev) => prev + 1);
      } else {
        setError("No se pudo encontrar el libro con el ISBN proporcionado");
      }
    } catch (error) {
      setError("No se pudo buscar el libro", error);
    }
  };

  const handleDeleteLecture = (value) => {
    try {
      const foundBook = lecture.find((book) => book.ISBN === value);
      if (foundBook) {
        const updatedLecture = lecture.filter((book) => book.ISBN !== value);
        setLecture(updatedLecture);
        setOriginalBooks((prevOriginalBooks) => [
          ...prevOriginalBooks,
          foundBook,
        ]);
        setBooks((prevBooks) => [...prevBooks, foundBook]);
        setNumAvailable((prev) => prev + 1);
        setNumLecture((prev) => prev - 1);
      } else {
        setError("El libro no se encontró en la lista de lectura");
      }
    } catch (error) {
      setError("No se pudo eliminar el libro de lectura", error);
    }
  };

  const handleGenere = (genre) => {
    setSelectedGenre(genre);

    let filteredBooks = originalBooks;

    if (genre !== "") {
      filteredBooks = originalBooks.filter((book) => book.genre === genre);
    }

    setBooks(filteredBooks);
    setNumAvailable(filteredBooks.length);
  };

  const handleFilterPages = (pages) => {
    setFilterPages(pages);

    const filteredBooks = originalBooks.filter((book) => {
      const numPages = parseInt(pages);
      return book.pages >= numPages - 100 && book.pages <= numPages;
    });

    setBooks(filteredBooks);
    setNumAvailable(filteredBooks.length);
  };

  return (
    <div className="flexBooks">
      <div className="aviableBooks-container">
        <h2>Tenes {numAvailable} libros disponibles</h2>

        <div className="aviableBooks-flex">
          <div className="select-container">
            <h3>Filtrar por páginas</h3>
            <div className="flexPages">
              <input
                type="number"
                id="numPaginas"
                name="numPaginas"
                min="0"
                max="1000"
                placeholder="Numero de Paginas"
                value={filterPages}
                onChange={(e) => handleFilterPages(e.target.value)}
                className="scrollable-input"
              />
            </div>
          </div>

          <div className="select-container select2">
            <h3>Filtrar por género</h3>
            <select
              name="select"
              className="selectClass"
              onChange={(e) => {
                handleGenere(e.target.value);
              }}
              value={selectedGenre}
            >
              <option className="selectClass" value="" selected>
                Todos
              </option>
              <option className="selectClass" value="Fantasía">
                Fantasía
              </option>
              <option className="selectClass" value="Ciencia ficción">
                Ciencia ficción
              </option>
              <option className="selectClass" value="Zombies">
                Zombies
              </option>
              <option className="selectClass" value="Terror">
                Terror
              </option>
            </select>
          </div>
        </div>

        {error ? (
          <p>{error}</p>
        ) : (
          <>
            {books.length === 0 && <p>No se encontraron libros disponibles</p>}
            <ul className="ul-books">
              {books.map((book, index) => (
                <li className="li-books" key={index}>
                  <div className="book-container">
                    <img
                      className="img-books"
                      src={book.cover}
                      alt={book.title}
                    />
                    <button
                      className="button-add-lectura"
                      value={book.ISBN}
                      onClick={(event) => handleAddLecture(event.target.value)}
                    >
                      Agregar a lectura
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      {lecture.length > 0 && (
        <div className="lectureBooks-container">
          <>
            <h1>Libros de lectura</h1>
            <h2>Tenes {numLecture} libros de lectura</h2>
            <ul className="ul-books-lecutre">
              {lecture.map((book, index) => (
                <li className="li-books" key={index}>
                  <img
                    className="img-books"
                    src={book.cover}
                    alt={book.title}
                  />
                  <button
                    className="button-add-lectura"
                    value={book.ISBN}
                    onClick={(e) => {
                      handleDeleteLecture(e.target.value);
                    }}
                  >
                    Quitar de lectura
                  </button>
                </li>
              ))}
            </ul>
          </>
        </div>
      )}
    </div>
  );
};

export default AllBooks;
