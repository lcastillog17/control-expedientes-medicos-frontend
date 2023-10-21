const API_URL = "http://localhost:3000/api/v1";

document.addEventListener('DOMContentLoaded', function () {
    const logoutButton = document.getElementById("logout-button");
    logoutButton.addEventListener("click", function (e) {
      e.preventDefault();
      localStorage.removeItem("token");
      window.location.href = "./login.html";
    });
  
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "./login.html";
      alert("No se ha iniciado sesión.");
    }

    const recordForm = document.getElementById('record-form');

    // Obtiene el ID del registro que se desea editar (puedes pasarlo como parámetro en la URL o mediante localStorage).
    const recordId = localStorage.getItem('recordId'); // Supongamos que has almacenado el ID previamente.

    if (recordId) {
        // Realizar una solicitud al servidor para obtener los detalles del registro con el ID proporcionado.
        fetch(`${API_URL}/patientRecords/${recordId}`, {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(record => {
            // Llena los campos del formulario con los datos del registro.
            document.getElementById('patientId').value = record.patientId;
            document.getElementById('firstName').value = record.firstName;
            document.getElementById('lastName').value = record.lastName;
            document.getElementById('dateOfBirth').value = new Date(record.dateOfBirth).toISOString().split('T')[0];
            document.getElementById('gender').value = record.gender;
            
            // Rellena los campos de dirección (si existen).
            if (record.address) {
                document.getElementById('street').value = record.address.street || '';
                document.getElementById('city').value = record.address.city || '';
                document.getElementById('state').value = record.address.state || '';
                document.getElementById('postalCode').value = record.address.postalCode || '';
            }

            document.getElementById('priorConditions').value = record.medicalHistory.priorConditions.join(', ');
            document.getElementById('allergies').value = record.medicalHistory.allergies.join(', ');
            document.getElementById('currentMedications').value = record.medicalHistory.currentMedications.join(', ');
        })
        .catch(error => console.error('Error al obtener detalles del registro:', error))
        .finally(() => {
            localStorage.removeItem("recordId");
        });
    }

    recordForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveChanges(recordId);
    });
});

function saveChanges(recordId) {
    // Obtener los valores de los campos del formulario.
    const patientId = document.getElementById('patientId').value;
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const dateOfBirth = document.getElementById('dateOfBirth').value;
    const gender = document.getElementById('gender').value;
    const street = document.getElementById('street').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const postalCode = document.getElementById('postalCode').value;
    const priorConditions = document.getElementById('priorConditions').value.split(',').map(item => item.trim());
    const allergies = document.getElementById('allergies').value.split(',').map(item => item.trim());
    const currentMedications = document.getElementById('currentMedications').value.split(',').map(item => item.trim());

    // Crear un objeto con los datos del formulario.
    const formData = {
        patientId,
        firstName,
        lastName,
        dateOfBirth,
        gender,
        address: {
            street,
            city,
            state,
            postalCode
        },
        medicalHistory: {
            priorConditions,
            allergies,
            currentMedications
        }
    };

    const url = recordId ? `${API_URL}/patientRecords/${recordId}` : `${API_URL}/patientRecords`;
    const method = recordId ? 'PUT' : 'POST';

    // Realizar una solicitud al servidor para actualizar el registro.
    fetch(url, {
        method,  // Puedes utilizar un método PUT para actualizar el registro.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': localStorage.getItem("token")
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (response.ok) {
            alert('Cambios guardados exitosamente.');
            // Puedes redirigir al usuario a la página de visualización de registros individuales o a otra página deseada.
        } else {
            alert('Error al guardar los cambios. Inténtalo de nuevo.');
        }
    })
    .catch(error => console.error('Error al guardar los cambios:', error))
    .finally(() => {
        localStorage.removeItem('recordId');
        window.location.href = './records-list.html';
    })
}

