const track = document.getElementById('sliderTrack');
const button = document.getElementById('add-update-btn');

let elementCount = 2;

button.addEventListener('click', () =>{
    elementCount++;

    const newItem = document.createElement('div');
    newItem.classList.add('slider-item');
    newItem.textContent = `Element ${elementCount}`;

    track.appendChild(newItem);

    track.parentElement.scrollTo({
        left: track.scrollWidth,
        behavior: 'smooth'
    });
});