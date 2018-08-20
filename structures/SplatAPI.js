const fetch = require("node-fetch");
const config = require("../config.json");
var iksm, baseurl;

let RequestOptions;

Array.prototype.sortByProp = function(p){
  return this.sort(function(a,b){
    return (a[p] > b[p]) ? 1 : (a[p] < b[p]) ? -1 : 0;
  });
};

class SplatAPI {
    constructor(iksm_token, base_url) {
      if (!iksm_token || !base_url) { throw "You must provide a valid iksm_token and a base_url" }
      iksm = iksm_token;
      baseurl = base_url;
      RequestOptions = { "method" : "GET", "headers" : { "Cookie" : `iksm_session=${iksm}`, "Accept-Language" : config.splatoon.request_locale, "User-Agent" : "Mozilla/5.0 (iPhone; CPU iPhone OS 5_0 like Mac OS X) AppleWebKit/534.46 (KHTML, like Gecko) Version/5.1 Mobile/9A334 Safari/7534.48.3" } };
      return console.log("\x1b[33m%s\x1b[0m", `## SplatAPI 1.0.0 - Connected to ${process.name || "service"}! ##`, "\x1b[0m");
    }
    static async getStages() {
      const request = await fetch(`${baseurl}/api/data/stages`, RequestOptions).then(res => res.json());
      for (let stage of request.stages) {
        stage.image = `${baseurl}${stage.image}`;
      }
      return request.stages.sortByProp("id");
    };
    static async getSchedules() {
      const request = await fetch(`${baseurl}/api/schedules`, RequestOptions).then(res => res.json());
      for (let mode of Object.keys(request)) {
        request[mode][0].stage_a.image = `${baseurl}${request[mode][0].stage_a.image}`;
        request[mode][0].stage_b.image = `${baseurl}${request[mode][0].stage_b.image}`;
      };
      return request;
    };
    static async getCoopSchedules() {
      const request = await fetch(`${baseurl}/api/coop_schedules`, RequestOptions).then(res => res.json());
      let isNow = false;
      if (request.schedules[0].start_time*1000 <= Date.now() && request.schedules[0].end_time*1000 >= Date.now()) isNow = true;
      for (let info of request.details) {
        info.stage.image = `${baseurl}${info.stage.image}`;
      };
      return { active: isNow, details: request.details, schedules: request.schedules };
    };
    static currentCoop(input) {
      if (!input.active) { return null }
      return {
        weapons: input.details[0].weapons,
        start_time: input.details[0].start_time*1000,
        end_time: input.details[0].end_time*1000,
        stage: input.details[0].stage
      };
    };
    static currentMatches(input, mode) {
      if (!input || !input instanceof Object) { return undefined }
      if (!mode) {
        return {
          regular: input.regular[0],
          gachi: input.gachi[0],
          league: input.league[0],
        };
      };
      let current = input[mode][0];
      if (!current) { return null }
      return {
        start_time: current.start_time*1000,
        end_time: current.end_time*1000,
        stages: [current.stage_a, current.stage_b],
        mode: current.game_mode,
      };
    };
};

module.exports = SplatAPI;
