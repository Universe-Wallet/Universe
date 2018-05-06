package src;

import java.awt.*;
import javax.swing.*;

public class UI
{
	public static void createAndShowFrame()
	{
		
		JFrame frame = new JFrame("Universe");
		frame.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);

		JLabel emptyLabel = new JLabel("");
		emptyLabel.setPreferredSize(new Dimension(175, 100));
		frame.getContentPane().add(emptyLabel, BorderLayout.CENTER);

		frame.pack();
		frame.setVisible(true);

	}

}
