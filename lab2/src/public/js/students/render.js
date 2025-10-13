// Function to load and display students
async function cargarEstudiantes(){
    var url = "/students";

    try {
        var respuestaServidor = await fetch(url);
        var listaEstudiantes = await respuestaServidor.json();

        var tbody = document.querySelector(".estudiantes tbody");
        tbody.innerHTML = "";

        for(var estudiante of listaEstudiantes){
            var fila = `<tr>
                <td>${estudiante.carnet}</td>
                <td>${estudiante.name}</td>
            </tr>`;
            tbody.innerHTML += fila;
        }
    } catch(error) {
        console.error("Error cargando estudiantes:", error);
    }
}

