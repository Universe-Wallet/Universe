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
        Point doubled = g;

        String binary = new BigInteger(hexScalar, 16).subtract(BigInteger.ONE).toString(2);
        for (int i = 1; i < binary.length(); i++) {
            if (binary.charAt(binary.length()-i) == '1') {
                sum = add(sum, doubled);
            }
            doubled = add(doubled, doubled);
        }

        /*for (BigDecimal scalar = new BigDecimal(new BigInteger(hexScalar, 16).toString()); scalar.compareTo(BigDecimal.ONE) != 0; scalar = scalar.subtract(BigDecimal.ONE)) {
            sum = add(sum, g);
        }*/
        return sum;
    }

    public SECP256K1() {
        a = BigDecimal.ZERO;
        b = new BigDecimal("7");
        g = new Point(
            new BigDecimal("55066263022277343669578718895168534326250603453777594175500187360389116729240"),
            new BigDecimal("32670510020758816978083085130507043184471273380659243275938904335757337482424")
        );
        context = new MathContext(256);
    }
}
