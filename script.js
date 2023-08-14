const apiKey = 'DaYe-aEmAaJxzgjsSuFsjHILYNzY7BWRWTiYgg4bl_k';
const unsplashApiURL = 'https://api.unsplash.com';

const imageContainerEl = document.getElementById('image-container');
const errorContainerEl = document.getElementById('error-container');
const mainHeaderEl = document.getElementById('main-header');
const loaderEl = document.getElementById('loader');

const images = [];

let page = 1;
let count = 5;
let fullHeader = true;
let loadedImagesCount = 0;
let allImagesLoaded = false;

async function getImages() {
  if (page === 1) {
    showLoadingSpinner();
  }

  try {
    const url = `${unsplashApiURL}/photos/random/?client_id=${apiKey}&query=${encodeURIComponent('vans shoes')}&per_page=${count}&page=${page}&count=${count}`;
    const response = await fetch(url);
    const data = await response.json();

    console.log({ data });

    data.forEach((image) => {
      images.push({
        id: image.id,
        user: image.user,
        likes: image.likes,
        href: image.links.html,
        src: image.urls.regular,
        alt: image.alt_description,
        title: image.alt_description,
      });
    });
    displayImages();
    page++;
  } catch (error) {
    console.log('Failed to fetch images - ', error.message);
    errorContainerEl.innerText = error.message;
    loaderEl.hidden = true;
    mainHeaderEl.hidden = true;
    imageContainerEl.hidden = true;
    errorContainerEl.hidden = false;
  }
}

function imageLoaded() {
  loadedImagesCount++;
  if (loadedImagesCount === images.length) {
    allImagesLoaded = true;
    loaderEl.hidden = true;
  }   
}

function displayImages() {
  imageContainerEl.hidden = false;

  const endIndex = (page * count);
  const startIndex = endIndex - count;
  
  images.forEach((image, index) => {
    if (index >= startIndex && index < endIndex) {
      const altTitle = `${image.alt} by ${image.user.name} with ${image.likes} likes`;

      const anchorEl = document.createElement('a');
      setAttributes(anchorEl, {
        href: image.href,
        target: '_blank',
      });
  
      const imgEl = document.createElement('img');
      imgEl.addEventListener('load', imageLoaded);
      setAttributes(imgEl, {
        src: image.src,
        alt: altTitle,
        title: altTitle,
      });

      const photographerEl = document.createElement('span');
      photographerEl.classList.add('photographer');
      photographerEl.innerText = `\nby ${image.user.name}`;

      const likeContainerEl = document.createElement('div');
      likeContainerEl.classList.add('like-container');

      const heartEl = document.createElement('i');
      heartEl.classList.add('fa-regular');
      heartEl.classList.add('fa-heart');

      const likeCountEl = document.createElement('span');
      likeCountEl.classList.add('likes-count');
      likeCountEl.innerText = image.likes;

      likeContainerEl.appendChild(heartEl);
      likeContainerEl.appendChild(likeCountEl);

      const textContainerEl = document.createElement('div');
      textContainerEl.classList.add('text-container');
      textContainerEl.innerText = image.title;
      textContainerEl.appendChild(photographerEl);
      textContainerEl.appendChild(likeContainerEl);
  
      anchorEl.appendChild(imgEl);
      anchorEl.appendChild(textContainerEl);
      imageContainerEl.appendChild(anchorEl);
    }
  });
}

function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

function showLoadingSpinner() {
  loaderEl.hidden = false;
}

window.onload = async () => {
  await getImages();

  window.addEventListener('scroll', () => {
    const scrollPosition = window.innerHeight + window.scrollY;
    const triggerFetchPoint = document.body.offsetHeight - 1000;
    const fetchMoreImages = scrollPosition >= triggerFetchPoint;

    if (window.scrollY > 58) {
      mainHeaderEl.classList.add('minimized');
    }
    
    if (window.scrollY < 45) {
      mainHeaderEl.classList.remove('minimized');
    }

    if (allImagesLoaded && fetchMoreImages) {
      errorContainerEl.hidden = true;
      allImagesLoaded = false;
      getImages();
    }
  });
}
