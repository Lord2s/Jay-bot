const { colors } = require('../func/colors.js');
const moment = require("moment-timezone");
const characters = '';
const getCurrentTime = () => colors.gray(moment().tz('Asia/Ho_Chi_Minh').format('HH:mm:ss DD/MM/YYYY'));

function logError(prefix, message) {
    if (message === undefined) {
        message = prefix;
        prefix = "ERROR";
    }
    process.stderr.write(`\r${getCurrentTime()} ${colors.redBright(`${characters} ${prefix}:`)} ${message}\n`);
}

function logWarn(prefix, message) {
    if (message === undefined) {
        message = prefix;
        prefix = "WARN";
    }
    process.stderr.write(`\r${getCurrentTime()} ${colors.yellowBright(`${characters} ${prefix}:`)} ${message}\n`);
}

function logInfo(prefix, message) {
    if (message === undefined) {
        message = prefix;
        prefix = "INFO";
    }
    process.stderr.write(`\r${getCurrentTime()} ${colors.greenBright(`${characters} ${prefix}:`)} ${message}\n`);
}

function logSuccess(prefix, message) {
    if (message === undefined) {
        message = prefix;
        prefix = "SUCCESS";
    }
    process.stderr.write(`\r${getCurrentTime()} ${colors.cyanBright(`${characters} ${prefix}:`)} ${message}\n`);
}

function logMaster(prefix, message) {
    if (message === undefined) {
        message = prefix;
        prefix = "MASTER";
    }
    process.stderr.write(`\r${getCurrentTime()} ${colors.hex("#eb6734", `${characters} ${prefix}:`)} ${message}\n`);
}

module.exports = {
    err: logError,
    error: logError,
    warn: logWarn,
    info: logInfo,
    success: logSuccess,
    master: logMaster
};
