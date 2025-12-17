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

// ========== WAIT FOR PAGE TO LOAD ==========
document.addEventListener('DOMContentLoaded', function() {
    // ========== ELEMENT REFERENCES ==========
    const container = document.getElementById('library-container');
    const emptyMessage = document.getElementById('empty-message');
    const bookForm = document.getElementById('book-form');
    const addBookForm = document.getElementById('add-book-form');
    const showFormBtn = document.getElementById('show-form-btn');
    const cancelBtn = document.getElementById('cancel-btn');

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
    });

    cancelBtn.addEventListener('click', function() {
        bookForm.style.display = 'none';
        showFormBtn.style.display = 'block';
        addBookForm.reset();
    });

    addBookForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const title = document.getElementById('title').value.trim();
        const author = document.getElementById('author').value.trim();
        const pages = parseInt(document.getElementById('pages').value);
        const read = document.getElementById('read-status').checked;

        if (!title || !author || !pages || pages <= 0) {
            alert('Please fill in all fields correctly!');
            return;
        }

        addBookToLibrary(title, author, pages, read);

        addBookForm.reset();
        bookForm.style.display = 'none';
        showFormBtn.style.display = 'block';
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
