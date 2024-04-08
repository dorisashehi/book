const myLibrary = []; //array to save books added

class Book {

    constructor(title, author, pages, description, read = false) {
        console.log(read)
      this.title = title
      this.author = author
      this.pages = pages
      this.description = description
      this.read = read
    }

    get title() {
      return this._title;
    }

    set title(title) {

      this._title = title;
    }

    get author(){
      return this._author;
    }

    set author(author) {

      this._author = author;
    }

    get pages(){
      return this._pages;
    }

    set pages(pages) {

      this._pages = pages;
    }

    get description(){
      return this._description;
    }

    set description(description) {

      this._description = description;
    }

    get read(){
      return this._read;
    }

    set read(read) {

      this._read = read;
    }

    toggleReadStatus(){
        this.read = !this.read
    }


}

function seedBooks(){ //function test to add some fake books
    myLibrary.push(
        new Book("Hobbit", "J.R.R. Tolkien", 29, "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the "),
        new Book("New Storem", "Cicero", 295, "There are many variations of passages of Lorem Ipsum available, but the majority have suffered alter"),
        new Book("Lorem Ipsum ", "Richard", 500, "Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of de Finibus Bonorum et Malorum (The Extremes o)"),

    )
}

function loadBooks(){ //function to loaf books
    const bookContainer = document.querySelector(".line");
    var content = ""

    if(myLibrary.length > 0)
    {
        content = myLibrary.map((book, index) => getColumns(book, index)).join('')
    }
    else{
        const emptyContent = document.createElement("div")
        emptyContent.classList.add("col")
        emptyContent.textContent = "No books available! Add a new one."
        content = emptyContent.outerHTML
    }
    bookContainer.innerHTML = content
    addEventListeners()
}

function getColumns(book, index){ //function to get books in columns

    return(
        `
            <div class="col-lg-4 col-md-6 col-sm-12 column pb-3 max-h-96">

                <div class="card mb-3" style="max-width: 540px; height: 100%;">
                    <div class="row g-0 h-100">
                        <div class="remove-icon" data-getid="${index}">
                            <i class="fas fa-remove" alt="Remove Book"></i>
                        </div>
                        <div class="col-md-4 col-sm-12">
                            <img src="./assets/images/book.jpg" alt="Trendy Pants and Shoes" class="img-fluid rounded-start">
                        </div>
                        <div class="col-md-8 col-sm-12 p-lg-0">
                            <div class="card-body pl-lg-0 pl-sm-3 pr-lg-5 pr-sm-3">
                                <h5 class="card-title"><b>${book.title}</b></h5>
                                <p class="card-text">
                                    <b>By:</b> ${book.author}
                                </p>
                                <p class="card-text card-description">
                                    <span>${book.description}</span>
                                </p>
                                <div class="form-check">
                                    <input type="checkbox" class="form-check-input" id="status" ${(book.read)? "checked" : ""} name="status" data-id="${index}">
                                    <label class="form-check-label" for="status">Mark as read</label>
                                </div>
                                <p class="card-text">
                                    <small class="text-muted">${book.pages} pages</small>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `
    )

}


function addEventListeners() { //listeners to change status and remove books
    getRemoveCard();
    changeStatus();
}

function getRemoveCard(){ //function to remove a book
    const removeBtn = document.querySelectorAll(".remove-icon");
    Array.from(removeBtn).map((btn) => {
        btn.addEventListener("click", () => {
            const id = btn.getAttribute('data-getid')
            myLibrary.splice(id, 1);
            loadBooks()
        })
    })
}

function changeStatus(){ //function to change the status of the book
    const statusCheck = document.querySelectorAll('.card-body #status')
    Array.from(statusCheck).map((checkbox, index) => {
        checkbox.addEventListener('click', () => {
            myLibrary[index].toggleReadStatus()
            loadBooks() //refresh
        })
    })
}


function addNewBook(){ //function to add a book

    const dialog = document.getElementById("dialog");
    const submitBtn = document.getElementById("submit");
    const form = dialog.querySelector("form")
    let errors = [];
    let isRead = false;

    const status = form.elements["status"];
    status.addEventListener("click", () => isRead = !isRead); //change read to not read

    const inputs = [title, author, pages, description]; //input fields
    inputs.map((item) => { //on value change
        item.addEventListener("input", () => { //validate input fields on change input
            validateInputs(item, errors)
        })
    })

    submitBtn.addEventListener("click", (e) => { //on button click

        errors = [];
        if( title.value !== '' &&
            author.value !== '' &&
            pages.value !== '' &&
            description.value !== '' &&
            status.value !== '' &&
            errors.length == 0
        ){
            myLibrary.push(new Book(title.value,author.value,pages.value,description.value,isRead))
            loadBooks() //refresh withouts loading
            removeErrors(inputs);
        }
        else{
            e.preventDefault();
            showErrors(inputs)
        }
    });

    const closeDialog = dialog.querySelector("#js-close");
    closeDialog.addEventListener("click", (e) => { //close dialog box
        e.preventDefault();
        dialog.close();
    });

}
function openDialogBox(){ //function to open the dialog box
    const openDialog = document.getElementById("open-dialog");
    openDialog.addEventListener("click", () => {
        dialog.showModal()
    })
}


function validateInputs(item, index){ //function to validate input fields of dialog box

    const textRegExp =  /^[a-zA-Z]/;
    let elementError = item.nextElementSibling;
    let error = true;

    if (item.name == "pages" &&  item.value > 0) error = false;
    if(textRegExp.test(item.value)) error = false;

    if(error) {
        elementError.classList.add("error"); errors.push(item)
    }
    else  elementError.classList.remove("error")

}

function showErrors(inputs){ //function to show errors
    inputs.map((item) => {
        if(item.value === '') item.nextElementSibling.classList.add("error")
    })
}

function removeErrors(inputs){ //function to remove errors
    errors = []; //remove errors
    inputs.map((item) => {
        if(item.value === '') item.nextElementSibling.classList.remove("error");
        item.value = '';
    })
}

document.addEventListener("DOMContentLoaded", () => { //main function
    const dialog = document.getElementById("dialog");
    seedBooks()  //defaut values
    loadBooks()  //load all books
    addNewBook() //add new book
    openDialogBox() //open dialog box
});
