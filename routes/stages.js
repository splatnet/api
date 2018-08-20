const config = require("../config.json");
module.exports = [
    {
        name: "/stages",
        export(req, res) {
            return res.status(200).json(config.Stages);
        },
        description: "Returns all available Splatoon 2 stages",
    },
];