/**
 This is a script to Render Easter Egg Modal on "DON'T CLICK" btn click
 **/

let openmodalEgg = document.querySelectorAll('.modal-open-egg')
for (var i = 0; i < openmodalEgg.length; i++) {
    openmodalEgg[i].addEventListener('click', function(event) {
        event.preventDefault()
        toggleModalEgg()
    })
}

const overlayEgg = document.querySelector('.modal-overlay-egg')
overlayEgg.addEventListener('click', toggleModalEgg)

function toggleModalEgg() {
    const body = document.querySelector('body')
    const modal = document.querySelector('.modal-egg')
    modal.classList.toggle('opacity-0')
    modal.classList.toggle('pointer-events-none')
    body.classList.toggle('modal-active-egg')
}
