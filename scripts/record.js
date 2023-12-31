const API_URL = "http://localhost:3000/api/v1";

const sessionNotFound = () => {
  alert("No se ha iniciado sesión.");
};

const recordError = () => {
  if (localStorage.getItem("token")) {
    alert("Error al obtener detalles del registro.");
  }
};

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  });

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./login.html";
    sessionNotFound();
  } else {
    const recordDetails = document.getElementById("record-details");

    // Obtiene el ID del registro que se desea visualizar (puedes pasarlo como parámetro en la URL o mediante localStorage).
    const recordId = localStorage.getItem("recordId"); // Supongamos que has almacenado el ID previamente.

    if (recordId) {
      // Realizar una solicitud al servidor para obtener los detalles del registro con el ID proporcionado.
      fetch(`${API_URL}/patientRecords/${recordId}`, {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((response) => response.json())
        .then((record) => {
          // Genera la estructura HTML para mostrar la información completa del registro.
          const recordHTML = `
          <h2>${record.firstName} ${record.lastName}</h2>
          <p><span class="record-field-label">ID del Paciente:</span> ${record.patientId}</p>
          <p><span class="record-field-label">Fecha de Nacimiento:</span> ${new Date(record.dateOfBirth).toLocaleDateString()}</p>
          <p><span class="record-field-label">Género:</span> ${record.gender}</p>
          <p><span class="record-field-label">Dirección:</span> ${record.address.street}, ${record.address.city}, ${record.address.state}, ${record.address.postalCode}</p>
          <h3>Historial Médico</h3>
          <p><span class="record-field-label">Condiciones Previas:</span> ${record.medicalHistory.priorConditions.join(", ") || "N/A"}</p>
          <p><span class="record-field-label">Alergias:</span> ${record.medicalHistory.allergies.join(", ") || "N/A"}</p>
          <p><span class="record-field-label">Medicamentos Actuales:</span> ${record.medicalHistory.currentMedications.join(", ") || "N/A"}</p>
      `;
          recordDetails.innerHTML = recordHTML;
        })
        .catch((error) => {
          recordError();
        })
        .finally(() => {
          localStorage.removeItem("recordId");
        });
    } else {
      window.location.href = "./records-list.html";
      recordError();
    }
  }
});
