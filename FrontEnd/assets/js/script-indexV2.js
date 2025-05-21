
let worksData = [];

async function getWorks() {
    const reponseWorks = await fetch('http://localhost:5678/api/works');
    worksData = await reponseWorks.json();
    console.log(worksData);
    createGallery(worksData);
}

function createGallery(works) {
    const gallery = document.getElementById("gallery");
    gallery.innerHTML = ""; 

    for (let i = 0; i < works.length; i++) {
        const article = works[i];

        const figure = document.createElement("figure");
        figure.setAttribute("data-category", article.categoryId);

        const img = document.createElement("img");
          img.src = article.imageUrl;
          img.alt = article.title;

        const caption = document.createElement("figcaption");
        caption.textContent = article.title;

        figure.appendChild(img);
        figure.appendChild(caption);    
        gallery.appendChild(figure);

    }
};



async function getCategories() {
    const reponseCategories = await fetch('http://localhost:5678/api/categories');
    const categories = await reponseCategories.json();
    console.log(categories);
    createFilter(categories);
}

function createFilter(categories) {
    const filter = document.getElementById("filter");

    for (let i = 0; i < categories.length; i++) {
        const article = categories[i];

        const button = document.createElement("button");
        button.textContent = article.name;
        button.setAttribute("data-category", article.id);

        filter.appendChild(button);
    }

    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.setAttribute("data-category", "all");
    allButton.classList.add("active");
    filter.appendChild(allButton);

    const buttons = filter.querySelectorAll("button");
    buttons.forEach((button) => {
        button.addEventListener("click", (event) => {
            const categoryId = event.target.getAttribute("data-category");
            console.log("Catégorie sélectionnée :", categoryId);
            filterWorks(categoryId);
        });
    });
}

function filterWorks(categoryId) {
    let worksFiltered;
    if (categoryId === "all") {
        worksFiltered = worksData;
    } else {
        worksFiltered = worksData.filter(work => work.categoryId == categoryId);
    }
    document.getElementById("gallery").innerHTML = ""; 
    createGallery(worksFiltered);
}

getWorks();
getCategories();



