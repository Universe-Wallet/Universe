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

import org.bouncycastle.jce.spec.ECPrivateKeySpec;
import org.bouncycastle.jce.provider.BouncyCastleProvider;

import java.security.SecureRandom;
import java.math.BigInteger;

import java.security.KeyFactory;
import java.security.PrivateKey;
import java.security.Signature;

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

        src.lib.SHA sha = new src.lib.SHA();
        //Below should print "304402201c3be71e1794621cbe3a7adec1af25f818f238f5796d47152137eba710f2174a02204f8fe667b696e30012ef4e56ac96afb830bddffee3b15d2e474066ab3aa39bad".
        System.out.println(sign("03bf350d2821375158a608b51e3e898e507fe47f2d2e8c774de4a9a7edecf74eda", sha.sha256(sha.sha256("0100000001416e9b4555180aaa0c417067a46607bc58c96f0131b2f41f7d0fb665eab03a7e000000001976a91499b1ebcfc11a13df5161aba8160460fe1601d54188acffffffff01204e0000000000001976a914e81d742e2c3c7acd4c29de090fc2c4d4120b2bf888ac0000000001000000"))));
        System.exit(0);
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

    //Broken.
    public String sign(String hexPrivKey, String hexData) {
        try {
            ECPrivateKeySpec privKeySpec = new ECPrivateKeySpec(new BigInteger(hexPrivKey, 16), params);
            BouncyCastleProvider BCP = new BouncyCastleProvider();
            KeyFactory keyFactory = KeyFactory.getInstance("ECDSA", BCP);
            PrivateKey privKey = keyFactory.generatePrivate(privKeySpec);

            Signature sig = Signature.getInstance("NONEwithECDSA", BCP);
            sig.initSign(privKey);
            sig.update(Hex.hexStrToByte(hexData));
            return Hex.byteArrToHex(sig.sign());
        } catch(Exception e) {
            System.out.println(e);
            return "false";
        }
    }
}
