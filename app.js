'use strict';
Object.defineProperty(exports, "__esModule", { value: true});

var influxdb_client_1 = require("@influxdata/influxdb-client");
const http = require("http");
const { InfluxDB } = require("influx");
const { parse } = require("path");
const argv = require("minimist")(process.argv.slice(2));

const url = "http://localhost:8086"
const token = "dAS5wUbilP0q3smNuX-LD--ZQp1n9Sryp8UBqCohfSwaJA7RRckMh6-fCVHsf36LLhHMImICN7nb0GFueyW4vA=="
const org = "Keyce"
const bucket = "Keyce"

var Bdd = new influxdb_client_1.InfluxDB({ url: url, token:token});
var writeApi = Bdd.getWriteApi(org, bucket);

function creationPoint(value, mode, threshold, code) {
    var pt1 = new influxdb_client_1.Point(mode)
        .floatField(mode, value)
        .floatField("threshold", threshold)
        .intField("code", code);
    return pt1;
}

function sendPoint(pt) {
    console.log(" ".concat(pt));
    writeApi.writePoint(pt);
    writeApi.flush().then(function () {
        console.log("Write finished");
    });
}

const requestListener = function (req, res, type){
    let data = "";
    req.on("data", (chunck) => {
        data += chunck;
    });
    req.on("end", () => {
        processInput ( type, res, data);
    });
}

const tRequestListener = function (req, res) {
    const type = "temperature";
    requestListener(req, res, type);
};

const hRequestListener = function (req, res) {
    const type ="humidity";
    requestListener(req, res, type);
};

const HServer = http.createServer(hRequestListener);

HServer.listen(1124, "localhost", () => {
    console.log(
        "H: http://localhost:1124"
    );
});

const TServer = http.createServer(tRequestListener);
TServer.listen(1123, "localhost", () => {
    console.log(
        "T: http://localhost:1123"
    );
});

function processInput(mode, res, data) {
    let threshold = 0;
    const frame = JSON.parse(data);
    let code = parseValue(frame.data, 0, 2);
    let value = parseValue(frame.data, 2, 6) / 10;
    if (frame.data.length > 6) {
        if(mode === "humidity"){
            threshold = parseValue(frame.data, 6, 10)
        }
        else{
            threshold = parseValue(frame.data, 6, 10) / 10;
        }
    }
    const pt = creationPoint(value, mode, threshold, code);
    sendPoint(pt);
    res.writeHead(200);
    res.end("Done");
}

function fromByte(string) {
    return parseInt(string, 16);
}

function parseValue(string, indexStart, indexEnd) {
    const result = string.substring(indexStart, indexEnd);
    return fromByte(result);
}

function close(){
    writeApi.close().then(function () {
        console.log("CLOSE API");
    });
}

process.on("exit", function () {
    close ()
});

process.on('SIGINT', function() {
    close()
});
