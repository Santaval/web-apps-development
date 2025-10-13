// Function to handle form submission
async function sendForm(event){
    event.preventDefault();

    var form = document.querySelector(".students");
    var data = new FormData(form);
    
    // Determine which button was clicked
    var submittedButton = event.submitter || event.target.querySelector("input[type=submit]:focus");
    
    var url = "";
    if(submittedButton.value == "insert") {
        url = "/students";
    } else if(submittedButton.value == "update") {
        url = `/students/${data.get("carnet")}`;
    }

    try {
        data.set("carnet", parseInt(data.get("carnet"))); // Ensure carnet is a int
        var serverRes = await fetch(url, {
            body: data,
            method: submittedButton.value == "insert" ? "POST" : "PUT"
        });

        var res = await serverRes.json();
        Swal.fire({ icon: "info", title: res.message || "Operación exitosa" });
        
        // Clear form after successful operation
        form.reset();
        
    } catch(error) {
        console.error("Error enviando form:", error);
        Swal.fire({ icon: "error", title: "Error del servidor" });
    }
}