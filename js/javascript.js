let myLibrary = [
  {
    title: "Moby Dick",
    author: "Herman Melville",
    numOfPages: 752,
    readBook: "Yes",
    image: "https://images-na.ssl-images-amazon.com/images/I/41VnFKC9srL.jpg",
    notes: "I have to admit that as much as I've wanted to really get into this book, knowing it's a classic, I can't commit to finishing it. No matter how many times I restart this book, I just lose steam and never seem to get very far. Sorry, Herman. ¯\_(ツ)_/¯"
  },
  {
    title: "Book 2",
    author: "You",
    numOfPages: 4,
    readBook: "No",
    rating: 5
  },
  {
    title: "Book 3",
    author: "Them",
    numOfPages: 24,
    readBook: "No"
  },
  {
    title: "Book 4",
    author: "Us",
    numOfPages: 10,
    readBook: "Yes"
  },
  {
    title: "The Hobbit (75th Anniversary Edition)",
    author: "J.R.R. Tolkien",
    numOfPages: 320,
    readBook: "Yes",
    image: "https://images-na.ssl-images-amazon.com/images/I/91b0C2YNSrL.jpg",
    rating: 5,
    notes: "As a kid who desperately wished they were an avid reader, but always found themselves bored or disinterested with the books they started, \"The Hobbit\" was a stand-out exception. I remember starting this book for a book report and feeling different about it. I found instead of feeling the way I normally did while reading, I was voraciously consuming each page. To this day \"The Hobbit\" remains one of few books from my childhood I remember fondly and still have a great appreciation for; reserving a special place for it on a small book shelf in my heart."
  }
];

function Book (title, author, numOfPages, readBook) {
  this.title = title,
  this.author = author,
  this.numOfPages = numOfPages,
  this.readBook = readBook,
  this.info = function() {
    return `${title} by ${author}, ${numOfPages} pages, status: ${readBook}`
  }
}

const addBookToLibrary = () => {
  let newBook = Object.create(Book);
  
  newBook.title = document.getElementById("new-book-title").value;
  newBook.author = document.getElementById("new-book-author").value;
  newBook.numOfPages = document.getElementById("new-book-num-of-pages").value;
  newBook.readBook = document.querySelector("input[name='new-book-read']:checked").value;
  newBook.rating = document.getElementById("new-book-rating").value;
  newBook.notes = document.getElementById("new-book-notes").value;
  newBook.image = encodeURI(document.getElementById("new-book-image").value);

  myLibrary.unshift(newBook);
  console.log("New book added!");
  clearNewBookForm();
  listLibraryBooks(myLibrary);
}

const clearNewBookForm = () => {
  const formChildren = document.querySelectorAll(".form-element-wrapper input, .form-element-wrapper textarea");
  for (input of formChildren) {
    input.type === "text" ? input.value = "" : (input.type === "radio" ? (input.id === "new-book-read" ? input.checked = true : input.checked = false) : (input.nodeName === "TEXTAREA" ? input.value = "" : (input.type === "number" ? input.value = "" : null)));
  }
}

const generateCardComponent = (elementType, classToAdd, elementText) => {
  let newElement;
  elementType.indexOf("input") > -1 ? newElement = document.createElement("input") : newElement = document.createElement(elementType);
  if (elementType.indexOf("text") > -1) {
    newElement.setAttribute("type", "text");
    elementText !== undefined ? newElement.value = elementText : null;
  } else if (elementType.indexOf("number") > -1) {
    newElement.setAttribute("type", "number");
    elementText !== undefined ? newElement.value = elementText : null;
  } else {
    newElement = document.createElement(elementType);
    if (elementText !== undefined) {
      const newElementData = document.createTextNode(elementText);
      newElement.appendChild(newElementData); 
    }
  }
  newElement.className += classToAdd;
  return newElement;
}

const clearLibraryDisplay = parentElement => {
  while (parentElement.firstChild) {
    parentElement.removeChild(parentElement.firstChild);
  }
}

const addDeleteEventListeners = () => {
  const deleteBookBtns = document.querySelectorAll(".delete-btn");
  for (btn of deleteBookBtns) {
    btn.addEventListener("click", e => {
      if (confirm('Are you sure you want to delete this book?')) {
        const clickedBtnCardId = e.target.closest(".card").getAttribute("data-card-id");
        myLibrary.splice(clickedBtnCardId, 1);
        listLibraryBooks(myLibrary);
      }
    });
  }
}

