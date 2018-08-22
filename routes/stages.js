const config = require("../config.json");
module.exports = [
    {
        name: "/stages",
        export(req, res) {
            return res.status(200).json(config.endpoints.stages);
        },
        description: "Returns all available Splatoon 2 stages",
    },
    {
        name: "/stages/:stage_id",
        export(req, res) {
            if (isNaN(req.params.stage_id)) return res.json({ error: 'Invalid number.' });
            let stage = config.endpoints.stages.filter(stage => stage.id == req.params.stage_id.toString());
            if (!stage[0]) return res.json({ error: 'Not available.' });
            res.json(stage[0]);
        },
        description: "Returns a specific stage by its id."
    }
];