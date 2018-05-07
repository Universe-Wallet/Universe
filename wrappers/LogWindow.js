var LogWindow = {
    new: function(title) {
        var log = new (Java.type("src.lib.LogWindow"))(title);

        return {
            update: function(data) {
                log.update(data);
            }
        };
    }
}
