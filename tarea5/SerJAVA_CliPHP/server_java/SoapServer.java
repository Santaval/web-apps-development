import com.sun.net.httpserver.HttpServer;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpExchange;
import java.io.*;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class SoapServer {
    public static void main(String[] args) throws IOException {
        HttpServer server = HttpServer.create(new InetSocketAddress(8080), 0);
        
        server.createContext("/factorservice", new SoapHandler());
        
        server.setExecutor(null); // creates a default executor
        server.start();
        
        System.out.println("Simple SOAP Server running on http://localhost:8080/factorservice");
        System.out.println("WSDL available at: http://localhost:8080/factorservice?wsdl");
    }
    
    static class SoapHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange exchange) throws IOException {
            String response = "";
            String method = exchange.getRequestMethod();
            
            if ("GET".equals(method)) {
                response = generateWSDL();
                exchange.getResponseHeaders().set("Content-Type", "text/xml");
                exchange.sendResponseHeaders(200, response.getBytes().length);
            } 
            // Handle SOAP POST request
            else if ("POST".equals(method)) {
                String soapRequest = readRequestBody(exchange);
                System.out.println("Received SOAP Request: " + soapRequest);
                
                response = processSoapRequest(soapRequest);
                exchange.getResponseHeaders().set("Content-Type", "text/xml");
                exchange.sendResponseHeaders(200, response.getBytes().length);
            }
            
            OutputStream os = exchange.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
        
        private String readRequestBody(HttpExchange exchange) throws IOException {
            InputStream is = exchange.getRequestBody();
            BufferedReader reader = new BufferedReader(new InputStreamReader(is));
            StringBuilder builder = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                builder.append(line);
            }
            return builder.toString();
        }
        
        private String generateWSDL() {
            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                   "<definitions name=\"FactorService\" targetNamespace=\"http://example.com/factorservice\"" +
                   " xmlns=\"http://schemas.xmlsoap.org/wsdl/\"" +
                   " xmlns:soap=\"http://schemas.xmlsoap.org/wsdl/soap/\"" +
                   " xmlns:tns=\"http://example.com/factorservice\"" +
                   " xmlns:xsd=\"http://www.w3.org/2001/XMLSchema\">" +
                   " <message name=\"findFactorsRequest\">" +
                   "   <part name=\"numbers\" type=\"xsd:string\"/>" +
                   "   <part name=\"divisor\" type=\"xsd:int\"/>" +
                   " </message>" +
                   " <message name=\"findFactorsResponse\">" +
                   "   <part name=\"result\" type=\"xsd:string\"/>" +
                   " </message>" +
                   " <portType name=\"FactorServicePortType\">" +
                   "   <operation name=\"findFactors\">" +
                   "     <input message=\"tns:findFactorsRequest\"/>" +
                   "     <output message=\"tns:findFactorsResponse\"/>" +
                   "   </operation>" +
                   " </portType>" +
                   " <binding name=\"FactorServiceBinding\" type=\"tns:FactorServicePortType\">" +
                   "   <soap:binding style=\"rpc\" transport=\"http://schemas.xmlsoap.org/soap/http\"/>" +
                   "   <operation name=\"findFactors\">" +
                   "     <soap:operation soapAction=\"findFactors\"/>" +
                   "     <input><soap:body use=\"literal\"/></input>" +
                   "     <output><soap:body use=\"literal\"/></output>" +
                   "   </operation>" +
                   " </binding>" +
                   " <service name=\"FactorService\">" +
                   "   <port name=\"FactorServicePort\" binding=\"tns:FactorServiceBinding\">" +
                   "     <soap:address location=\"http://localhost:8080/factorservice\"/>" +
                   "   </port>" +
                   " </service>" +
                   "</definitions>";
        }
        
        private String processSoapRequest(String soapRequest) {
            try {
                int[] numbers = extractNumbers(soapRequest);
                int divisor = extractDivisor(soapRequest);
                
                List<String> factorsList = new ArrayList<>();
                for (int number : numbers) {
                    if (number % divisor == 0) {
                        factorsList.add(String.valueOf(number));
                    }
                }
                String result = String.join(", ", factorsList);
                
                return buildSoapResponse(result);
                
            } catch (Exception e) {
                return buildSoapFault("Error processing request: " + e.getMessage());
            }
        }
        
        private int[] extractNumbers(String soapRequest) {
            int start = soapRequest.indexOf("<numbers>") + 9;
            int end = soapRequest.indexOf("</numbers>");
            if (start >= 9 && end > start) {
                String numbersStr = soapRequest.substring(start, end);
                String[] numStrs = numbersStr.split(",");
                int[] numbers = new int[numStrs.length];
                for (int i = 0; i < numStrs.length; i++) {
                    numbers[i] = Integer.parseInt(numStrs[i].trim());
                }
                return numbers;
            }
            return new int[0];
        }
        
        private int extractDivisor(String soapRequest) {
            int start = soapRequest.indexOf("<divisor>") + 9;
            int end = soapRequest.indexOf("</divisor>");
            if (start >= 9 && end > start) {
                String divisorStr = soapRequest.substring(start, end);
                return Integer.parseInt(divisorStr.trim());
            }
            return 1;
        }
        
        private String buildSoapResponse(String result) {
            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                   "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                   "<soap:Body>" +
                   "<findFactorsResponse>" +
                   "<result>" + result + "</result>" +
                   "</findFactorsResponse>" +
                   "</soap:Body>" +
                   "</soap:Envelope>";
        }
        
        private String buildSoapFault(String message) {
            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                   "<soap:Envelope xmlns:soap=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                   "<soap:Body>" +
                   "<soap:Fault>" +
                   "<faultcode>soap:Server</faultcode>" +
                   "<faultstring>" + message + "</faultstring>" +
                   "</soap:Fault>" +
                   "</soap:Body>" +
                   "</soap:Envelope>";
        }
    }
}