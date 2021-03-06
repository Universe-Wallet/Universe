package src.lib;

import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;
import java.security.cert.X509Certificate;

import javax.net.ssl.SSLContext;
import java.security.SecureRandom;

import javax.net.ssl.SSLSocketFactory;
import java.net.Socket;
import java.net.InetSocketAddress;

import java.io.PrintWriter;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class FakeTLSSocket {
    private Socket socket;
    private PrintWriter out;
    private BufferedReader in;

    private String host;

    public FakeTLSSocket(String host, int port) throws Exception {
        this.host = host;

        TrustManager[] trustAllCerts = new TrustManager[] {
            new X509TrustManager() {
                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[0];
                }

                public void checkClientTrusted(X509Certificate[] certs, String authType) {

                }

                public void checkServerTrusted(X509Certificate[] certs, String authType) {

                }
            }
        };

        SSLContext sslContext = SSLContext.getInstance("SSL");
        sslContext.init(null, trustAllCerts, new SecureRandom());

        socket = ((SSLSocketFactory) sslContext.getSocketFactory()).createSocket();
        socket.connect(new InetSocketAddress(host, port), 5000);
        out = new PrintWriter(socket.getOutputStream(), true);
        in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }

    public String getHost() {
        return host;
    }

    public void send(String data) {
        out.println(data);
    }

    public String receive() throws Exception {
        String received = in.readLine();
        return ((received == null) ? "" : received);
    }

    public boolean close() {
        try {
            socket.close();
            return true;
        } catch(Exception e) {
            return false;
        }
    }
}
