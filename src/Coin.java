package src;

import java.io.FileReader;
import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.Invocable;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

public class Coin {
    private ScriptEngine engine;
    private Invocable invocable;

    public Coin(String moduleName) throws Exception {
        engine = new ScriptEngineManager().getEngineByName("nashorn");
        invocable = (Invocable) engine;

        engine.eval(new FileReader("./modules/" + moduleName + ".js"));
    }

    public ScriptObjectMirror generate() throws Exception {
        ScriptObjectMirror generated = (ScriptObjectMirror) invocable.invokeFunction("generate");
        
        return generated;
    }
}
