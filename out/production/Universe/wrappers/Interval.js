function setInterval(func, milliseconds) {
    var timer = new (Java.type("java.util.Timer"))(true);
    timer.schedule(new (Java.type("java.util.TimerTask"))({
        run: func
    }), milliseconds, milliseconds);
    return timer;
}
function clearInterval(timer) {
    timer.cancel();
}
