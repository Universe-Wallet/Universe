package src.lib;

import java.net.Socket;
import java.io.PrintWriter;
import java.io.BufferedReader;
import java.io.InputStreamReader;

public class TCPSocket {
    Socket socket;
    PrintWriter out;
    BufferedReader in;

    public TCPSocket(String host, int port) throws Exception {
        socket = new Socket(host, port);
        out = new PrintWriter(socket.getOutputStream(), true);
        in = new BufferedReader(new InputStreamReader(socket.getInputStream()));
    }

    public void send(String data) {
        out.println(data);
    }

    public String receive() {
        try {
            String received = in.readLine();
            return ((received == null) ? "" : received);
        } catch (Exception e) {
            return "___UNIVERSE___ ERROR";
        }
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
