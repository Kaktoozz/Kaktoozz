TP IOT SENSOR API

- Download app.js - package.json - package-lock.json
- Make sur to have Nodejs / infludb and Grafana installed on your machine
- Open CMD find you influxdb.exe and launch it -start influxdb.exe
- if you want to create your own package.json type npm init (press enter everytime)
- You will need Express so > "npm install express --save"
- When you are logged on Graphana and Influxdb make sure to link Influxdb to Graphane
- Once this is done you just need to go on your API
- Field the information Bucket / org / token 
- You can DL my API and change this informations if you want
- Launch terminal in this repository (C:\Users\root\Downloads\tp-sensor\KJS) (location of my app.js) run "node app.js"
- Launch another terminal in this repository (C:\Users\root\Downloads\tp-sensor\tp-iot-main) (location of my humidity/temperature) run "npm run sensors"
- Once this done go on influx.db check if your data goes back on the site if yes go on graphan
- On graphana edit your dashboard > Simple Query field the information 
- You are done 