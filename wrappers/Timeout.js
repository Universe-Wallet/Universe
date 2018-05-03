function setTimeout(func, milliseconds) {
    var timer = new (Java.type("java.util.Timer"))(true);
    timer.schedule(new (Java.type("java.util.TimerTask"))({
        run: func
    }), milliseconds);
    return timer;
}
function clearTimeout(timer) {
    timer.cancel();
}
