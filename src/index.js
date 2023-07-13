import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const searchForm = document.querySelector('#search-form');
const inputText = document.querySelector("input[type='text']");
const btnSubmit = document.querySelector("button[type='submit']");
const galleryList = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearchFormSubmit);
const MY_KEY = '38235437-3b164ab9bac08b48d72521750';
const BASE_URL = `https://pixabay.com/api/?key=${MY_KEY}&q=`;

function onSearchFormSubmit(event) {
  event.preventDefault();
  const input = inputText.value;
  if (input) {
    const url = `${BASE_URL}${encodeURIComponent(input)}&image_type=photo&orientation=horizontal&safesearch=true`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        if (data.hits.length === 0) {
          Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
        } else {
          console.log(data);
          renderGallery(data.hits);
          initializeLightbox();
        }
      })
      .catch(error => {
        console.log('Error:', error);
        Notiflix.Notify.failure("An error occurred. Please try again later.");
      });
  }
}

function renderGallery(images) {
  galleryList.innerHTML = '';
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

  // refreshLightbox();
}

function initializeLightbox() {
  const lightbox = new SimpleLightbox('.gallery a', {
    captionDelay: 250,
    captionsData: 'alt',
  });
}


  SimpleLightbox.refresh();

  let currentPage = 1;
const resultsPerPage = 40;

  function nextPage() {
    currentPage++;
    searchImages();
  }
  
  // Функція для переходу на попередню сторінку
  function previousPage() {
    if (currentPage > 1) {
      currentPage--;
      searchImages();
    }
  }

