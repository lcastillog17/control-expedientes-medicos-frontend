const API_URL = "http://localhost:3000/api/v1";

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "./pages/login.html";
  });

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./pages/login.html";
    alert("No se ha iniciado sesión.");
  }

  // Verificar si el token está presente y realizar una solicitud al servidor para obtener los datos del usuario logueado.
  fetch(`${API_URL}/users`, {
    method: "GET",
    headers: {
      Authorization: token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.username && data.email) {
        const userInfo = document.getElementById("user-info");
        userInfo.innerHTML = `Usuario: ${data.username}, Correo Electrónico: ${data.email}`;
      } else {
        localStorage.removeItem("token");
        window.location.href = "./pages/login.html";
        alert("Error al obtener los datos del usuario.");
      }
    })
    .catch((error) => {
      localStorage.removeItem("token");
      window.location.href = "./pages/login.html";
      alert("Error al obtener los datos del usuario: ", error.message);
    })
    .finally(() => {
      localStorage.removeItem("recordId");
    });
});
