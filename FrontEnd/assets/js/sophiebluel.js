
// gallery 

window.onload = () => {
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
      // gallery.innerHTML = ''; // Test pour voir si ca fonctionne

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
