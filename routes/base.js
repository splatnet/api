const path = require("path");
const fs = require("fs");
module.exports = [
    {
        name: "/",
        export(req, res) {
            return res.status(200).sendFile(path.join(__dirname + "/../index.html"));
        },
    },
    {
        name: "/changelog",
        export(req, res) {
            let exists = require('fs').existsSync('./CHANGELOG.html');
            if (!exists) return res.status(404).send("Changelog not available");
            return res.status(200).sendFile(path.join(__dirname + "/../CHANGELOG.html"))
        },
    }
];