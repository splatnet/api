const config = require("../config.json");
module.exports = [
    {
        name: "/coop_schedules",
        export(req, res) {
            res.status(200).json(config.endpoints.coop_schedules);
        },
        description: "Returns the next coop mode schedules.",
    },
    {
        name: "/coop_schedules/current",
        export(req, res) {
            if (!config.endpoints.current_coop_schedule) { return res.status(200).json({ active: false }) }
            res.status(200).json(config.endpoints.current_coop_schedule);
        },
        description: "Returns the current coop mode schedules (if there is no coop currently, it'll return an object containing { \"active\" : false }.",
    },
    {
        name: "/coop_schedules/:schedule_id",
        export(req, res) {
            if (isNaN(req.params.schedule_id)) { return res.status(404).json({ error: "Invalid number." }) }
            if (!config.endpoints.coop_schedules.details[req.params.schedule_id-1]) { return res.status(404).json({ error: "Not available." }) }
            var result = config.endpoints.coop_schedules.details[req.params.schedule_id-1];
            return res.status(200).json(result);
        },
        description: "Returns a specific coop mode schedule (schedule_id can be 1 or 2).",
    }
];