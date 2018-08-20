const config = require("../config.json");
const moment = require("moment");
require("moment-duration-format");
module.exports = [
    {
        name: "/next_update",
        export(req, res) {
            let duration = moment.duration(config.Current.regular.end_time-Date.now()/1000, "minutes").format("HH:mm");
            let object = { hours: "00", minutes: duration.split(":")[0] || "00", seconds: duration.split(":")[1] || "00", next_update_ts: config.Current.regular.end_time*1000, latest_update_ts: config.Current.regular.start_time*1000 };
            if (!duration.split(":")[1]) { object.seconds = object.minutes; object.minutes = "00" };
            if (parseInt(object.minutes) >= 60) {
                if (object.minutes == "120") { object.hours = "02"; object.minutes = "00" } else {
                    object.hours = "01";
                    object.minutes = (parseInt(object.minutes)-60).toString()
                };
            };
            object.offset = object.hours + ":" + object.minutes + ":" + object.seconds;
            res.status(200).json(object);
        },
        description: "Returns the time until the APIs information gets updated (e.g. until the next map rotation) in hours, minutes and seconds."
    }
];