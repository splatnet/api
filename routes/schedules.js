const config = require("../config.json");
module.exports = [
    {
        name: "/schedules",
        export(req, res) {
            res.status(200).json(config.endpoints.map_schedules);
        },
        description: "Returns the next 12 map schedules.",
    },
    {
        name: "/schedules/current",
        export(req, res) {
            res.status(200).json(config.endpoints.current_map_schedule);
        },
        description: "Returns the current map schedule.",
    },
    {
        name: "/schedules/:schedule_id",
        export(req, res) {
            if (isNaN(req.params.schedule_id)) { return res.json({ error: "Invalid number." }) }
            if (!config.endpoints.map_schedules.regular[req.params.schedule_id-1]) { return res.json({ error: "Not available." }) }
            var result = { regular: config.endpoints.map_schedules.regular[req.params.schedule_id-1], gachi: config.endpoints.map_schedules.gachi[req.params.schedule_id-1], league: config.endpoints.map_schedules.league[req.params.schedule_id-1] };
            return res.status(200).json(result);
        },
        description: "Returns a specific map schedule (schedule_id can be 1 - 12).",
    }
];