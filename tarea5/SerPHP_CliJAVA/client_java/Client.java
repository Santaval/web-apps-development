import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;

public class Client {
    public static void main(String[] args) {
        try {
            String serverURL = "http://localhost/server.php";
            // Example: lista = [1,5,23,25,35,78,30,96], numero = 5
            String xml =
                "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" +
                "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\">" +
                "<soapenv:Header/>" +
                "<soapenv:Body>" +
                "<factores xmlns=\"http://localhost/soap\">" +
                "<lista>1</lista>" +
                "<lista>5</lista>" +
                "<lista>23</lista>" +
                "<lista>25</lista>" +
                "<lista>35</lista>" +
                "<lista>78</lista>" +
                "<lista>30</lista>" +
                "<lista>96</lista>" +
                "<numero>5</numero>" +
                "</factores>" +
                "</soapenv:Body>" +
                "</soapenv:Envelope>";

            URL url = new URL(serverURL);
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("POST");
            conn.setRequestProperty("Content-Type", "text/xml; charset=utf-8");
            conn.setRequestProperty("SOAPAction", "\"http://localhost/soap/factores\"");
            conn.setDoOutput(true);

            try (OutputStream os = conn.getOutputStream()) {
                os.write(xml.getBytes("UTF-8"));
            }

            int responseCode = conn.getResponseCode();
            InputStream responseStream = (responseCode >= 400) ? conn.getErrorStream() : conn.getInputStream();
            BufferedReader in = new BufferedReader(new InputStreamReader(responseStream));
            String inputLine;
            System.out.println("HTTP response code: " + responseCode);
            System.out.println("Respuesta del servidor:");
            while ((inputLine = in.readLine()) != null) {
                System.out.println(inputLine);
            }
            in.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}