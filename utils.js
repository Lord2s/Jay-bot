const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const cheerio = require("cheerio");
const https = require("https");
const agent = new https.Agent({
    rejectUnauthorized: false
});
const moment = require("moment-timezone");
const mimeDB = require("mime-db");
const _ = require("lodash");
const { google } = require("googleapis");
const ora = require("ora");
const log = require("./logger/log.js");
const { isHexColor, colors } = require("./func/colors.js");
const Prism = require("./func/prism.js");

const { config } = global.GoatBot;
const { gmailAccount } = config.credentials;
const { clientId, clientSecret, refreshToken, apiKey: googleApiKey } = gmailAccount;
if (!clientId) {
    log.err("CREDENTIALS", `Please provide a valid clientId in file ${path.normalize(global.client.dirConfig)}`);
    process.exit();
}
if (!clientSecret) {
    log.err("CREDENTIALS", `Please provide a valid clientSecret in file ${path.normalize(global.client.dirConfig)}`);
    process.exit();
}
if (!refreshToken) {
    log.err("CREDENTIALS", `Please provide a valid refreshToken in file ${path.normalize(global.client.dirConfig)}`);
    process.exit();
}

const oauth2ClientForGGDrive = new google.auth.OAuth2(clientId, clientSecret, "https://developers.google.com/oauthplayground");
oauth2ClientForGGDrive.setCredentials({ refresh_token: refreshToken });
const driveApi = google.drive({
    version: 'v3',
    auth: oauth2ClientForGGDrive
});
const word = [
    'A', 'Á', 'À', 'Ả', 'Ã', 'Ạ', 'a', 'á', 'à', 'ả', 'ã', 'ạ',
    'Ă', 'Ắ', 'Ằ', 'Ẳ', 'Ẵ', 'Ặ', 'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ',
    'Â', 'Ấ', 'Ầ', 'Ẩ', 'Ẫ', 'Ậ', 'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ',
    'B', 'b',
    'C', 'c',
    'D', 'Đ', 'd', 'đ',
    'E', 'É', 'È', 'Ẻ', 'Ẽ', 'Ẹ', 'e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ',
    'Ê', 'Ế', 'Ề', 'Ể', 'Ễ', 'Ệ', 'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ',
    'F', 'f',
    'G', 'g',
    'H', 'h',
    'I', 'Í', 'Ì', 'Ỉ', 'Ĩ', 'Ị', 'i', 'í', 'ì', 'ỉ', 'ĩ', 'ị',
    'J', 'j',
    'K', 'k',
    'L', 'l',
    'M', 'm',
    'N', 'n',
    'O', 'Ó', 'Ò', 'Ỏ', 'Õ', 'Ọ', 'o', 'ó', 'ò', 'ỏ', 'õ', 'ọ',
    'Ô', 'Ố', 'Ồ', 'Ổ', 'Ỗ', 'Ộ', 'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ',
    'Ơ', 'Ớ', 'Ờ', 'Ở', 'Ỡ', 'Ợ', 'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ',
    'P', 'p',
    'Q', 'q',
    'R', 'r',
    'S', 's',
    'T', 't',
    'U', 'Ú', 'Ù', 'Ủ', 'Ũ', 'Ụ', 'u', 'ú', 'ù', 'ủ', 'ũ', 'ụ',
    'Ư', 'Ứ', 'Ừ', 'Ử', 'Ữ', 'Ự', 'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự',
    'V', 'v',
    'W', 'w',
    'X', 'x',
    'Y', 'Ý', 'Ỳ', 'Ỷ', 'Ỹ', 'Ỵ', 'y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ',
    'Z', 'z',
    ' '
];

const regCheckURL = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

class CustomError extends Error {
    constructor(obj) {
        if (typeof obj === 'string')
            obj = { message: obj };
        if (typeof obj !== 'object' || obj === null)
            throw new TypeError('Object required');
        obj.message ? super(obj.message) : super();
        Object.assign(this, obj);
    }
}

function lengthWhiteSpacesEndLine(text) {
    let length = 0;
    for (let i = text.length - 1; i >= 0; i--) {
        if (text[i] == ' ')
            length++;
        else
            break;
    }
    return length;
}

function lengthWhiteSpacesStartLine(text) {
    let length = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] == ' ')
            length++;
        else
            break;
    }
    return length;
}

function setErrorUptime() {
    global.statusAccountBot = 'block spam';
    global.responseUptimeCurrent = global.responseUptimeError;
}
const defaultStderrClearLine = process.stderr.clearLine;

