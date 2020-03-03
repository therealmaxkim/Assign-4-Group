const sensor = require("node-dht-sensor").promises;
const bunyan = require("bunyan");
const fs = require("fs");

const log = bunyan.createLogger({
    name: "dht",
    streams: [
        {
            path: "./dhtsensor.log",
            level: "debug"
        },
        {
            path: "/var/tmp/dhtsensorError.log",
            level: "error"
        }
    ]
});

log.info("This will be printed to the console, since 'info' is a log level above 'debug'");
log.error("This will also be written to a log file, since the file stream is for 'error' and higher");

setInterval(async () => {
    try {
        const reading = await sensor.read(22, 4);
        const temp = reading.temperature;
        const humi = reading.humidity;
        log.info(`temp: ${temp}°C, humidity: ${humi}%,`); //JSON.stringify property of temp holding temp. etc
//maybe log a json object, check bunyan

    } catch (e) {
        log.error("Error!");
        log.error(e);
    }
},1000);

function findLowAndHigh(){
    var myArgs = process.argv.slice(2);
    console.log('my Args: ', myArgs);
    var debugLog = myArgs[0]
    var errorLog = myArgs[1]

    var logText = fs.readFileSync(dhtsensor.log, "utf8");
    logText = logText.split('{,}');//split at new line character \n

    logText.foreach(function(part,index){ //map function (optional)
        this[index]= JSON.parse(this[index]);
    }, logText);

    logText = logText.filter(reading => reading['debugLog'] === debugLog); //look for only temp/humid

    logText.sort(function(a, b) {  //no need
        return a['temp'] - b['temp'];
    });

    var low = 'Does not exist';
    var high = 'Does not exist';
    if (logText.length > 0) {
        low = logText[0]['temp'];
        high = logText[logText.length-1]['temp'];
    }


}

