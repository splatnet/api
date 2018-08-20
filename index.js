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

let global = {};

process.title = "SplatAPI";

app.listen(config.port, async () => {
    console.log("Listening on port " + config.port + ".");
    config.Schedules = await SplatAPI.getSchedules();
    config.Current = SplatAPI.currentMatches(config.Schedules);
    config.Coops = await SplatAPI.getCoopSchedules();
    config.Coop_Current = SplatAPI.currentCoop(config.Coops);
    config.Stages = await SplatAPI.getStages();
    let newex = false;
    let juststarted = true;
    let routes = fs.readdirSync("./routes/");
    console.log("Endpoints:");
    for (let file of routes) {
        var f = require("./routes/" + file);
        for (var use of f) {
            if (!use.method) { use.method = "get" }
            app[use.method.toLowerCase()](use.name, use.export);
            console.log("  " + use.name + " (" + use.method.toUpperCase() + ")");
        }
    };
    setInterval(async () => {
        const MapSets = await Database.Maps.findOne();
        if (!MapSets) { newex = true; await Database.Maps.create({ latest: 100 }); }
        const Maps = await Database.Maps.findOne({ where: { latest: { [require("sequelize").Op.lte] : Date.now() }}});
        if (!Maps && juststarted) { juststarted = false }
        if (!Maps) return;
        let newtime = new Date(moment(config.Current.regular.end_time*1000).add(2, "hours")).getTime();
        if (newex) { newtime = config.Current.regular.end_time*1000; newex = false }
        if (juststarted) { newtime = config.Current.regular.end_time*1000; juststarted = false }
        await Database.Maps.update({ latest: newtime }, { where: { id: Maps.id }});
        await console.log(moment().format("LLL") + " > Updating information...");
        config.Schedules = await SplatAPI.getSchedules();
        config.Current = await SplatAPI.currentMatches(config.Schedules);
        config.Coops = await SplatAPI.getCoopSchedules();
        config.Coop_Current = SplatAPI.currentCoop(config.Coops);
        config.Stages = await SplatAPI.getStages();
    }, 1000);
});

module.exports = global;