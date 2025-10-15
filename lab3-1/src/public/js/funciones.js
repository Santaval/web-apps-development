async function main(){
	
	var divLateral = document.getElementsByClassName("lateral")[0];
	var divContenido = document.getElementsByClassName("contenido")[0];
	var enlacesNavegacion = document.querySelectorAll(".navegar a");
	
	var tituloSitio = document.title;
	var state = { url: "", content: "", title: ""};

	enlacesNavegacion.forEach(function(enlace){
		enlace.addEventListener("click", function() {
			event.preventDefault();
			var url = enlace.getAttribute("href");
			var titulo = tituloSitio + " - " + enlace.innerHTML;
			fetchView(url, titulo);
		});
	});
	
	async function fetchView(url, titulo){
		/* desaparece momentáneamente el div del contenido para modificarlo */
		divContenido.style.opacity = "0";
		
		var respuestaServidor = await fetch(url);
		var textoRecibido =  await respuestaServidor.text();
		
		state = { url: url, content: textoRecibido, title: titulo};
		
		history.pushState(state, null, url);
		
		renderView(textoRecibido, titulo);
	}
	
	function renderView(htmlText, titulo){
		
		var contenido = document.createElement("div");
		contenido.innerHTML = htmlText;
	
		divContenido.innerHTML = ""; // limpia el contenido viejo
		divContenido.append(contenido); // establece el contenido actual
		
		/* cargar manualmente en el DOM los scripts del contenido cargado o no se ejecutarán */
		divContenido.querySelectorAll("script").forEach(function(element){
			var script = document.createElement("script");
			if(element.src){ script.src = element.src; }
			script.appendChild(document.createTextNode(element.innerText));
			divContenido.appendChild(script);
		});
		
		document.title = titulo;
		
		/* espera una pequeña fracción de tiempo antes de volver a mostrar el div del contenido */
		setTimeout(function(){
			divContenido.style.opacity = "1";
		}, 150);
	}

	window.onpopstate = function (event) {
		const state = event.state;
		var contenido = state.content;
		var titulo = state.title;
		renderView(contenido, titulo);
	};
	
	await fetchView("/inicio.html", tituloSitio);
	history.replaceState(state, null, "/");
	
	var scrollhide = document.createElement("div");
	scrollhide.setAttribute("class", "scrollhide d-inline");
	document.getElementsByClassName("principal")[0].append(scrollhide);
}



function setAutocompletar(input, lista, resultados_ul){

	input.oninput = function () {
		var resultados = [];
		var textoIngresado = this.value;
		resultados_ul.innerHTML = "";
		if (textoIngresado.length > 0) { // verificar que el texto no esté vacío
		
			for (i = 0; i < lista.length; i++) {
				if (  lista[i].toLowerCase().includes( textoIngresado.toLowerCase() )  ) {
					resultados.push(lista[i]);
				}
			}
			
			resultados_ul.style.display = "block";
			
			for (i = 0; i < resultados.length; i++) {
				resultados_ul.innerHTML += "<li>" + resultados[i] + "</li>";
			}
		}
	};
	
	resultados_ul.setAttribute("class", "autocompletar");
	resultados_ul.onclick = function (event) {
		var valorElegido = event.target.innerText;
		input.value = valorElegido;
		input.focus();
		this.innerHTML = "";
	};
}

function validarCantidad(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
