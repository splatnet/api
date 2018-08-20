const config = require("../config.json");
module.exports = [
    {
        name: "/stages",
        export(req, res) {
            return res.status(200).json(config.Stages);
        },
        description: "Returns all available Splatoon 2 stages",
    },
    {
        name: "/stages/:stage_id",
        export(req, res) {
            if (!req.params.stage_id) return res.json({ error: 'You must provide a stage id.' });
            let stage = config.Stages.filter(stage => stage.id == req.params.stage_id.toString());
            if (!stage[0]) return res.json({ error: 'No results' });
            res.json(stage[0])
        },
        description: "Returns a specific stage by its id."
    }
];