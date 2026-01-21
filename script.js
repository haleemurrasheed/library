// ========== BOOK CONSTRUCTOR ==========
function Book(title, author, pages, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
};

// ========== FORM VALIDATION FUNCTIONS ==========
function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);

    errorElement.textContent = message;
    errorElement.style.display = 'block';
    inputElement.classList.add('error');
}

function clearError(inputId) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);

    errorElement.textContent = '';
    errorElement.style.display = 'none';
    inputElement.classList.remove('error');
}

function validateField(inputId, fieldName) {
    const inputElement = document.getElementById(inputId);
    const value = inputElement.value.trim();

    if (!value) {
        showError(inputId, `${fieldName} must be filled!`);
        return false;
    }

    // Special validation for pages
    if (inputId === 'pages') {
        const pagesValue = parseInt(value);
        if (isNaN(pagesValue) || pagesValue <= 0) {
            showError(inputId, 'Please enter a valid number of pages (minimum 1)');
            return false;
        }
    }

    clearError(inputId);
    return true;
}

function validateForm() {
    let isValid = true;

    // Validate each required field
    if (!validateField('title', 'Book title')) isValid = false;
    if (!validateField('author', 'Author name')) isValid = false;
    if (!validateField('pages', 'Number of pages')) isValid = false;

    return isValid;
}

// ========== WAIT FOR PAGE TO LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    // ========== ELEMENT REFERENCES ==========
    const container = document.getElementById('library-container');
    const emptyMessage = document.getElementById('empty-message');
    const bookForm = document.getElementById('book-form');
    const addBookForm = document.getElementById('add-book-form');
    const showFormBtn = document.getElementById('show-form-btn');
    const cancelBtn = document.getElementById('cancel-btn');

    // Form input elements
    const titleInput = document.getElementById('title');
    const authorInput = document.getElementById('author');
    const pagesInput = document.getElementById('pages');

    // ========== LIBRARY DATA ==========
    const myLibrary = [];

    // ========== CORE FUNCTIONS ==========
    function addBookToLibrary(title, author, pages, read) {
        const newBook = new Book(title, author, pages, read);
        myLibrary.push(newBook);
        displayBooks();
    }

    function removeBook(bookId) {
        const bookIndex = myLibrary.findIndex(book => book.id === bookId);
        if (bookIndex !== -1) {
            myLibrary.splice(bookIndex, 1);
            displayBooks();
        }
    }

    function displayBooks() {
        // Clear container
        container.innerHTML = '';

        // Show empty message if no books
        if (myLibrary.length === 0) {
            emptyMessage.style.display = 'block';
            container.appendChild(emptyMessage);
            return;
        }

        // Hide empty message
        emptyMessage.style.display = 'none';

        // Create book cards
        myLibrary.forEach(book => {
            const bookCard = document.createElement('div');
            bookCard.className = `book-card ${book.read ? 'read' : 'not-read'}`;
            bookCard.dataset.id = book.id;

            // Use simple unicode characters as icons
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

            container.appendChild(bookCard);
        });
    }

    // ========== FORM HANDLING ==========
    showFormBtn.addEventListener('click', function() {
        bookForm.style.display = 'block';
        showFormBtn.style.display = 'none';
        // Clear any existing errors when showing form
        clearError('title');
        clearError('author');
        clearError('pages');
    });

    cancelBtn.addEventListener('click', function() {
        bookForm.style.display = 'none';
        showFormBtn.style.display = 'block';
        addBookForm.reset();
        // Clear errors when cancelling
        clearError('title');
        clearError('author');
        clearError('pages');
    });

    // Real-time validation as user types
    titleInput.addEventListener('input', function() {
        validateField('title', 'Book title');
    });

    authorInput.addEventListener('input', function() {
        validateField('author', 'Author name');
    });

    pagesInput.addEventListener('input', function() {
        validateField('pages', 'Number of pages');
    });

    addBookForm.addEventListener('submit', function(event) {
        event.preventDefault();

        // Validate form
        if (!validateForm()) {
            // Focus on first invalid field
            if (!titleInput.value.trim()) {
                titleInput.focus();
            } else if (!authorInput.value.trim()) {
                authorInput.focus();
            } else if (!pagesInput.value.trim() || parseInt(pagesInput.value) <= 0) {
                pagesInput.focus();
            }
            return;
        }

        const title = titleInput.value.trim();
        const author = authorInput.value.trim();
        const pages = parseInt(pagesInput.value);
        const read = document.getElementById('read-status').checked;

        addBookToLibrary(title, author, pages, read);

        // Reset form and hide it
        addBookForm.reset();
        bookForm.style.display = 'none';
        showFormBtn.style.display = 'block';

        // Clear any error messages
        clearError('title');
        clearError('author');
        clearError('pages');
    });

    // ========== EVENT DELEGATION ==========
    container.addEventListener('click', function(event) {
        const bookCard = event.target.closest('.book-card');
        if (!bookCard) return;

        const bookId = bookCard.dataset.id;
        const book = myLibrary.find(b => b.id === bookId);

        if (!book) return;

        if (event.target.classList.contains('remove-btn')) {
            removeBook(bookId);
        }

        if (event.target.classList.contains('toggle-read-btn')) {
            book.toggleRead();
            displayBooks();
        }
    });

    // ========== INITIALIZE ==========
    // Add sample books
    addBookToLibrary('The Hobbit', 'J.R.R. Tolkien', 295, true);
    addBookToLibrary('The Great Gatsby', 'F. Scott Fitzgerald', 218, false);
});
