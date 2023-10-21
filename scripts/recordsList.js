const API_URL = "http://localhost:3000/api/v1";

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById("logout-button");
  logoutButton.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.href = "./login.html";
  });

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "./pages/login.html";
    alert("No se ha iniciado sesión.");
  }

  const recordList = document.getElementById("record-list");

  // Realizar una solicitud al servidor para obtener la lista de registros.
  fetch(`${API_URL}/patientRecords`, {
    method: "GET",
    headers: {
      Authorization: token,
    },
  })
    .then((response) => response.json())
    .then((records) => {
      records.forEach((record) => {
        const row = document.createElement("tr");
        row.innerHTML = `
                <td>${record.patientId}</td>
                <td>${record.firstName}</td>
                <td>${record.lastName}</td>
                <td>
                    <button onclick="deleteRecord('${record._id}')">Eliminar</button>
                    <button onclick="modifyRecord('${record._id}')">Modificar</button>
                    <button onclick="viewRecord('${record._id}')">Ver</button>
                </td>
            `;
        recordList.appendChild(row);
      });
    })
    .catch((error) =>
      console.error("Error al obtener la lista de registros:", error)
    )
    .finally(() => {
      localStorage.removeItem("recordId");
    });
});

function deleteRecord(recordId) {
  if (confirm("¿Estás seguro de que quieres eliminar este registro?")) {
    fetch(`${API_URL}/patientRecords/${recordId}`, {
      method: "DELETE",
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.mensaje) {
          window.location.reload();
        } else {
          alert("Error al eliminar el registro.");
        }
      })
      .catch((error) => {
        console.error("Error al eliminar el registro:", error);
        alert("Error al eliminar el registro.");
      });
  }
}

function modifyRecord(recordId) {
  localStorage.setItem("recordId", recordId);
  window.location.href = "./record-form.html";
}

function viewRecord(recordId) {
  localStorage.setItem("recordId", recordId);
  window.location.href = "./record.html";
}