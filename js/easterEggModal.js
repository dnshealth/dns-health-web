let openmodal = document.querySelectorAll('.modal-open-egg')
for (var i = 0; i < openmodal.length; i++) {
    openmodal[i].addEventListener('click', function(event) {
        event.preventDefault()
        toggleModal()
    })
}

const overlay = document.querySelector('.modal-overlay-egg')
overlay.addEventListener('click', toggleModal)

function toggleModal() {
    const body = document.querySelector('body')
    const modal = document.querySelector('.modal-egg')
    modal.classList.toggle('opacity-0')
    modal.classList.toggle('pointer-events-none')
    body.classList.toggle('modal-active-egg')
}