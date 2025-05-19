
function filtersfonction() {
  fetch('http://localhost:5678/api/categories')
      .then(response => {
        if (!response.ok) {
          throw new Error('Réseau non ok');
        }
        return response.json();
      })
      .then(categories => {
        console.log(categories);

        const filter = document.querySelector(".filter");

        categories.forEach(category => {
          const button = document.createElement("button");

          button.textContent = category.name;

          button.setAttribute("data-category", category.id);

          filter.appendChild(button);
        });
      })
      .catch(error => {
        console.error('Erreur avec la requête fetch :', error);
      });
}

function worksfonction() {
  fetch('http://localhost:5678/api/works')
      .then(response => {
        if (!response.ok) {
          throw new Error('Réseau non ok');
        }
        return response.json();
      })
      .then(works => {
        console.log(works);

        const gallery = document.querySelector(".gallery");
        
        works.forEach(work => {
          const figure = document.createElement("figure");

          const img = document.createElement("img");
          img.src = work.imageUrl;
          img.alt = work.title;

          const caption = document.createElement("figcaption");
          caption.textContent = work.title;

          figure.appendChild(img);
          figure.appendChild(caption);

          gallery.appendChild(figure);
        });
      })
      .catch(error => {
        console.error('Erreur avec la requête fetch :', error);
      });
}

    window.onload = () => {
    filtersfonction();
    worksfonction();

    const filter = document.querySelector(".filter");
    const gallery = document.querySelector(".gallery");

    filter.addEventListener("click", (event) => {
        if (event.target.tagName === "BUTTON") {
            const categoryId = event.target.getAttribute("data-category");
            console.log(categoryId); 
            
            fetch(`http://localhost:5678/api/works?category=${categoryId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Réseau non ok');
                    }
                    return response.json();
                })
                .then(works => {
                    console.log(works); 
                    
                    gallery.innerHTML = ""; 

                    if (works.length > 0) {
                        works.forEach(work => {
                            const figure = document.createElement("figure");
                            const img = document.createElement("img");
                            img.src = work.imageUrl; 
                            img.alt = work.title; 
                            const caption = document.createElement("figcaption");
                            caption.textContent = work.title; 

                            figure.appendChild(img);
                            figure.appendChild(caption);
                            gallery.appendChild(figure); 
                        });
                    } else {
                        console.log('Aucun travail trouvé pour cette catégorie.'); 
                    }
                })
                .catch(error => {
                    console.error('Erreur avec la requête fetch :', error);
                });
              }
          });
      };


  
  
   