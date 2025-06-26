document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.querySelector("#login form");
  const errorMessage = document.createElement("p");
  const showError = document.getElementById("error")

  errorMessage.style.color = "red";
  showError.appendChild(errorMessage);

    if (localStorage.getItem("authToken")) {
    window.location.href = "index.html";
    return;
  }
  
  loginForm.addEventListener("submit", (event) => {
    event.preventDefault();
  
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;
  


  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: { "content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  .then(response => response.json())
  .then(data => {
    if (data.token) {
      localStorage.setItem("authToken", data.token);
      window.location.href = "index.html";
    } else {
      errorMessage.textContent = "Email ou mot de passe incorrect";
    }
  })

  .catch(error => {
    console.error("Erreur :", error);
    errorMessage.textContent = "Une erreur s'est produite.";
  });
});
});