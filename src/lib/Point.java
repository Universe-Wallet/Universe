package src.lib;

import java.math.BigInteger;
import java.math.BigDecimal;

public class Point {
    public BigDecimal x, y;

    public String getX() {
        return (new BigInteger(x.toString().split("\\.")[0])).toString(16);
    }

    public String getY() {
        return (new BigInteger(y.toString().split("\\.")[0])).toString(16);
    }

    public Point(BigDecimal x, BigDecimal y) {
        this.x = x;
        this.y = y;
    }

    public boolean equals(Point other) {
        return ((this.x.compareTo(other.x) == 0) && (this.y.compareTo(other.y) == 0));
    }
}
