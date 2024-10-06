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

/*------- APIs -------*/
const categoriesURL = `https://openapi.programming-hero.com/api/peddy/categories` // all categories
const categoryURL = `https://openapi.programming-hero.com/api/peddy/category/` // single category by name
const petsURL = `https://openapi.programming-hero.com/api/peddy/pets` // all pets
const petURL = `https://openapi.programming-hero.com/api/peddy/pet/` // single pet by id

/*------- fetch categories -------*/
let categoryList = []

const fetchCategories = async () => {

    try {
      const response = await fetch(categoriesURL)
      const data = await response.json();
      categoryList = await data.categories
    } catch (error) {
      console.error('There was some issue while loading categories:', error)
    }
}
  
async function displayCategories(){
    await fetchCategories()
    const categoryParent = document.getElementById('catagories')
    categoryParent.innerHTML = ''

    categoryList.forEach(cat => {
        const newCat = document.createElement('div')
        newCat.innerHTML = 
        `
            <div class='md:w-[3rem] w-[1.3rem]'>
                <img src = '${cat.category_icon}' alt = '${cat.category}' class='w-full'>
            </div>
            <span class='font-bold md:text-xl text-base'>${cat.category}s</span>
        `
        newCat.classList.add('md:px-12', 'md:py-4', 'p-3', 'flex', 'md:gap-4', 'gap-2', 'justify-center', 'items-center',  'cursor-pointer', 'transition', 'duration-300', 'inactive')
        newCat.setAttribute('id', `cat-${cat.id}`)
    
        categoryParent.appendChild(newCat)

        newCat.addEventListener('click', (event) => {
            activeCat(event, newCat)
        })
    })
}

displayCategories()

/*------- active category -------*/
const activeCat = (event, newCat) => {
    // console.log(newCat.id)

    for(let i = 0; i < categoryList.length; i++){
        document.getElementById(`cat-${i+1}`).classList.remove('active')
        document.getElementById(`cat-${i+1}`).classList.add('inactive')
        console.log(document.getElementById(`cat-${i+1}`))
    }
    
    newCat.classList.remove('inactive')
    newCat.classList.add('active')
}
  
