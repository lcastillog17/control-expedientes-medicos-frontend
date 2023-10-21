const API_URL = "http://localhost:3000/api/v1";

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");
  if (token) {
    window.location.href = "../index.html";
  }

  const registrationForm = document.getElementById("registration-form");
  const registrationStatus = document.getElementById("registration-status");

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
        alert("Usuario creado exitosamente.");
        window.location.href = "../pages/login.html";
      } else {
        alert("Error en la solicitud de registro.");
      }
    } catch (error) {
      alert("Error en la solicitud de registro.");
    }
  });
});
