package src.lib;

import java.net.URL;
import java.net.HttpURLConnection;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.DataOutputStream;

public class HTTP {
    public static String get(String url) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) (new URL(url)).openConnection();
        connection.setRequestMethod("GET");
        connection.setUseCaches(false);

        BufferedReader responseStream = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String line, response = "";
        while ((line = responseStream.readLine()) != null) {
          response += (line + "\r\n");
        }
        responseStream.close();

        return response;
    }

    public static String post(String domain, String contentType, String body) throws Exception {
        HttpURLConnection connection = (HttpURLConnection) (new URL(domain)).openConnection();
        connection.setRequestMethod("POST");
        connection.setUseCaches(false);

        connection.setDoOutput(true);
        connection.setRequestProperty("Content-Type", contentType);
        connection.setRequestProperty("Content-Length", Integer.toString(body.length()));

        DataOutputStream bodyStream = new DataOutputStream(connection.getOutputStream());
        bodyStream.writeBytes(body);
        bodyStream.close();

        BufferedReader responseStream = new BufferedReader(new InputStreamReader(connection.getInputStream()));
        String line, response = "";
        while ((line = responseStream.readLine()) != null) {
          response += (line + "\r\n");
        }
        responseStream.close();

        return response;
    }
}
