package src.lib;

import org.bouncycastle.asn1.x9.X9ECParameters;
import org.bouncycastle.asn1.sec.SECNamedCurves;
import org.bouncycastle.crypto.params.ECDomainParameters;

import org.bouncycastle.crypto.generators.ECKeyPairGenerator;
import org.bouncycastle.crypto.params.ECKeyGenerationParameters;

import org.bouncycastle.crypto.AsymmetricCipherKeyPair;
import org.bouncycastle.crypto.params.ECPublicKeyParameters;
import org.bouncycastle.crypto.params.ECPrivateKeyParameters;

import java.security.SecureRandom;

public class SECP256K1 {
    private ECKeyPairGenerator generator;

    public String generateKeys() {
        AsymmetricCipherKeyPair keys = generator.generateKeyPair();
        ECPrivateKeyParameters privKey = (ECPrivateKeyParameters) keys.getPrivate();
        ECPublicKeyParameters pubKey = (ECPublicKeyParameters) keys.getPublic();
        String hexPrivKey = privKey.getD().toString(16);
        String pubKeyObj = "{\"x\":\"" + pubKey.getQ().getX().toString() + "\",\"y\":\"" + pubKey.getQ().getY().toString() + "\"}";

        return "{\"privKey\":\"" + hexPrivKey + "\",\"pubKey\":" + pubKeyObj + "}";
    }

    public SECP256K1() {
        X9ECParameters curve = SECNamedCurves.getByName("secp256k1");
        ECDomainParameters domain = new ECDomainParameters(curve.getCurve(), curve.getG(), curve.getN(), curve.getH());

        generator = new ECKeyPairGenerator();
        generator.init(new ECKeyGenerationParameters(domain, new SecureRandom()));
    }
}