function convertTime(miliSeconds, replaceSeconds = "s", replaceMinutes = "m", replaceHours = "h", replaceDays = "d", replaceMonths = "M", replaceYears = "y", notShowZero = false) {
    if (typeof replaceSeconds == 'boolean') {
        notShowZero = replaceSeconds;
        replaceSeconds = "s";
    }
    const second = Math.floor(miliSeconds / 1000 % 60);
    const minute = Math.floor(miliSeconds / 1000 / 60 % 60);
    const hour = Math.floor(miliSeconds / 1000 / 60 / 60 % 24);
    const day = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 % 30);
    const month = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 % 12);
    const year = Math.floor(miliSeconds / 1000 / 60 / 60 / 24 / 30 / 12);
    let formattedDate = '';

    const dateParts = [
        { value: year, replace: replaceYears },
        { value: month, replace: replaceMonths },
        { value: day, replace: replaceDays },
        { value: hour, replace: replaceHours },
        { value: minute, replace: replaceMinutes },
        { value: second, replace: replaceSeconds }
    ];

    for (let i = 0; i < dateParts.length; i++) {
        const datePart = dateParts[i];
        if (datePart.value)
            formattedDate += datePart.value + datePart.replace;
        else if (formattedDate != '')
            formattedDate += '00' + datePart.replace;
        else if (i == dateParts.length - 1)
            formattedDate += '0' + datePart.replace;
    }

    if (formattedDate == '')
        formattedDate = '0' + replaceSeconds;

    if (notShowZero)
        formattedDate = formattedDate.replace(/00\w+/g, '');

    return formattedDate;
}

function createOraDots(text) {
    const spin = new ora({
        text: text,
        spinner: {
            interval: 80,
            frames: [
                '⠋', '⠙', '⠹',
                '⠸', '⠼', '⠴',
                '⠦', '⠧', '⠇',
                '⠏'
            ]
        }
    });
    spin._start = () => {
        utils.enableStderrClearLine(false);
        spin.start();
    };
    spin._stop = () => {
        utils.enableStderrClearLine(true);
        spin.stop();
    };
    return spin;
}

class TaskQueue {
    constructor(callback) {
        this.queue = [];
        this.running = null;
        this.callback = callback;
    }
    push(task) {
        this.queue.push(task);
        if (this.queue.length == 1)
            this.next();
    }
    next() {
        if (this.queue.length > 0) {
            const task = this.queue[0];
            this.running = task;
            this.callback(task, async (err, result) => {
                this.running = null;
                this.queue.shift();
                this.next();
            });
        }
    }
    length() {
        return this.queue.length;
    }
}

function enableStderrClearLine(isEnable = true) {
    process.stderr.clearLine = isEnable ? defaultStderrClearLine : () => { };
}

function formatNumber(number) {
    const regionCode = global.GoatBot.config.language;
    if (isNaN(number))
        throw new Error('The first argument (number) must be a number');

    number = Number(number);
    return number.toLocaleString(regionCode || "en-US");
}

function getExtFromAttachmentType(type) {
    switch (type) {
        case "photo":
            return 'png';
        case "animated_image":
            return "gif";
        case "video":
            return "mp4";
        case "audio":
            return "mp3";
        default:
            return "txt";
    }
}

function getExtFromMimeType(mimeType = "") {
    return mimeDB[mimeType] ? (mimeDB[mimeType].extensions || [])[0] || "unknow" : "unknow";
}

function getExtFromUrl(url = "") {
    if (!url || typeof url !== "string")
        throw new Error('The first argument (url) must be a string');
    const reg = /(?<=https:\/\/cdn.fbsbx.com\/v\/.*?\/|https:\/\/video.xx.fbcdn.net\/v\/.*?\/|https:\/\/scontent.xx.fbcdn.net\/v\/.*?\/).*?(\/|\?)/g;
    const fileName = url.match(reg)[0].slice(0, -1);
    return fileName.slice(fileName.lastIndexOf(".") + 1);
}

function getPrefix(threadID) {
    if (!threadID || isNaN(threadID))
        throw new Error('The first argument (threadID) must be a number');
    threadID = String(threadID);
    let prefix = global.GoatBot.config.prefix;
    const threadData = global.db.allThreadData.find(t => t.threadID == threadID);
    if (threadData)
        prefix = threadData.data.prefix || prefix;
    return prefix;
}

function getTime(timestamps, format) {
    // check if just have timestamps -> format = timestamps
    if (!format && typeof timestamps == 'string') {
        format = timestamps;
        timestamps = undefined;
    }
    return moment(timestamps).tz(config.timeZone).format(format);
}

/**
 * @param {any} value
 * @returns {("Null" | "Undefined" | "Boolean" | "Number" | "String" | "Symbol" | "Object" | "Function" | "AsyncFunction" | "Array" | "Date" | "RegExp" | "Error" | "Map" | "Set" | "WeakMap" | "WeakSet")}
 */
function getType(value) {
    return Object.prototype.toString.call(value).slice(8, -1);
}

function isNumber(value) {
    return !isNaN(parseFloat(value));
}