const addReadToggleEventListeners = () => {
  const readBookToggles = document.querySelectorAll(".read-toggle__wrapper");
  for (toggle of readBookToggles) {
    toggle.addEventListener("click", e => {
      const clickedtoggleCardId = e.target.closest(".card").getAttribute("data-card-id");
      let currentReadState = myLibrary[clickedtoggleCardId].readBook;
      currentReadState === "Yes" ? myLibrary[clickedtoggleCardId].readBook = "No" : myLibrary[clickedtoggleCardId].readBook = "Yes";
      listLibraryBooks(myLibrary);
    });
  }
}

const addRatingEventListeners = () => {
  const ratingStars = document.querySelectorAll(".rating-star");
  for (star of ratingStars) {
    star.addEventListener("click", e => {
      const rating = e.target.getAttribute("data-rating");
      const clickedStarCardId = e.target.closest(".card").getAttribute("data-card-id");
      myLibrary[clickedStarCardId].rating = rating;
      listLibraryBooks(myLibrary);
    });
  }
}

const generateRating = ratingNum => {
  let starWrapper = generateCardComponent("div", "rating-star__wrapper");
  for (let i = 0; i < 5; i++) {
    let currentStar;
    if (ratingNum > i ) {
      currentStar = generateCardComponent("span", "material-icons rating-star solid", "star");
      currentStar.setAttribute("data-rating", i + 1);
    } else {
      currentStar = generateCardComponent("span", "material-icons rating-star", "star_border");
      currentStar.setAttribute("data-rating", i + 1);
    }
    starWrapper.appendChild(currentStar);
  }
  return starWrapper;
}

