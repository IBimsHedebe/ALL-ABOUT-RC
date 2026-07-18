const track = document.getElementById('sliderTrack');
const openModalBtn = document.getElementById('openModalBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const updateDialog = document.getElementById('updateDialog');
const updateForm = document.getElementById('updateForm');

openModalBtn.addEventListener('click', () => {
    document.getElementById('inputDate').valueAsDate = new Date();
    updateDialog.showModal();
})

closeModalBtn.addEventListener('click', () => {
    updateDialog.close();
})

updateForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const dataValue = document.getElementById('inputDate').value;
    const titleValue = document.getElementById('inputTitle').value;
    const contentValue = document.getElementById('inputContent').value;

    const newItem = document.createElement('div');
    newItem.classList.add('slider-item');

    newItem.innerHTML = `
        <span class="update-date" style="font-size: 0.85rem; color: #666;">${dataValue}</span>
        <h4 style="margin: 5px 0 10px 0;">${titleValue}</h4>
        <p style="margin: 0; white-space: normal;">${contentValue}</p>
    `;

    track.appendChild(newItem);

    updateForm.reset();
    updateDialog.close();

    track.parentElement.scrollTo({
        left: track.scrollWidth,
        behavior: 'smooth'
    });
});