function jsonStringifyColor(obj, filter, indent, level) {
    // source: https://www.npmjs.com/package/node-json-color-stringify
    indent = indent || 0;
    level = level || 0;
    let output = '';

    if (typeof obj === 'string')
        output += colors.green(`"${obj}"`);
    else if (typeof obj === 'number' || typeof obj === 'boolean' || obj === null)
        output += colors.yellow(obj);
    else if (obj === undefined)
        output += colors.gray('undefined');
    else if (obj !== undefined && typeof obj !== 'function')
        if (!Array.isArray(obj)) {
            if (Object.keys(obj).length === 0)
                output += '{}';
            else {
                output += colors.gray('{\n');
                Object.keys(obj).forEach(key => {
                    let value = obj[key];

                    if (filter) {
                        if (typeof filter === 'function')
                            value = filter(key, value);
                        else if (typeof filter === 'object' && filter.length !== undefined)
                            if (filter.indexOf(key) < 0)
                                return;
                    }

                    // if (value === undefined)
                    // 	return;
                    if (!isNaN(key[0]) || key.match(/[^a-zA-Z0-9_]/))
                        key = colors.green(JSON.stringify(key));

                    output += ' '.repeat(indent + level * indent) + `${key}:${indent ? ' ' : ''}`;
                    output += utils.jsonStringifyColor(value, filter, indent, level + 1) + ',\n';
                });

                output = output.replace(/,\n$/, '\n');
                output += ' '.repeat(level * indent) + colors.gray('}');
            }
        }
        else {
            if (obj.length === 0)
                output += '[]';
            else {
                output += colors.gray('[\n');
                obj.forEach(subObj => {
                    output += ' '.repeat(indent + level * indent) + utils.jsonStringifyColor(subObj, filter, indent, level + 1) + ',\n';
                });

                output = output.replace(/,\n$/, '\n');
                output += ' '.repeat(level * indent) + colors.gray(']');
            }
        }
    else if (typeof obj === 'function')
        output += colors.green(obj.toString());

    output = output.replace(/,$/gm, colors.gray(','));
    if (indent === 0)
        return output.replace(/\n/g, '');

    return output;
}

function message(api, event) {
    async function sendMessageError(err) {
        if (typeof err === "object" && !err.stack)
            err = utils.removeHomeDir(JSON.stringify(err, null, 2));
        else
            err = utils.removeHomeDir(`${err.name || err.error}: ${err.message}`);
        return await api.sendMessage(utils.getText("utils", "errorOccurred", err), event.threadID, event.messageID);
    }
    return {
        send: async (form, callback) => {
            try {
                global.statusAccountBot = 'good';
                return await api.sendMessage(form, event.threadID, callback);
            }
            catch (err) {
                if (JSON.stringify(err).includes('spam')) {
                    setErrorUptime();
                    throw err;
                }
            }
        },
        reply: async (form, callback) => {
            try {
                global.statusAccountBot = 'good';
                return await api.sendMessage(form, event.threadID, callback, event.messageID);
            }
            catch (err) {
                if (JSON.stringify(err).includes('spam')) {
                    setErrorUptime();
                    throw err;
                }
            }
        },
        unsend: async (messageID, callback) => await api.unsendMessage(messageID, callback),
        reaction: async (emoji, messageID, callback) => {
            try {
                global.statusAccountBot = 'good';
                return await api.setMessageReaction(emoji, messageID, callback, true);
            }
            catch (err) {
                if (JSON.stringify(err).includes('spam')) {
                    setErrorUptime();
                    throw err;
                }
            }
        },
        err: async (err) => await sendMessageError(err),
        error: async (err) => await sendMessageError(err)
    };
}

function randomString(max, onlyOnce = false, possible) {
    if (!max || isNaN(max))
        max = 10;
    let text = "";
    possible = possible || "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (let i = 0; i < max; i++) {
        let random = Math.floor(Math.random() * possible.length);
        if (onlyOnce) {
            while (text.includes(possible[random]))
                random = Math.floor(Math.random() * possible.length);
        }
        text += possible[random];
    }
    return text;
}

function randomNumber(min, max) {
    if (!max) {
        max = min;
        min = 0;
    }
    if (min == null || min == undefined || isNaN(min))
        throw new Error('The first argument (min) must be a number');
    if (max == null || max == undefined || isNaN(max))
        throw new Error('The second argument (max) must be a number');
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function removeHomeDir(fullPath) {
    if (!fullPath || typeof fullPath !== "string")
        throw new Error('The first argument (fullPath) must be a string');
    while (fullPath.includes(process.cwd()))
        fullPath = fullPath.replace(process.cwd(), "");
    return fullPath;
}

function splitPage(arr, limit) {
    const allPage = _.chunk(arr, limit);
    return {
        totalPage: allPage.length,
        allPage
    };
}

async function translateAPI(text, lang) {
    try {
        const res = await axios.get(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(text)}`);
        return res.data[0][0][0];
    }
    catch (err) {
        throw new CustomError(err.response ? err.response.data : err);
    }
}

async function downloadFile(url = "", path = "") {
    if (!url || typeof url !== "string")
        throw new Error(`The first argument (url) must be a string`);
    if (!path || typeof path !== "string")
        throw new Error(`The second argument (path) must be a string`);
    let getFile;
    try {
        getFile = await axios.get(url, {
            responseType: "arraybuffer"
        });
    }
    catch (err) {
        throw new CustomError(err.response ? err.response.data : err);
    }
    fs.writeFileSync(path, Buffer.from(getFile.data));
    return path;
}

async function findUid(link
