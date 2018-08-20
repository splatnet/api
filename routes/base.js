const path = require("path");
module.exports = [
    {
        name: "/",
        export: function (req, res) {
            return res.status(200).sendFile(path.join(__dirname + "/../index.html"));
        },
    }
];