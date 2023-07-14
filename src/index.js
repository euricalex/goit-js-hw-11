import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const inputText = document.querySelector("input[type='text']");
const btnSubmit = document.querySelector("button[type='submit']");
const galleryList = document.querySelector('.gallery');
const loadMoreBtn = document.querySelector('.load-more');

searchForm.addEventListener('submit', onSubmit);
loadMoreBtn.addEventListener('click', loadMoreImages);
// hideLoadMoreButton();

let currentPage = 1;
let totalHits = 0;
const resultsPerPage = 40;

const MY_KEY = '38235437-3b164ab9bac08b48d72521750';
const BASE_URL = `https://pixabay.com/api/?key=${MY_KEY}&q=`;

async function onSubmit(event) {
  event.preventDefault();
  const input = inputText.value;
  if (input) {
    currentPage = 1;
    await searchImages(input);
  }

}

async function loadMoreImages() {
  currentPage++;
  await searchImages(inputText.value);
 
}


async function searchImages(query) {
  const url = `${BASE_URL}&q=${encodeURIComponent(query)}&image_type=photo&orientation=horizontal&safesearch=true&page=${currentPage}&per_page=${resultsPerPage}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
   

    if (data.hits.length === 0) {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
      hideLoadMoreButton();
   
      return;
    }

    if (currentPage === 1) {
      galleryList.innerHTML = '';
      
    }

    totalHits = data.totalHits;
    renderGallery(data.hits);

    if (currentPage * resultsPerPage >= totalHits) {
  
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
      hideLoadMoreButton();
    } else {
      showLoadMoreButton();
    }

    initializeLightbox();
  } catch (error) {
    console.log('Error:', error);
    if (error instanceof TypeError) {
      Notiflix.Notify.failure("An error occurred. Please try again later.");
      galleryList.appendChild(loadMoreBtn);
    } else {
      Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    }
    hideLoadMoreButton();
  }
}

function renderGallery(images) {
  images.forEach(image => {
    const galleryItem = document.createElement('div');
    galleryItem.classList.add('photo-card');

    galleryItem.innerHTML = `
      <div class="photo-card">
        <a href="${image.largeImageURL}" data-caption="${image.tags}">
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info-item">
            <b>Likes:</b> ${image.likes}
          </p>
          <p class="info-item">
            <b>Views:</b> ${image.views}
          </p>
          <p class="info-item">
            <b>Comments:</b> ${image.comments}
          </p>
          <p class="info-item">
            <b>Downloads:</b> ${image.downloads}
          </p>
        </div>
      </div>`;
    galleryList.appendChild(galleryItem);
  });
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
  });
}

function hideLoadMoreButton() {
  loadMoreBtn.style.display = 'none';
}

function showLoadMoreButton() {
  loadMoreBtn.style.display = 'block';
}
function refreshLightBox () {
  SimpleLightbox.refresh();
}
