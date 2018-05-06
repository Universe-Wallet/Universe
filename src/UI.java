package src;

import javax.swing.JFrame;
import java.awt.BorderLayout;

import javax.swing.JLabel;
import java.awt.Dimension;

public class UI {
    public UI()	{
        JFrame frame = new JFrame("Universe Wallet");
        frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

        JLabel emptyLabel = new JLabel("");
        emptyLabel.setPreferredSize(new Dimension(175, 100));
        frame.getContentPane().add(emptyLabel, BorderLayout.CENTER);

        frame.pack();
        frame.setVisible(true);
    }
}
