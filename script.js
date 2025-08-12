const apiKey = '51744249-2fec9ec73e1d41fc49a4b661a';  // Replace with your actual Pixabay API key

const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const gallery = document.getElementById('gallery');
const noResults = document.getElementById('noResults');

async function fetchImages(query) {
  const url = `https://pixabay.com/api/?key=${apiKey}&q=${encodeURIComponent(query)}&image_type=photo&per_page=20&category=places`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data.hits.length > 0) {
      displayImages(data.hits);
      noResults.textContent = '';
    } else {
      gallery.innerHTML = '';
      noResults.textContent = 'No images found. Try another country.';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    noResults.textContent = 'Error fetching images. Please try again later.';
  }
}

function displayImages(images) {
  gallery.innerHTML = images
    .map(
      (img) =>
        `<div class="photo">
          <img src="${img.webformatURL}" alt="${img.tags}" />
        </div>`
    )
    .join('');
}

searchBtn.addEventListener('click', () => {
  const query = searchInput.value.trim();
  if (query) {
    fetchImages(query);
  }
});

searchInput.addEventListener('keyup', (event) => {
  if (event.key === 'Enter') {
    searchBtn.click();
  }
});
function displayImages(images) {
  gallery.innerHTML = images
    .map(
      (img) => `
        <div class="photo">
          <img src="${img.webformatURL}" alt="${img.tags}" />
          <button class="fav-btn" data-url="${img.webformatURL}">🤍 Favourite</button>
        </div>`
    )
    .join('');

  // Add fade-in effect on load
  const imgs = document.querySelectorAll('.photo img');
  imgs.forEach(img => {
    img.onload = () => img.classList.add('loaded');
  });

  // Attach event listeners for favourites
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavourite(btn.dataset.url, btn);
    });

    // Check if already in favourites
    if (isFavourite(btn.dataset.url)) {
      btn.textContent = '❤️ Favourited';
    }
  });
}
// Get favourites from localStorage
function getFavourites() {
  return JSON.parse(localStorage.getItem('favourites')) || [];
}

// Save favourites to localStorage
function saveFavourites(favs) {
  localStorage.setItem('favourites', JSON.stringify(favs));
}

// Check if a URL is in favourites
function isFavourite(url) {
  return getFavourites().includes(url);
}

// Toggle favourite state
function toggleFavourite(url, button) {
  let favourites = getFavourites();

  if (favourites.includes(url)) {
    favourites = favourites.filter(item => item !== url);
    button.textContent = '🤍 Favourite';
  } else {
    favourites.push(url);
    button.textContent = '❤️ Favourited';
  }

  saveFavourites(favourites);
}
const viewFavBtn = document.getElementById('viewFavBtn');

viewFavBtn.addEventListener('click', () => {
  const favourites = getFavourites();
  
  if (favourites.length === 0) {
    noResults.textContent = 'No favourites yet. Search and add some!';
    gallery.innerHTML = '';
    return;
  }

  noResults.textContent = '';
  gallery.innerHTML = favourites
    .map(
      (url) => `
        <div class="photo">
          <img src="${url}" alt="Favourite Image" class="loaded" />
          <button class="fav-btn" data-url="${url}">❤️ Remove Favourite</button>
        </div>`
    )
    .join('');

  // Attach remove event
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      toggleFavourite(btn.dataset.url, btn);
      // Refresh the favourites view after removal
      viewFavBtn.click();
    });
  });
});

