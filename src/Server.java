package src;

import java.net.InetSocketAddress;

import java.io.OutputStream;
import java.nio.file.Files;
import java.nio.file.Paths;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;

class StaticFile implements HttpHandler {
    byte[] errRes;
    byte[] res;

    @Override
    public void handle(HttpExchange httpExchange) {
        try {
            httpExchange.sendResponseHeaders(200, res.length);

            OutputStream os = httpExchange.getResponseBody();
            os.write(res);
            os.close();
        } catch(IOException e) {
            try {
                httpExchange.sendResponseHeaders(500, errRes.length);
                OutputStream os = httpExchange.getResponseBody();
                os.write(errRes);
                os.close();
            }catch(Exception e2){}
        }
    }

    public StaticFile(String filePath) throws Exception {
        errRes = "Error with the Java app. Please reboot Universe Wallet and try again.".getBytes("UTF-8");
        res = Files.readAllBytes(Paths.get("src", "html", filePath));
    }
}

public class Server {
    public Server() throws Exception {
        HttpServer http = HttpServer.create(new InetSocketAddress(9888), 0);

        http.createContext("/", new StaticFile("main.html"));
        http.createContext("/manifest.json", new StaticFile("manifest.json"));
        http.createContext("/blockstack.js", new StaticFile("blockstack.js"));

        http.setExecutor(null);
        http.start();
    }
}
