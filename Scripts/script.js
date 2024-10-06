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
let catDictionary = {}

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

        catDictionary[`cat-${cat.id}`] = `${cat.category}` 
    
        categoryParent.appendChild(newCat)

        newCat.addEventListener('click', (event) => {
            activeCat(event, newCat)
        })
    })
}

displayCategories()



/*------- active category -------*/
let categorized = false

const activeCat = async (event, newCat) => {
    // console.log(newCat.id)

    for(let i = 0; i < categoryList.length; i++){
        document.getElementById(`cat-${i+1}`).classList.remove('active')
        document.getElementById(`cat-${i+1}`).classList.add('inactive')
    }
    
    newCat.classList.remove('inactive')
    newCat.classList.add('active')
    
    await fetchPet(catDictionary[`${newCat.id}`])
    categorized = true
    displayPets(categorized)
}
  


/*------- fetch all pets -------*/
let petList = []

const fetchPets = async () => {
    try {
      const response = await fetch(petsURL)
      const data = await response.json();
      petList = data.pets
    //   console.log(petList)
    } catch (error) {
      console.error('There was some issue while loading categories:', error)
    }
}

/*------- fetch pet by category -------*/
const fetchPet = async (catName) => {
    try {
      const response = await fetch(`${categoryURL}${catName}`)
      const petsOnCat = await response.json();
      petList = petsOnCat.data
    } catch (error) {
      console.error('There was some issue while loading categories:', error)
    }
}
  


async function displayPets(fetchAll){
    
    if(!fetchAll) await fetchPets()
    
    const petParent = document.getElementById('pets')
    petParent.innerHTML = ''

    const noPets = document.getElementById('no-pets')
    if(petList.length === 0)
    {
        petParent.classList.remove('grid')
        petParent.classList.add('hidden')
        noPets.classList.remove('hidden')
    } else{
        petParent.classList.remove('hidden')
        petParent.classList.add('grid')
        noPets.classList.add('hidden')
    }
    
    petList.forEach(pet => {
        const newPet = document.createElement('div')
        newPet.innerHTML = 
        `
            <div class='md:mb-5 mb-3'>
                <img src='${pet.image}' alt='pet-img' class='rounded-md'>
            </div>
            <div class='font-lato pb-4 border-b-2 border-slate-200'>
                <h3 class='name font-inter text-lg font-semibold md:mb-3 mb-2'>${pet.pet_name}</h3>
                <div class='flex gap-2 items-center mb-2'>
                    <img src='images/breed.png' alt='breed-png' class='w-5'  id='${pet.pet_name}-img'>
                    <p class='breed text-base text-custom-gray'>${pet.breed}</p>
                </div>
                <div class='flex gap-2 items-center mb-2'>
                    <img src='images/dob.png' alt='dob-png' class='w-5 '>
                    <p class='dob text-base text-custom-gray'>${pet.date_of_birth}</p>
                </div>
                <div class='flex gap-2 items-center mb-2'>
                    <img src='images/gender.png' alt='gender-png' class='w-5 '>
                    <p class='gender text-base text-custom-gray'>${pet.gender}</p>
                </div>
                <div class='flex gap-2 items-center mb-2'>
                    <img src='images/price.png' alt='price-png' class='w-5 '>
                    <p class='price text-base text-custom-gray'>${pet.price}</p>
                </div>
            </div>
            <div class='pt-4 flex items-stretch justify-between'>
                <button class='transition duration-300 rounded-lg py-1 px-4 unliked-btn' id='${pet.pet_name}-btn'>
                    <img src='images/like.png' alt='like-img' class='w-4'>
                </button>
                <button class='border-2 border-slate-200 hover:border-slate-300 transition duration-300 rounded-lg py-1 px-3 font-semibold text-primary font-lato'>
                    Adopt
                </button>
                <button class='border-2 border-slate-200 hover:border-slate-300 transition duration-300 rounded-lg py-1 px-3 font-semibold text-primary font-lato' id='${pet.pet_name}-details'>
                    Details
                </button>
            </div>
        `

        newPet.classList.add('p-4', 'border-2', 'border-slate-200', 'rounded-lg')
        newPet.setAttribute('id', `pet-${pet.petId}`)
        petParent.appendChild(newPet)

        likefunc(pet)
        viewDetails(pet)

    })
}

displayPets(categorized)

/*------- like pets -------*/
function likefunc(pet){
    let likeBtn = document.getElementById(`${pet.pet_name}-btn`)
    const likedPets = document.getElementById('liked-pets')
    likedPets.innerHTML = ''

    likeBtn.addEventListener('click', () => {
        if(likeBtn.classList.contains('unliked-btn')){
            likeBtn.classList.remove('unliked-btn')
            likeBtn.classList.add('liked-btn')

            let likedPet = document.createElement('img')
            likedPet.setAttribute('src', `${pet.image}`)
            likedPet.setAttribute('alt', `${pet.pet_name}-img`)
            likedPet.classList.add('rounded-md')
            likedPet.setAttribute('id', `${pet.pet_name}-img-liked`)
            likedPets.appendChild(likedPet)
        } else{
            likeBtn.classList.remove('liked-btn')
            likeBtn.classList.add('unliked-btn')

            const childImg = document.getElementById(`${pet.pet_name}-img-liked`)
            likedPets.removeChild(childImg)
        }
})
}


/*------- sort function -------*/
const sortBtn = document.getElementById('sort-btn')
sortBtn.addEventListener('click', async() => {
    petList.sort((a, b) => b.price - a.price)
    
    if(categorized){
        await displayPets(categorized)
    } else{
        await displayPets(!categorized) // don't fetch again
    }
})



/*------- fetch details -------*/
const fetchDetails = async (pet) => {
    try {
      const response = await fetch(`${petURL}${pet.petId}`)
      const data = await response.json();
      const petDetails = data.petData
      return petDetails
    } catch (error) {
      console.error('There was some issue while loading categories:', error)
    }
}



/*------- view details function -------*/
const petModal = document.getElementById('pet-modal')
const detailCancel = document.getElementById('detail-cancel')

detailCancel.addEventListener('click', () => {
    petModal.classList.remove('flex')
    petModal.classList.add('hidden')
})

function viewDetails(pet){    
    const petDetailBtn = document.getElementById(`${pet.pet_name}-details`)
    const detailImg = document.getElementById('detail-img')
    const detailName = document.getElementById('detail-name')
    const detailBreed = document.getElementById('detail-breed')
    const detailBirth = document.getElementById('detail-dob')
    const detailGender = document.getElementById('detail-gender')
    const detailPrice = document.getElementById('detail-price')
    const detailVaccine = document.getElementById('detail-vaccine')
    const detailInfo = document.getElementById('detail-info')

    petDetailBtn.addEventListener('click', async() => {
        const petDetails =  await fetchDetails(pet)

        detailImg.setAttribute('src', `${petDetails.image}`)
        detailName.innerText = petDetails.pet_name
        detailBreed.innerText = petDetails.breed
        detailBirth.innerText = petDetails.date_of_birth
        detailGender.innerText = petDetails.gender
        detailPrice.innerText= petDetails.price
        detailVaccine.innerText = petDetails.vaccinated_status
        detailInfo.innerText = petDetails.pet_details

        petModal.classList.remove('hidden')
        petModal.classList.add('flex')
    })
}