var MDX = {
    new: function() {
        var mdx = new (Java.type("src.lib.MDX"))();

        return {
            md2: function(data) {
                return mdx.md2(data);
            },

            md5: function(data) {
                return mdx.md5(data);
            }
        };
    }
}
