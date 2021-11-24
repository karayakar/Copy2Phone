var _ = require('lodash');
var request = require('xhr-request');

module.exports = function (callback, x) {
    if (x === "what time is it" || x === "what time is it?") {
        let result = "Current date and time is " + getdate();
        callback(null, result);
    }
    if (x === "how are you" || x === "how are you?" || x === "How are you?") {
        let result = "I am very well, thank you, how about you.";
        callback(null, result);
    }
    if (x === "how is the weather" || x === "How is the weather?" || x === "how is outside?") {
        let result = "Hmm, I am not sure. May be I can ask google.";
        callback(null, result);
    }
    if (x === "tell me a joke" || x === "tell me joke" || x === "joke") {
        let result = "Why are you asking me joke? Because you just want to test me.";
        callback(null, result);
    }
    if (x === "congratulations" || x === "Congratulations" || x === "Congratulations!") {
        let result = "Yees, whoowhoo! yuppii.";
        callback(null, result);
    }
    if (x === "stop") {
        let result = "I can't stop talking, it is not going to work that way.";
        callback(null, result);
    }
    if (x === "currency" || (x.indexOf("currency") !== -1)) {
        var url = 'https://api.exchangeratesapi.io/latest';
        getdata(url, callback);
    }
    var result = "I didn't get that.";
    try {
        result = eval(x);
    } catch (e) {
        result = x;//"I didn't understand " + x + ". Can you try some other things. ";
    }

    callback(null, result);
};


function getdata(url, callback) {
    request(url, {
        json: true
    }, function (err, data) {

        if (err) { throw err; }
        var d = JSON.parse(data.response);
        var USD = d.rates.USD;
        var TRY = d.rates.TRY;
        var response = 'One united states dollar is equal to ' + TRY + ' turkish liras.';
        // the JSON result
        callback(null, response);
        //console.log(data.foo.bar);
    });
}

function getdate() {
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var d = new Date();
    var day = days[d.getDay()];
    var hr = d.getHours();
    var min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "AM";
    if (hr > 12) {
        hr -= 12;
        ampm = "PM";
    }
    var date = d.getDate();
    var month = months[d.getMonth()];
    var year = d.getFullYear();

    return day + " " + hr + ":" + min + " " + ampm + " " + date + " " + month + " " + year;
}

/*
var permArr = [],
    usedChars = [];

function permute(input) {
    var i, ch;
    for (i = 0; i < input.length; i++) {
        ch = input.splice(i, 1)[0];
        usedChars.push(ch);
        if (input.length == 0) {
            permArr.push(usedChars.slice());
        }
        permute(input);
        input.splice(i, 0, ch);
        usedChars.pop();
    }
    return permArr
};
document.write(JSON.stringify(permute(["what", "time", "is", "it"])));
*/