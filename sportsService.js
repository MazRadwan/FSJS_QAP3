const https = require("https");

const fetchMLBData = (callback) => {
  const API_KEY = "fa257915face43338482a2750621f91a";
  const url = `https://api.sportsdata.io/v3/mlb/scores/json/GamesByDate/2023-06-09?key=${API_KEY}`;

  const req = https.get(url, (resp) => {
    let data = "";
    resp.on("data", (chunk) => {
      data += chunk;
    });
    resp.on("end", () => {
      console.log(data); // Log the data
      callback(JSON.parse(data));
    });
  });

  req.on("error", (err) => {
    console.error("Error fetching MLB data:", err.message);
  });

  req.setTimeout(5000, () => {
    // 5 seconds timeout
    req.abort();
    console.error("Request timed out");
  });
};

module.exports = {
  fetchMLBData,
};
