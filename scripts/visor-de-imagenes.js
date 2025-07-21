// Configuration: set your image directory and filenames here
const imageDir = './imagenes/paf/23/';
const imageFiles = [
    'kc4b1992_orig.jpg',
    'paf23-221_orig.jpg',
    'paf23-255_orig.jpg',
    'paf23-258_orig.jpg',
    'paf23-310_orig.jpg',
    'paf23-315_orig.jpg',
    'paf23-216_orig.jpg',
    'paf23-247_orig.jpg',
    'paf23-257_orig.jpg',
    'paf23-306_orig.jpg',
    'paf23-311_orig.jpg',
    'paf23-320_orig.jpg',
    // Add more filenames as needed
];

const grid = document.getElementById('image-grid');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

imageFiles.forEach((file, idx) => {
    const a = document.createElement('a');
    a.href = "#";
    const img = document.createElement('img');
    img.src = imageDir + file;
    img.alt = `Exhibit ${idx + 1}`;
    a.appendChild(img);
    a.addEventListener('click', function(e) {
        e.preventDefault();
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightbox.style.display = 'flex';
    });
    grid.appendChild(a);
});

lightboxClose.addEventListener('click', function() {
    lightbox.style.display = 'none';
    lightboxImg.src = '';
});

lightbox.addEventListener('click', function(e) {
    if (e.target === lightbox) {
        lightbox.style.display = 'none';
        lightboxImg.src = '';
    }
});