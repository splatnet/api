const fs = require("fs");
const package = require("./package.json");

let methods = [];

let newscode = "";

let exists = require('fs').statSync('./NEWS.html');
if (exists) {
    let code = require('fs').readFileSync('./NEWS.html', { encoding: "utf8" });
    newscode = `<br><br><div class="note">
<h2>Important Information</h2>
${code}
</div>`;
};

let routes = fs.readdirSync("./routes/");
for (let file of routes) {
    var f = require("./routes/" + file);
    for (var use of f) {
        if (!use.method) { use.method = "get" };
        methods.push(use);
    };
};

var basecode = `<html>
<head>
<meta charset="utf8">
<title>splat2api</title>
<meta name="description" content="Splat2API is a public Splatoon 2 API, which you can use to retrieve information on current maps." />
<!-- Twitter Card data -->
<meta name="twitter:card" content="summary">
<meta name="twitter:site" content="@Terax235">
<meta name="twitter:title" content="Splat2API">
<meta name="twitter:description" content="Splat2API is a public Splatoon 2 API, which you can use to retrieve information on current maps.">
<meta name="twitter:creator" content="@Terax235">

<!-- Open Graph data -->
<meta property="og:title" content="Splat2API" />
<meta property="og:type" content="website" />
<meta property="og:url" content="http://api.splatoon.terax235.me/" />
<meta property="og:description" content="Splat2API is a public Splatoon 2 API, which you can use to retrieve information on current maps." />
<meta property="og:site_name" content="Terax235" />

<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css" integrity="sha384-MCw98/SFnGE8fJT3GXwEOngsV7Zt27NXFoaoApmYm81iuXoPkFOJwJ8ERdknLPMO" crossorigin="anonymous">
<link href="https://fonts.googleapis.com/css?family=Acme" rel="stylesheet">
<style>
body {
    background-color: #2C2F33;
    padding-left: 1cm;
    padding-top: 1cm;
    color: #FFFA;
}
.note {
    background-color: #7986CB;
    font-family: 'Acme', serif;
    border-style: solid;
    padding-left: 1rem;
    margin-right: 2rem;
}  
</style>
</head>
<body>
<h1>Welcome to splat2api</h1>
This API shows information about map schedules in Splatoon 2.<br>
By <a href="https://github.com/Terax235" target="_blank">Terax235</a> - Version ${package.version} - <a href="https://github.com/Terax235/splat2api" target="_blank">Source Code</a>\n
${newscode}
<br>
<h2>Documentation</h2>
<table style="width:100%">
<tr>
<th>Endpoint</th>
<th>Method</th>
<th>Description</th>
</tr>
${methods.filter(m => m.name != "/").map(end => `<tr>\n<td><a href="${end.name}" target="_blank">${end.name}</a></td>\n<td>${end.method.toUpperCase()}</td>\n<td>${end.description || "-"}</td>\n</tr>`).sort().join("\n")}
</table>
<br>
<h2>Latest News</h2>
<a href="https://discord.gg/fCWumjH"><img src="https://discordapp.com/api/guilds/480846510070693910/embed.png?style=banner2"></a>
<br><br>
<b>Build date:</b> 
${new Date()}
</body>
</html>`;

fs.writeFileSync("./index.html", basecode);

console.log("Documentation generated.");