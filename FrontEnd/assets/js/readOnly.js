console.log("Read only");

//// Ready to be filled with the GET works result
let works = [];

//// Images DOM displayer
const allWorkInjection = (array) => {

    while (gallery.firstChild) {
        gallery.removeChild(gallery.firstChild);
    }

    for (let i = 0; i < array.length; i++) {
        const figure = document.createElement('figure');

        // Create image element
        const image = document.createElement('img');
        image.src = array[i].imageUrl;
        image.alt = array[i].title;

        const figcaption = document.createElement('figcaption');
        figcaption.textContent = array[i].title;
        figure.appendChild(image);
        figure.appendChild(figcaption);
        gallery.appendChild(figure);
    }

};

////Fetches handler
const baseUrl = "http://localhost:5678/api/";

// Launched by workFetcher
const categoriesFetcher = () => {
    console.log("Fetching " + baseUrl + 'categories')
    fetch(baseUrl + 'categories')
        .then((response) => response.json())
        .then((data) => console.log("Succes:", data))
        .catch((error) => console.log(error))
};

// Launched everytime the page is refresh
const worksFetcher = () => {
    console.log("Fetching " + baseUrl + 'works')
    fetch(baseUrl + 'works')
        .then((response) => response.json())
        .then((data) => {
            console.log("Succes:", data)
            works = data;
            allWorkInjection(data);
            categoriesFetcher();
            // An error message is hidden at the bottom of the filter 
            document.querySelector('.connexion-pb').classList.remove('active')
        })
        .catch((error) => {
            console.log(error)
            // An error message appear at the bottom of the filter 
            document.querySelector('.connexion-pb').classList.add('active')
        })
}; worksFetcher();

//// Buttons handler
document.querySelectorAll('.filter-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
        if (btn.dataset.filter == "all") {
            allWorkInjection(works)
        } else if (btn.dataset.filter == "objects") {
            allWorkInjection(
                works.filter((work) => work.categoryId == 1)
            )
        } else if (btn.dataset.filter == "appartments") {
            allWorkInjection(
                works.filter((work) => work.categoryId == 2)
            )
        } else if (btn.dataset.filter == "accomodations") {
            allWorkInjection(
                works.filter((work) => work.categoryId == 3)
            )
        }
    });
});




