const API_URL = "http://localhost:3000/api/v1";

const sessionNotFound = () => {
  alert("No se ha iniciado sesión.");
};

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
    sessionNotFound();
  } else {
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
          sessionNotFound();
        }
      })
      .catch((error) => {
        localStorage.removeItem("token");
        window.location.href = "./pages/login.html";
        sessionNotFound();
      })
      .finally(() => {
        localStorage.removeItem("recordId");
      });
  }
});
