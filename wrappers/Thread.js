var Thread = {
    new: function(func) {
        print("Starting thread.");
        (new (Java.type("java.lang.Thread"))(new (Java.type("java.lang.Runnable"))(){
            run: func
        })).start();
    },

    sleep: function(milliseconds) {
        (Java.type("java.lang.Thread")).sleep(milliseconds);
    }
}
