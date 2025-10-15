/*
https://expressjs.com/en/starter/hello-world.html
https://www.digitalocean.com/community/tutorials/use-expressjs-to-get-url-and-post-parameters
https://www.npmjs.com/package/mongodb
*/

let express = require("express");
const path = require("path");
var bodyParser = require("body-parser");
var multer = require("multer");

let app = express( );

app.use(bodyParser.json( )); // application/json
app.use(bodyParser.urlencoded({ extended: true })); // application/xwww-form-urlencoded
app.use(multer({ }).any( )); // multipart/form-data


// configurar el directorio para archivos estáticos del cliente (HTML/CSS/JS/Imágenes, etc)
var directorioEstaticos = path.join( __dirname, "public"); // la carpeta 'public' debe estar en el mismo directorio actual
app.use(express.static( directorioEstaticos ));

console.log("Directorio archivos estáticos de cliente: " + directorioEstaticos);

let ipServidor = "0.0.0.0";
let puertoServidor = 5000;

let servidor = app.listen(puertoServidor, ipServidor, function ( ) {
    console.log("Servidor corriendo en http://" + ipServidor + ":" + puertoServidor + " …");
});
