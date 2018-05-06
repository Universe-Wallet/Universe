var HTTP = {
    new: function() {
        var http = Java.type("src.lib.HTTP");

        return {
            get: function(url) {
                return http.get(url)
            },

            post: function(url, contentType, body) {
                return http.post(url, contentType, body)
            }
        };
    }
}
