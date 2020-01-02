//Book Class
class Book{
    constructor(title, author, sno){
       this.title = title;
       this.author = author;
       this.sno = sno;
    }
}

//UI Class
class UI{
    static displayBooks(){
       const Books = Store.getBooks();

       Books.forEach((book) => UI.addBookToList(book));
    }

    static addBookToList(book) {
        const list = document.getElementById('book-list');
        
        const row = document.createElement('tr');
        row.className = `animated slideInUp`;

        row.innerHTML = `
          <td>${book.title}</td>
          <td>${book.author}</td>
          <td>${book.sno}</td>
          <td><a href="#" class="delete"><i class="fa fa-trash" aria-hidden="true"></i></a></td>
        `;

        list.appendChild(row);
    }

    static deleteBook(el) {
        if(el.parentElement.classList.contains('delete')) {
            el.parentElement.parentElement.parentElement.remove();
        }
    }

    static showAlert(message, className) {
        const div = document.createElement('div');

        div.className = `alert alert-${className} animated fadeInUp`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector('#book-form');
        container.insertBefore(div, form);

        //Make it vanish after sometime
        setTimeout(() => document.querySelector('.alert').remove(), 2500);
    }

    static clearFields() {
        document.querySelector('#title').value = '';
        document.querySelector('#author').value = '';
        document.querySelector('#sno').value = '';
    }
}

//Store Class
class Store {
    static getBooks() {
        let books;

        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books; 
    }

    static addBook(book) {
        const books = Store.getBooks();
        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }

    static removeBook(sno) {
        const books = Store.getBooks();

        books.forEach((book, index) => {
            if(book.sno === sno) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}

//Event : Display Books
document.addEventListener('DOMContentLoaded', UI.displayBooks);

//Event : Add a Book
document.querySelector('#book-form').addEventListener('submit', (e) => {
   //prevent submit
   e.preventDefault();

   //Get form values
   const title = document.querySelector('#title').value;
   const author = document.querySelector('#author').value;
   const sno = document.querySelector('#sno').value;

   //Validate
   if(title === '' || author === '' || sno === '') {
       UI.showAlert('Please fill in all the fields', 'info');
   }else {
       //Instantiate book
        const book = new Book(title, author, sno);

        // Add book to UI
        UI.addBookToList(book);

        //Add book to store
        Store.addBook(book);

        //Show success message
        UI.showAlert('Book Added', 'success');

        //Clear Fields
        UI.clearFields();
   }
});

//Event : Remove a Book
document.querySelector('#book-list').addEventListener('click', (e) => {
    //Remove Book from UI
    UI.deleteBook(e.target);

    //Remove Book from Store
    Store.removeBook(e.target.parentElement.parentElement.previousElementSibling.textContent);

    //Show success message
    UI.showAlert('Book Removed', 'success');
});