const listLibraryBooks = libraryArray => {
  clearLibraryDisplay(bookList);
  const docFrag = new DocumentFragment;
  for (book of libraryArray) {
    // card
    let cardEl = generateCardComponent("div", "card");
    cardEl.setAttribute("data-card-id", libraryArray.indexOf(book));
    // delete btn
    const cardButtons = generateCardComponent("div", "card-section card-btns__wrapper");
    const cardDeleteBtn = generateCardComponent("span", "material-icons delete-btn", "delete_forever");
    cardDeleteBtn.setAttribute("tabindex", "0");
    cardDeleteBtn.setAttribute("title", "Delete book");
    cardButtons.appendChild(cardDeleteBtn);
    // add edit &delete buttons *BEFORE* both left & right wrappers
    cardEl.appendChild(cardButtons);
    let leftWrapper = generateCardComponent("div", "card__inner-wrapper__left");
    // title
    const titleWrapper = generateCardComponent("div", "card-section");    
    const titleTitle = generateCardComponent("span", "card-section-title", "Book Title");
    titleWrapper.appendChild(titleTitle);
    const bookTitle = generateCardComponent("span", "book-title", book.title);
    titleWrapper.appendChild(bookTitle);
    leftWrapper.appendChild(titleWrapper);
    // author
    const authorWrapper = generateCardComponent("div", "card-section");    
    const authorTitle = generateCardComponent("span", "card-section-title", "Author");
    authorWrapper.appendChild(authorTitle);
    const bookAuthor = generateCardComponent("span", "book-author", book.author);
    authorWrapper.appendChild(bookAuthor);
    leftWrapper.appendChild(authorWrapper);
    // numOfPages
    const numOfPagesWrapper = generateCardComponent("div", "card-section");    
    const numOfPagesTitle = generateCardComponent("span", "card-section-title", "Number of Pages");
    numOfPagesWrapper.appendChild(numOfPagesTitle);
    const booknumOfPages = generateCardComponent("span", "book-pages", book.numOfPages);
    numOfPagesWrapper.appendChild(booknumOfPages);
    leftWrapper.appendChild(numOfPagesWrapper);
    // readStatus
    const readStatusWrapper = generateCardComponent("div", "card-section");    
    const readStatusTitle = generateCardComponent("label", "card-section-title", "Read book");
    readStatusTitle.setAttribute("for", "book-read");
    readStatusWrapper.appendChild(readStatusTitle);
    const bookReadStatus = generateCardComponent("input", "book-read hidden");
    bookReadStatus.setAttribute("type", "checkbox");
    bookReadStatus.name = "book-read";
    book.readBook === "Yes" ? bookReadStatus.checked = true : bookReadStatus.checked = false;
    readStatusWrapper.appendChild(bookReadStatus);
    const readToggleWrapper = generateCardComponent("div", "read-toggle__wrapper");
    const readToggleYes = generateCardComponent("span", "read-toggle__no", "No");
    const readToggleBody = generateCardComponent("div", "read-toggle__body");
    const readToggleDot = generateCardComponent("div", "read-toggle__dot");
    const readToggleNo = generateCardComponent("span", "read-toggle__yes", "Yes");
    readToggleWrapper.appendChild(readToggleYes);
    readToggleBody.appendChild(readToggleDot);
    readToggleWrapper.appendChild(readToggleBody);
    readToggleWrapper.appendChild(readToggleNo);
    readStatusWrapper.appendChild(readToggleWrapper);
    leftWrapper.appendChild(readStatusWrapper);
    // rating
    const ratingWrapper = generateCardComponent("div", "card-section");    
    const ratingTitle = generateCardComponent("span", "card-section-title", "rating");
    ratingWrapper.appendChild(ratingTitle);
    const bookRating = generateRating(book.rating);
    ratingWrapper.appendChild(bookRating);
    leftWrapper.appendChild(ratingWrapper);
    // add it all to the left inner wrapper
    cardEl.appendChild(leftWrapper);
    // add the image wrapper & img element
    let rightWrapper = generateCardComponent("div", "card__inner-wrapper__right");
    let cardImageWrapper = generateCardComponent("div", "card__image-wrapper");
    let img;
    if (book.image) {
      img = generateCardComponent("img", "book-img");
      img.setAttribute("src", decodeURI(book.image));
    } else {
      img = generateCardComponent("span", "book-img img-placeholder__wrapper");
      let icon = generateCardComponent("div", "material-icons img-placeholder", "menu_book");
      img.appendChild(icon);
    }
    cardImageWrapper.appendChild(img);
    rightWrapper.appendChild(cardImageWrapper);
    // add the right wrapper to the card element
    cardEl.appendChild(rightWrapper);
    // notes
    // these go beneath the left and right wrappers so it's full-width beneath them
    if (book.notes) {
      const notesWrapper = generateCardComponent("div", "card-section card-notes__wrapper");    
      const notesTitle = generateCardComponent("span", "card-section-title", "Notes");
      notesWrapper.appendChild(notesTitle);
      const bookNotes = generateCardComponent("pre", "book-notes", book.notes);
      notesWrapper.appendChild(bookNotes);
      cardEl.appendChild(notesWrapper);
    }
    // add it all to the document fragment
    docFrag.appendChild(cardEl);
  }
  bookList.appendChild(docFrag);
  addDeleteEventListeners();
  addReadToggleEventListeners();
  addRatingEventListeners();
}

const expandNewBookForm = () => {
  if (!saveNewBookForm.classList.contains("expanded")) {
    saveNewBookForm.classList.add("expanded");
    invisibleBtn.classList.add("block");
  }
}

const closeNewBookForm = () => {
  if (saveNewBookForm.classList.contains("expanded")) {
    saveNewBookForm.classList.remove("expanded");
    invisibleBtn.classList.remove("block");
  }
}


const bookList = document.getElementById("book-list");
const saveBookFormToggle = document.getElementById("new-book-form-toggle");
const saveNewBookForm = document.getElementById("add-new-book-form");
const addNewBookBtn = document.getElementById("save-new-book-btn");
const clearNewBookBtn = document.getElementById("clear-new-book-btn");
const closeNewBookBtn = document.getElementById("close-new-book-btn");
const invisibleBtn = document.getElementById("invisible-btn");

listLibraryBooks(myLibrary);

saveBookFormToggle.addEventListener("click", expandNewBookForm);

closeNewBookBtn.addEventListener("click", closeNewBookForm);

invisibleBtn.addEventListener("click", closeNewBookForm);

saveNewBookForm.addEventListener("submit", e => {
  e.preventDefault();
  addBookToLibrary();
})

clearNewBookBtn.addEventListener("click", () => {
  clearNewBookForm();
});


// const tabIndexFocus = () => {

// }

// $('[tabindex]').focus(function() {
//   $(this).css('outline', 'none');
// });
// $('[tabindex]').keyup(function (e) {
// if(e.key == "Tab") {
//   $(this).css('outline', '');
// }
// });