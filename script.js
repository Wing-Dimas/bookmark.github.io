const body = document.body;
const input = document.querySelector("input[type=text]");
const overlay = document.querySelector(".overlay");

function showFloater() {
  body.classList.add("show-floater");
}

function closeFloater() {
  if (body.classList.contains("show-floater")) {
    body.classList.remove("show-floater");
  }
}

input.addEventListener("focusin", showFloater);
input.addEventListener("focusout", closeFloater);
overlay.addEventListener("click", closeFloater);

// ===============
const bookmarksList = document.querySelector(".bookmarks-list");
const bookmarkForm = document.querySelector(".bookmark-form");
const bookmarkInput = document.querySelector("input[type=text]");
const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
const api = "https://opengraph.io/api/1.1/site";
const apiKey = "cbcaa05c-0518-402a-ac9e-9121c9206325";

fillBookmarkList(bookmarks);

async function createBookmark(e) {
  e.preventDefault();
  if (bookmarkInput.value == "") return;
  // add a new bookmark to the bookmark
  const uri = encodeURIComponent(bookmarkInput.value);

  await fetch(`${api}/${uri}?app_id=${apiKey}`)
    .then((response) => response.json())
    .then((data) => {
      const bookmark = {
        title: data.hybridGraph.title,
        image: data.hybridGraph.image,
        link: data.hybridGraph.url,
      };
      bookmarks.push(bookmark);
    })
    .catch((error) => console.log(error));
  // console.log(bookmark);
  console.log(bookmarks);
  fillBookmarkList(bookmarks);
  storeBookmark(bookmarks);
  bookmarkForm.reset();

  // save that bookmark list to localstorage
}

function fillBookmarkList(bookmarks = []) {
  let bookmarksHtml = bookmarks
    .map((bookmark, i) => {
      return `
      <div class="bookmark">
        <a href="${bookmark.link}"  target="_blank" data-id="${i}">
          <div class="img" style="background-image:url('${bookmark.image}')"></div>
          <div class="title">${bookmark.title}</div>
        </a>
        <i class="bi bi-x"></i>
      </div>`;
    })
    .join("");
  bookmarksList.innerHTML = bookmarksHtml;
}

function removeBookmark(e) {
  if (!e.target.matches(".bi-x")) return;
  // find the index
  const index = e.target.parentNode.dataset.id;
  // remove form the bookmarks using splice
  bookmarks.splice(index, 1);
  // fill the list
  fillBookmarkList(bookmarks);
  // store back to local storage
  storeBookmark(bookmarks);
}

function storeBookmark(bookmarks = []) {
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}

bookmarkForm.addEventListener("submit", createBookmark);
bookmarksList.addEventListener("click", removeBookmark);
