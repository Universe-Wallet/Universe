package src.lib;

import src.lib.Hex;

import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.asn1.sec.SECNamedCurves;
import org.bouncycastle.jce.spec.ECParameterSpec;
import org.bouncycastle.crypto.params.ECDomainParameters;

import org.bouncycastle.crypto.generators.ECKeyPairGenerator;
import org.bouncycastle.crypto.params.ECKeyGenerationParameters;

import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;
import org.bouncycastle.math.ec.ECCurve;

import org.bouncycastle.math.ec.ECPoint;

import java.security.SecureRandom;
import java.math.BigInteger;

public class SECP256K1 {
    private X9ECParameters curve;
    private ECKeyPairGenerator generator;
    private ECParameterSpec params;

    public SECP256K1() {
        curve = SECNamedCurves.getByName("secp256k1");
        params = new ECParameterSpec(curve.getCurve(), curve.getG(), curve.getN(), curve.getH());
        ECDomainParameters domain = new ECDomainParameters(curve.getCurve(), curve.getG(), curve.getN(), curve.getH());

        generator = new ECKeyPairGenerator();
        generator.init(new ECKeyGenerationParameters(domain, new SecureRandom()));
    }

    public String generateKeys() {
        AsymmetricCipherKeyPair keys = generator.generateKeyPair();
        ECPrivateKeyParameters privKey = (ECPrivateKeyParameters) keys.getPrivate();
        ECPublicKeyParameters pubKey = (ECPublicKeyParameters) keys.getPublic();
        String hexPrivKey = privKey.getD().toString(16);

        String x, y, compressed, uncompressed;
        x = pubKey.getQ().getX().toString();
        y = pubKey.getQ().getY().toString();
        uncompressed = "04" + x + y;
        if (y.equals(curve.getCurve().decodePoint(Hex.hexStrToByte("02" + x)).getY().toString())) {
            compressed = "02" + x;
        } else {
            compressed = "03" + x;
        }

        String pubKeyObj = "{\"uncompressed\":\"" + uncompressed + "\",\"compressed\":\"" + compressed + "\"}";
        return "{\"privKey\":\"" + hexPrivKey + "\",\"pubKey\":" + pubKeyObj + "}";
    }

    public String privateToPublic(String hexPrivKey) {
        ECPoint pubPoint = curve.getG().multiply(new BigInteger(hexPrivKey, 16));
        return "{\"x\":\"" + pubPoint.getX().toString() + "\",\"y\":\"" + pubPoint.getY().toString() + "\"}";
    }
}
