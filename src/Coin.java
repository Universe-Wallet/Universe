package src;

import java.util.concurrent.Callable;
import java.lang.Thread;
import java.lang.Runnable;

import java.io.FileReader;
import javax.script.ScriptEngineManager;
import javax.script.ScriptEngine;
import javax.script.Invocable;
import jdk.nashorn.api.scripting.ScriptObjectMirror;

public class Coin {
    private boolean ready, broken;
    private ScriptEngine engine;
    private Invocable invocable;

    public Coin(String moduleName) {
        ready = false;

        Callable<Void> onReady = new Callable<Void>() {
           public Void call() {
                ready = true;
                return null;
           }
       };

        Callable<Void> onBroken = new Callable<Void>() {
           public Void call() {
                broken = true;
                return null;
           }
       };

        (new Thread(new Runnable(){
            public void run() {
                try {
                    engine = new ScriptEngineManager().getEngineByName("nashorn");
                    invocable = (Invocable) engine;

                    engine.eval(new FileReader("./modules/" + moduleName + ".js"));

                    invocable.invokeFunction("start", onReady, onBroken);
                }catch(Exception e){}
            }
        })).start();
    }

    public ScriptObjectMirror generate() throws Exception {
        return (ScriptObjectMirror) invocable.invokeFunction("generate");
    }

    public String getBalance() throws Exception {
        return (String) (Object) invocable.invokeFunction("getBalance");
    }

    public String prepare() throws Exception {
        return "";
    }

    public boolean send() throws Exception {
        return false;
    }

    public String getUSDPrice() throws Exception {
        return (String) (Object) invocable.invokeFunction("getUSDPrice");
    }

    public void shutdown() {

    }

    public int getReady() {
        if (broken) {
            return -1;
        } else if (ready) {
            return 1;
        } else {
            return 0;
        }
    }
}
