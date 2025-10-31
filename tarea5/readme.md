PHP SOAP Server + Java Client Implementation (SerPHP_CliJAVA)
============================================================

Server (PHP):
-------------
Directory: SerPHP_CliJAVA/server_php/
File: server.php
- Implements a SOAP server using PHP's built-in SoapServer class (no WSDL, URI mode)
- Exposes four operations: suma (add), resta (subtract), multiplicacion (multiply), division (divide)
- Handles SOAP requests sent to http://localhost/server.php

To run:
1. Make sure you have PHP installed with the SOAP extension enabled.
2. Start a local web server (e.g., Apache) and place `server.php` in the web root or configure so it is accessible at http://localhost/server.php

Client (Java):
--------------
Directory: SerPHP_CliJAVA/client_java/
File: Client.java
- Sends a SOAP request to the PHP server using HttpURLConnection
- Constructs the SOAP XML envelope manually (example: suma operation with a=5, b=3)
- Prints the raw SOAP response from the server

To run:
1. Ensure the PHP SOAP server is running and accessible at http://localhost/server.php
2. Compile the client:
	 javac Client.java
3. Run the client:
	 java Client
4. The output will display the SOAP response from the PHP server

How it works:
-------------
- The Java client builds a SOAP XML envelope and sends it via HTTP POST to the PHP server.
- The PHP server parses the SOAP request, invokes the corresponding method (suma, resta, etc.), and returns a SOAP response.
- The Java client prints the response to the console.

Example SOAP Request (from Java client):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ns="http://localhost/soap">
	<soapenv:Header/>
	<soapenv:Body>
		<ns:suma>
			<ns:a>5</ns:a>
			<ns:b>3</ns:b>
		</ns:suma>
	</soapenv:Body>
</soapenv:Envelope>
```

Key Points:
- No WSDL is used; the PHP server is in non-WSDL mode.
- The Java client must construct the SOAP XML manually.
- The PHP server exposes multiple operations via the Operaciones class.


Java SOAP Server + PHP Client Implementation (SerJAVA_CliPHP)
============================================================

Server (Java):
--------------
Directory: SerJAVA_CliPHP/server_java/
File: SoapServer.java
- Implements a standalone SOAP server using Java's built-in HTTP server (com.sun.net.httpserver)
- Handles both WSDL requests (GET) and SOAP operation requests (POST)
- Exposes a single SOAP operation: findFactors (returns numbers divisible by a given divisor)
- No external dependencies required

To run:
1. Open a terminal in the `SerJAVA_CliPHP/server_java/` directory.
2. Compile the server:
	 javac SoapServer.java
3. Run the server:
	 java SoapServer
4. The server will start at: http://localhost:8080/factorservice
5. WSDL available at: http://localhost:8080/factorservice?wsdl

Client (PHP):
-------------
Directory: SerJAVA_CliPHP/client_php/
File: client.php
- Sends SOAP requests to the Java server using PHP's stream_context_create (no cURL required)
- Constructs the SOAP XML envelope manually for the findFactors operation
- Parses and displays the SOAP response
- Includes test cases for different numbers/divisor inputs

To run:
1. Ensure the Java SOAP server is running and accessible at http://localhost:8080/factorservice
2. Open a terminal in the `SerJAVA_CliPHP/client_php/` directory.
3. Execute the client:
	 php client.php
4. The output will display the results for each test case and the raw SOAP response

How it works:
-------------
- The PHP client builds a SOAP XML envelope for the findFactors operation, specifying a list of numbers and a divisor.
- The Java server receives the SOAP request, parses the numbers and divisor, computes which numbers are divisible by the divisor, and returns them in a SOAP response.
- The PHP client extracts and displays the result from the SOAP response.

Example SOAP Request (from PHP client):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
		<soap:Body>
				<findFactors>
						<numbers>1,5,23,25,35,78,30,96</numbers>
						<divisor>5</divisor>
				</findFactors>
		</soap:Body>
</soap:Envelope>
```

Example SOAP Response (from Java server):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
	<soap:Body>
		<findFactorsResponse>
			<result>5, 25, 35, 30</result>
		</findFactorsResponse>
	</soap:Body>
</soap:Envelope>
```

Key Points:
- The Java server is fully standalone (no Apache/Tomcat required)
- Manual SOAP message handling in both Java and PHP
- WSDL is generated dynamically by the Java server for client introspection
- The PHP client is simple and does not require any external libraries

Comparison to PHP SOAP Server Version:
- Java server is standalone, while the PHP server requires a web server (e.g., Apache)
- Java version demonstrates manual SOAP and WSDL handling, while PHP uses built-in SOAP classes