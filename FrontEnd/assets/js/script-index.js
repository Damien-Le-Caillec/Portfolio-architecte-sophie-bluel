let worksData = [];

// Récupération des woks depuis l'API
async function getWorks() {
    const reponseWorks = await fetch('http://localhost:5678/api/works');
    worksData = await reponseWorks.json();
    console.log(worksData);
    createGallery(worksData);
}

// Création de la galerie d'images
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

// Récupération des catégories depuis l'API
async function getCategories() {
    const reponseCategories = await fetch('http://localhost:5678/api/categories');
    const categories = await reponseCategories.json();
    console.log(categories);
    createFilter(categories);
   
}

// Création des boutons de catégories
function createFilter(categories) {
    const filter = document.getElementById("filter");
    
    const allButton = document.createElement("button");
    allButton.textContent = "Tous";
    allButton.setAttribute("data-category", "all");
    allButton.classList.add("active");
    filter.appendChild(allButton);

    const buttons = [allButton];

    for (let i = 0; i < categories.length; i++) {
        const article = categories[i];

        const button = document.createElement("button");
        button.textContent = article.name;
        button.setAttribute("data-category", article.id);

        filter.appendChild(button);
        buttons.push(button);
    }

    filter.addEventListener("click", (event) => {
        console.log(event.target.getAttribute("data-category"));
        const categoryId = event.target.getAttribute("data-category");

        if (!categoryId) return;

        buttons.forEach(btn => btn.classList.remove("active"));

        event.target.classList.add("active");

        filterWorks(categoryId)
    })
}

// Filtrage des travaux en fonction de la catégorie
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

// modale contenu 
function modaleGallery(works) {
    const galleryModal = document.getElementById("gallery-modal");
    galleryModal.innerHTML = ""; 

    for (let i = 0; i < works.length; i++) {
        const article = works[i];

        const figure = document.createElement("figure");
        figure.setAttribute("data-id", article.id);
        figure.setAttribute("data-category", article.categoryId);

        const img = document.createElement("img");
          img.src = article.imageUrl;
          img.alt = article.title;

        const button = document.createElement("button");
        button.classList.add("fa-solid", "fa-trash-can", "delete-btn");
        button.setAttribute("data-id", article.id);

        button.addEventListener("click", async () => {
            const confirmDelete = confirm("Supprimer le work ?");
            if (!confirmDelete) return;

            const success = await deleteWork(article.id);
            if (!success) {
                alert("Erreur de la suppression");
            }
        });
        
        
        figure.appendChild(img);
        figure.appendChild(button);
        galleryModal.appendChild(figure);
    }
};

// Suppression d'une image dans la modale

async function deleteWork(workId) {
    try {
        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("authToken")}`,
                "content-Type": "application/json"
            }
        });
        if (!response.ok) {
            throw new Error(`Échec de la suppression du work - Statut : ${response.status}`);
        }

        console.log(`Work ${workId} supprimé avec succès`);

        const element = document.querySelector(`[data-id="${workId}"]`);
        if (element) {
            element.remove();
        } else {
            console.warn(`Aucun élément trouvé avec l'ID ${workId}`);
        }

        return true;

    } catch (error) {
        console.error("Erreur :", error);
        return false;
    }
};

 // Catégories du menu déroulant
async function loadCategories() {
    try {
      const res = await fetch("http://localhost:5678/api/categories");
      const categories = await res.json();
      const select = document.getElementById("category-select");
      select.innerHTML = '<option value="" disabled selected></option>';
      categories.forEach(cat => {
        const option = document.createElement("option");
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
      });
    } catch (error) {
      console.error("Erreur chargement catégories :", error);
    }
}

