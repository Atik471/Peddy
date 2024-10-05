/*------- hamburger -------*/
const hamburger = document.getElementById('hamburger')
const mobileMenu = document.getElementById('mobile-menu')

hamburger.addEventListener('click', (event) => {
    mobileMenu.classList.toggle('hidden')
    event.stopPropagation()
})

document.addEventListener('click', (event) => {
    if (!mobileMenu.contains(event.target) && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden')
    }
})