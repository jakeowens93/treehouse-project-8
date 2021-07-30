//
// Variables
//
let employees = [];
const urlAPI = `https://randomuser.me/api/?results=12&inc=name, picture,
email, location, phone, dob &noinfo &nat=US`
const gridContainer = document.querySelector(".grid-container");
const overlay = document.querySelector(".overlay");
const modalContainer = document.querySelector(".modal-content");
const modalClose = document.querySelector(".modal-close");
const arrowLeft = document.querySelector(".arrow-l");
const arrowRight = document.querySelector(".arrow-r");
const cards = document.querySelectorAll('.card');
const search = document.querySelector('#search');
let modalIndex;


//
// Fetch
//
fetch(urlAPI)
    .then(res => res.json())
    .then(res => res.results)
    .then(displayEmployees)
    .catch(err => console.log(err))

//
// Helper Functions
//

function displayEmployees(employeeData){
    employees = employeeData;

    // store the employee HTML as it's created
    let employeeHTML = '';

    //loop through each employee and create HTML markup
    employees.map((employee, index) => {
        let name = employee.name;
        let email = employee.email;
        let city = employee.location.city;
        let picture = employee.picture;

        employeeHTML += `
        <div class="card" data-index="${index}">
          <img class="avatar" src="${picture.large}" />
            <div class="text-container">
                <h2 class="name">${name.first} ${name.last}</h2>
                <p class="email">${email}</p>
                <p class="address">${city}</p>
            </div>
        </div>
        `
    });
    gridContainer.innerHTML = employeeHTML;
}
//
// Display Modal Function
//
function displayModal(index){
    // use object destructuring to make template literal cleaner
    let {name, dob, phone, email, location: {city, street, state, postcode}, picture} = employees[index];
    let date = new Date(dob.date);

    const modalHTML=`
    <img class="avatar" src="${picture.large}"/>
    <div class="text-container">
        <h2 class="name">${name.first} ${name.last}</h2>
        <p class="email">${email}</p>
        <p class="address">${city}</p>
        <hr>
        <p>${phone}</p>
        <p class="address">${street.number} ${street.name} ${city}, ${state} ${postcode}</p>
        <p>Birthday: 
        ${date.getMonth()}/${date.getDate()}/${date.getFullYear()}</p>
    </div>
    `;
    overlay.classList.remove("hidden");
    modalContainer.innerHTML = modalHTML;
    modalIndex = index;
}

gridContainer.addEventListener("click", e=>{

if(e.target !== gridContainer){
    const card = e.target.closest('.card');
    const index = card.getAttribute('data-index');
    displayModal(index);
}
});

modalClose.addEventListener('click', ()=>{
    overlay.classList.add('hidden');
});

//
// Arrow Controls
//
arrowLeft.addEventListener('click', e =>{
    if(modalIndex > 0){
        modalIndex --;
        displayModal(modalIndex)
    } else {
        modalIndex = 11;
        displayModal(modalIndex);
    }
});

arrowRight.addEventListener('click', e =>{
    if(modalIndex < 11){
        modalIndex ++;
        displayModal(modalIndex)
    } else { 
        modalIndex = 0;
        displayModal(modalIndex);
    } 
});

//
// Search Filter
// 
const searchHandler = event => {
    const cardName = document.querySelectorAll('h2.name');
    const searchTerm = event.target.value.toLowerCase();

    cardName.forEach( cardName => {
        const cardText = cardName.textContent.toLowerCase();
        const card = cardName.parentElement.parentElement;

        if (cardText.includes(searchTerm)) {
            card.style.display = "block";
        } else {
            card.style.display ="none";
        }
    });
}