// Fonction principale
document.addEventListener("DOMContentLoaded", () => {

    getWorks();
        
    //gestion de l'affichage des éléments en fonction de l'authentification
    const authToken = localStorage.getItem("authToken");
    const editElements = document.querySelectorAll(".edit-mode");
    const normalElements = document.querySelectorAll(".normal-mode");
    console.log("authToken :", authToken);
    if (authToken) {
        for (let i = 0; i < editElements.length; i++) {
            editElements[i].style.display = "block";
        }
        for (let i = 0; i < normalElements.length; i++) {
            normalElements[i].style.display = "none";
        }
    } else {
        for (let i = 0; i < editElements.length; i++) {
            editElements[i].style.display = "none";
        }
        for (let i = 0; i < normalElements.length; i++) {
            normalElements[i].style.display = "block";
        }
    }

    //Deconnection de l'utilisateur
    document.getElementById("logout-link").addEventListener("click", () => {
        localStorage.removeItem("authToken");
        window.location.href = "index.html";
    });

    // Modale1 ouverture-fermeture
    const modal1 = document.querySelector(".modal1");
        const btnOpen1 = document.querySelector(".open-modal1");
        const btnClose1 = document.querySelector(".close-modal1");

        btnOpen1.addEventListener("click", (event) => {
            modal1.showModal();
            modaleGallery(worksData);
        });

        btnClose1.addEventListener("click", function () {
            modal1.close();
        });

        modal1.addEventListener("click", function (event) {
            if (event.target === modal1) {
                modal1.close();
            }
        })

        window.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' || e.key === 'Esc') {
                modal1.close();
            }
        });

    // Modale2 ouverture-fermeture
    getCategories();
    const modal2 = document.querySelector(".modal2");
    const btnOpen2 = document.querySelector(".open-modal2");
    const btnReturnModal1 = document.querySelector(".return-modal1");
    const btnClose2 = document.querySelector(".close-modal2");

    btnOpen2.addEventListener("click", (event) => {
        modal1.close();
        modal2.showModal();
    });

    btnReturnModal1.addEventListener("click", (event) => {
        modal2.close();
        modal1.showModal();
    });

    btnClose2.addEventListener("click", function () {
        modal2.close();
        
    });

    modal1.addEventListener("click", function (event) {
        if (event.target === modal2) {
            modal2.close();
        }
    })

    window.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' || e.key === 'Esc') {
            closeModal(e)
        }
    });
    

    // Gestion de l'upload d'une photo 
    loadCategories();
    const uploadedPhotoDiv = document.getElementById("uploaded-photo");
    const fileInput = document.getElementById("file-input");
    const photoPlaceholder = document.getElementById("photo-placeholder");

    fileInput.addEventListener("change", () => {
        const imageToProcess = fileInput.files[0];
        if (!imageToProcess) return;

        const newImage = new Image();
        newImage.src = URL.createObjectURL(imageToProcess);

        newImage.onload = () => {
            newImage.style.width = "100%";
            newImage.style.height = "100%";
            newImage.style.objectFit = "cover";

            uploadedPhotoDiv.innerHTML = "";
            uploadedPhotoDiv.appendChild(newImage);

            photoPlaceholder.style.display = "none";
            uploadedPhotoDiv.style.display = "block";
        };

// Ajout du work
  const submitAddPhoto = document.getElementById("submit-add-photo");
  submitAddPhoto.addEventListener("click", async (event) => {
    event.preventDefault();

    const file = document.getElementById("file-input").files[0];
    const title = document.getElementById("title").value;
    const categoryId = document.getElementById("category-select").value;

    if (!file || !title || !categoryId) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("title", title);
    formData.append("category", Number(categoryId));

    console.log("Data à envoyer :")
        for (let pair of formData.entries()) {
            console.log(`${pair[0]}: ${pair[1]}`);
        }
        
        console.log(formData.get("image"));

    try {
      const response = await fetch("http://localhost:5678/api/works", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("authToken")}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error(`Erreur API : ${response.status}`);
      }

      alert("Work ajouté avec succès !");
      document.querySelector(".modal2").close(); // Ferme la modale

      location.reload(); // Recharge la page pour mettre à jour

    } catch (error) {
      console.error("Erreur :", error);
      alert("Une erreur est survenue.");
    }
    });
    });

});

// fetch("http://localhost:5678/api/works")
//     .then(response => response.json())
//     .then(works => {
//         modaleGallery(works);
//     })
//     .catch(error => {
//         console.error("Erreur lors de la récupération des works :", error);
//     });


   

   

  

  












