const container = document.querySelector('body');
const logo = document.querySelector('#logo');
const form = document.querySelector('#img-form');
const img = document.querySelector('#img');
const outputPath = document.querySelector('#output-path');
const filename = document.querySelector('#filename');
const heightInput = document.querySelector('#height');
const widthInput = document.querySelector('#width');
const preview = document.querySelector('#preview');
const laptop = document.querySelector('#laptop');
const tablet = document.querySelector('#tablet');
const android = document.querySelector('#android');
const iphone = document.querySelector('#iphone');

function loadImage(e) {
  const file = e.target.files[0];

  if (!isFileImage(file)) {
    alertError('Please select an image');
    return;
  }

  const image = new Image();
  image.src = URL.createObjectURL(file);
  preview.src = URL.createObjectURL(file);
  preview.classList.remove('hidden');
  ipcRenderer.send('resize-window');
  container.classList.add('scrollable');

  image.onload = function () {
    widthInput.value = this.width;
    heightInput.value = this.height;
  };

  form.style.display = 'block';
  filename.innerHTML = img.files[0].name;
  outputPath.innerText = path.join(os.homedir(), 'vuetron');
}

function setSize(e) {
  e.preventDefault();
  switch (e.srcElement.id) {
    case 'laptop':
      widthInput.value = 1920;
      heightInput.value = 1200;
      break;
    case 'tablet':
      widthInput.value = 768;
      heightInput.value = 1024;
      break;
    case 'android':
      widthInput.value = 360;
      heightInput.value = 640;
      break;
    case 'iphone':
      widthInput.value = 375;
      heightInput.value = 812;
      break;
  }
}

function isFileImage(file) {
  const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
  return file && acceptedImageTypes.includes(file['type']);
}

function resizeImage(e) {
  e.preventDefault();

  if (!img.files[0]) {
    alertError('Please upload an image');
    return;
  }

  if (widthInput.value === '' || heightInput.value === '') {
    alertError('Please enter a width and height');
    return;
  }

  const imgPath = img.files[0].path;
  const width = widthInput.value;
  const height = heightInput.value;

  ipcRenderer.send('image:resize', {
    imgPath,
    height,
    width,
  });
}

ipcRenderer.on('image:done', () =>
  alertSuccess(`Image resized to ${heightInput.value} x ${widthInput.value}`)
);

function animateLogo(e) {
    e.preventDefault();
    logo.classList.add('resizer');
}

function alertSuccess(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'green',
      color: 'white',
      textAlign: 'center',
    },
  });
}

function alertError(message) {
  Toastify.toast({
    text: message,
    duration: 5000,
    close: false,
    style: {
      background: 'red',
      color: 'white',
      textAlign: 'center',
    },
  });
}

laptop.addEventListener('click', setSize);
tablet.addEventListener('click', setSize);
android.addEventListener('click', setSize);
iphone.addEventListener('click', setSize);
img.addEventListener('change', loadImage);
form.addEventListener('submit', resizeImage);
window.addEventListener('load', animateLogo)