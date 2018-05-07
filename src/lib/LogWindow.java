package src.lib;

import javax.swing.JFrame;
import java.awt.BorderLayout;

import javax.swing.JLabel;
import java.awt.Dimension;

public class LogWindow {
    private int count = 0;
    private JLabel text;

    public LogWindow(String title)	{
        JFrame frame = new JFrame(title);

        text = new JLabel("");
        text.setPreferredSize(new Dimension(200, 900));
        frame.getContentPane().add(text, BorderLayout.CENTER);

        frame.pack();
        frame.setVisible(true);
    }

    public void update(String data) {
        count++;
        text.setText("<html>Label Instance: " + count + "<br>" + data);
    }
}
