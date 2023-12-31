const API_URL = "http://localhost:3000/api/v1";

const recordError = () => {
  alert("Error al obtener detalles del registro.");
};

const userCreationSuccess = () => {
  alert("Usuario creado exitosamente.");
};

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "../index.html";
  }

  const registrationForm = document.getElementById("registration-form");

  registrationForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      }).finally(() => {
        localStorage.removeItem("recordId");
      });
      if (response.ok) {
        window.location.href = "../pages/login.html";
        userCreationSuccess();
      } else {
        recordError();
      }
    } catch (error) {
      recordError();
    }
  });
});
