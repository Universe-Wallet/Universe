package src.lib;

import src.lib.Point;

import java.math.BigInteger;
import java.math.BigDecimal;
import java.math.MathContext;

public class SECP256K1 {
    private BigDecimal a, b;
    private Point g;
    private MathContext context;

    private Point add(Point p, Point q) {
        BigDecimal slope, x, y;

        if (p.equals(q)) {
            slope = p.x.multiply(p.x).multiply(new BigDecimal("3")).add(a);
            slope = slope.divide(new BigDecimal("2").multiply(p.y), context);
        } else {
            slope = p.y.subtract(q.y).divide(p.x.subtract(q.x), context);
        }

        x = slope.multiply(slope).subtract(p.x).subtract(q.x);
        y = p.y.add(slope.multiply(x.subtract(p.x)));

        return new Point(x, BigDecimal.ZERO.subtract(y));
    }

    public Point scalarG(String hexScalar) {
        Point sum = g;

        String binary = new BigInteger(hexScalar, 16).toString(2);
        for (int i = 1; i < binary.length(); i++) {
            sum = add(sum, sum);
            if (binary.charAt(i) == '1') {
                sum = add(sum, g);
            }
        }

        return sum;
    }

    public SECP256K1() {
        a = BigDecimal.ZERO;
        b = new BigDecimal("7");
        g = new Point(
            //new BigDecimal("99.99977"),
            //new BigDecimal("1000")
            new BigDecimal(new BigInteger("79BE667EF9DCBBAC55A06295CE870B07029BFCDB2DCE28D959F2815B16F81798", 16)),
            new BigDecimal(new BigInteger("483ADA7726A3C4655DA4FBFC0E1108A8FD17B448A68554199C47D08FFB10D4B8", 16))
        );
        context = new MathContext(256);
    }
}
