const config = require('../config.json');

module.exports = [
    {
        name: "/festivals/active",
        export(req, res) {
            res.send("This endpoint is not available anymore. Please use /festivals instead.");
        },
    },
    {
        name: "/festivals/pasts",
        export(req, res) {
            res.status(200).json(config.endpoints.festivals.pasts);
        },
        description: "Returns a list of all previous splatfests.",
    },
    {
        name: "/festivals/",
        export(req, res) {
            res.status(200).json(config.endpoints.festivals.active);
        },
        description: "Returns a list of active splatfests. <b>Beta, does maybe not work yet</b>.",
    },
    {
        name: "/festivals/:festival_id",
        export(req, res) {
            let input = req.params.festival_id;
            if (isNaN(input)) return res.json({ error: "Invalid number." });
            let splatfests = config.endpoints.festivals.pasts.festivals;
            if (config.endpoints.festivals.active[0]) splatfests.unshift(config.endpoints.festivals.active[0]);
            if (!splatfests[input-1]) return res.json({ error: "Not available." });
            res.status(200).json(splatfests[input-1]);
        },
        description: "Returns information on a specific splatfest by its id.",
    }
];