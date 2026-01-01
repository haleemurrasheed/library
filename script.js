// ========== BOOK CLASS ==========
class Book {
    constructor(title, author, pages, read) {
        this.id = crypto.randomUUID();
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.read = read;
    }

    toggleRead() {
        this.read = !this.read;
    }
}

// ========== LIBRARY CLASS ==========
class Library {
    constructor() {
        this.books = [];
        this.container = document.getElementById('library-container');
        this.emptyMessage = document.getElementById('empty-message');
    }

    addBook(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        this.books.push(newBook);
        this.displayBooks();
    }

    removeBook(bookId) {
        const bookIndex = this.books.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            this.books.splice(bookIndex, 1);
            this.displayBooks();
        }
    }

    findBook(bookId) {
        return this.books.find(book => book.id === bookId);
    }

    displayBooks() {
        // Clear container
        this.container.innerHTML = '';

        // Show empty message if no books
        if (this.books.length === 0) {
            this.emptyMessage.style.display = 'block';
            this.container.appendChild(this.emptyMessage);
            return;
        }

        // Hide empty message
        this.emptyMessage.style.display = 'none';

        // Create book cards
        this.books.forEach(book => {
            const bookCard = this.createBookCard(book);
            this.container.appendChild(bookCard);
        });
    }

    createBookCard(book) {
        const bookCard = document.createElement('div');
        bookCard.className = `book-card ${book.read ? 'read' : 'not-read'}`;
        bookCard.dataset.id = book.id;

        bookCard.innerHTML = `
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Pages:</strong> ${book.pages}</p>
            <div class="status">${book.read ? 'Read' : 'Not Read'}</div>

            <div class="book-actions">
                <button class="toggle-read-btn" title="${book.read ? 'Mark Unread' : 'Mark Read'}">
                    ${book.read ? '👁️‍🗨️' : '👁️'}
                </button>
                <button class="remove-btn" title="Remove Book">
                    🗑️
                </button>
            </div>
        `;

        return bookCard;
    }
}

// ========== UI CONTROLLER CLASS ==========
class UIController {
    constructor(library) {
        this.library = library;
        this.bookForm = document.getElementById('book-form');
        this.addBookForm = document.getElementById('add-book-form');
        this.showFormBtn = document.getElementById('show-form-btn');
        this.cancelBtn = document.getElementById('cancel-btn');
        
        this.initEventListeners();
    }

    initEventListeners() {
        // Show form button
        this.showFormBtn.addEventListener('click', () => this.showForm());

        // Cancel button
        this.cancelBtn.addEventListener('click', () => this.hideForm());

        // Form submission
        this.addBookForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

        // Event delegation for book actions
        this.library.container.addEventListener('click', (e) => this.handleBookAction(e));
    }

    showForm() {
        this.bookForm.style.display = 'block';
        this.showFormBtn.style.display = 'none';
    }

    hideForm() {
        this.bookForm.style.display = 'none';
        this.showFormBtn.style.display = 'block';
        this.addBookForm.reset();
    }

    handleFormSubmit(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const pages = parseInt(document.getElementById('pages').value);
        const read = document.getElementById('read-status').checked;

        if (!title || !author || !pages || pages <= 0) {
            alert('Please fill in all fields correctly!');
            return;
        }

        this.library.addBook(title, author, pages, read);
        this.hideForm();
    }

    handleBookAction(event) {
        const bookCard = event.target.closest('.book-card');
        if (!bookCard) return;

        const bookId = bookCard.dataset.id;
        const book = this.library.findBook(bookId);

        if (!book) return;

        if (event.target.classList.contains('remove-btn')) {
            this.library.removeBook(bookId);
        }

        if (event.target.classList.contains('toggle-read-btn')) {
            book.toggleRead();
            this.library.displayBooks();
        }
    }
}

// ========== INITIALIZE APPLICATION ==========
document.addEventListener('DOMContentLoaded', function() {
    // Create library instance
    const myLibrary = new Library();

    // Create UI controller
    const uiController = new UIController(myLibrary);

    // Add sample books
    myLibrary.addBook('The Hobbit', 'J.R.R. Tolkien', 295, true);
    myLibrary.addBook('The Great Gatsby', 'F. Scott Fitzgerald', 218, false);
});