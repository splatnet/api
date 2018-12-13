const config = require("../config.json");
module.exports = [
    {
        name: "/stages",
        export(req, res) {
            return res.status(200).json(config.endpoints.stages);
        },
        description: "Returns a list of available stages.",
    },
    {
        name: "/stages/:stage",
        export(req, res) {
            if (!req.params.stage) return res.json({ error: 'No name / id provided.' });
            let stage = undefined;
            if (!isNaN(req.params.stage)) {
                stage = config.endpoints.stages.filter(stage => stage.id == req.params.stage);
            } else {
                if (req.params.stage == "random") {
                    let random = Math.floor(Math.random() * config.endpoints.stages.length);
                    stage = config.endpoints.stages.filter(stage => stage.id == random);
                } else {
                    stage = config.endpoints.stages.filter(stage => stage.name.toLowerCase() == req.params.stage.toString().toLowerCase().replace(/_/g, " "));
                };
            };
            if (!stage[0]) return res.json({ error: 'Not available.' });
            stage[0].id = parseInt(stage[0].id);
            return res.json(stage[0]);
        },
        description: "Returns information on a specific stage. You can provide either a stage id or a stage name."
    }
];