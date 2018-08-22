const express = require("express");
const app = express();
const fs = require("fs");
const config = require("./config.json");
const SplatAPI = require("./structures/SplatAPI.js");
new SplatAPI(config.splatoon.iksm_token, config.splatoon.base_url, config.splatoon.player_id);
const Database = require("./structures/Database.js");
new Database();
const moment = require("moment");
const morgan = require("morgan");

app.use(morgan("dev"));
app.set("json spaces", 4);

process.title = "SplatAPI";

async function updateStats() {
    config.endpoints = { map_schedules: await SplatAPI.getSchedules(), coop_schedules: await SplatAPI.getCoopSchedules(), stages: await SplatAPI.getStages(), merchandises: await SplatAPI.getMerch(), festivals: { active: await SplatAPI.getFestivals("active"), pasts: await SplatAPI.getFestivals("pasts") } };
    config.endpoints.current_map_schedule = SplatAPI.currentMatches(config.endpoints.map_schedules);
    config.endpoints.current_coop_schedule = SplatAPI.currentCoop(config.endpoints.coop_schedules);
    return 'ok';
};

app.listen(config.port, async () => {
    require('child_process').exec("node build-docs.js"); // Updating documentation every time the script is started.
    console.log("Listening on port " + config.port + ".");
    await updateStats();
    let newex = false;
    let juststarted = true;
    let routes = fs.readdirSync("./routes/");
    if (!routes[0]) {
        console.log("No routes detected. Quitting process...");
        process.exit(0);
    };
    console.log("Endpoints:");
    for (let file of routes) {
        var f = require("./routes/" + file);
        if (f[0]) {
            for (var use of f) {
                if (!use.method) { use.method = "get" }
                app[use.method.toLowerCase()](use.name, use.export);
                console.log("  " + use.name + " (" + use.method.toUpperCase() + ")");
            };
        };
    };
    setInterval(async () => {
        const MapSets = await Database.Maps.findOne();
        if (!MapSets) { newex = true; await Database.Maps.create({ latest: 100 }); }
        const Maps = await Database.Maps.findOne({ where: { latest: { [require("sequelize").Op.lte] : Date.now() }}});
        if (!Maps && juststarted) { juststarted = false }
        if (!Maps) return;
        let newtime = new Date(moment(config.endpoints.current_map_schedule.regular.end_time*1000).add(2, "hours")).getTime();
        if (newex) { newtime = config.endpoints.current_map_schedule.regular.end_time*1000; newex = false }
        if (juststarted) { newtime = config.endpoints.current_map_schedule.regular.end_time*1000 }
        await Database.Maps.update({ latest: newtime }, { where: { id: Maps.id }});
        if (juststarted) { juststarted = false; return }
        console.log(moment().format("LLL") + " > Updating information...");
        await updateStats();
    }, 1000);
});