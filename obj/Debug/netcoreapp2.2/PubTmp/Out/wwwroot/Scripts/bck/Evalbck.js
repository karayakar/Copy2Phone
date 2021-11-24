
var _ = require('lodash');
var request = require('xhr-request');
var fs = require('fs-extra');
var path = require('path');
var fuzzy = require('fuzzyset.js');

function dataObj(expression, step, name, botid) {
    var dataObject = {
        Expression: expression,
        Step: step,
        Activity: name,
        BotId: botid
    };
    return dataObject;
}

var sampleConversation = [{
    botid: "",
    activity: "",
    step: 0,
    conversation: {
        inputTerm: "",
        paramaters: ["", ""],
        responsePrefix: "",
        responseText: "Sorry I don't now that yet.",
        moveActivity: "",
        moveStep: 0,
        responseHtml: "",
        responseSuffix: "",
        responseScript: "",
        ApiResponse: {
            Url: "",
            method: "",
            headers: [{ "": "" }],
            payload: "",
            authentication: {
                type: "",
                credentials: { "": "" }
            },
            callActivity: { activityName: "", step: 0 }
        },
        errormessage: { message: "", speak: true, details: "" }
    }
}];


function fileread(filename) {

    var contents = fs.readFileSync(filename);
    return contents;
}

module.exports = function (callback, input) {

    //if (x === "currency" || (x.indexOf("currency") !== -1)) {
    //    var url = 'https://api.exchangeratesapi.io/latest';
    //    // callback(null, url);
    //    makeRequest('GET', url, function (err, callback) {
    //        if (err) { throw err; }
    //        console.log(callback);
    //    });

    //}

    debugger;
    var result = dataObj("I am having trouble to process, I can't help with that right now.", 0, "", "");
    try {
        result = runtest(input);
    } catch (e) {
        result = result;
    }


    //try {
    //    result = eval(exp);
    //} catch (e) {
    //     result = result;//"I didn't understand " + x + ". Can you try some other things. ";
    //}

    //
    callback(null, JSON.stringify(result));
};



function runtest(input) {
    var dataInput = dataObj();
    var botid = "";
    var exp = '';
    var step = 0;
    var activity = "";
    var conversation = '';
    try {
        dataInput = JSON.parse(input);
        if (dataInput && dataInput.BotId) {
            botid = dataInput.BotId;
        }
        if (dataInput && dataInput.Expression) {
            exp = dataInput.Expression;
        }
        if (dataInput && dataInput.Step) {
            step = dataInput.Step;
        }
        if (dataInput && dataInput.Activity) {
            activity = dataInput.Activity;
        }

    } catch (e) {
        exp = '';
        dataInput = '';
        activity = '';
        return "I am having trouble to process, I can't help with that right now.";
    }

    var conversationState = getConversationState(botid, activity, step, exp);
    if (conversationState) {
        var result = processResult(conversationState, exp);
        return result;
    } else {
        return "Error in conversation. I can't find conversation state.";
    }

}

function processResult(conversationState, exp) {

    var expression = '';
    try {
        if (conversationState.conversation.inputTerm == "") {
            conversationState.conversation.inputTerm = exp;
        }
        if (/^[-+]?[0-9]+([-+*/]+[-+]?[0-9]+)*$/.test(eval(conversationState.conversation.inputTerm))) {
            expression = eval(conversationState.conversation.inputTerm);
        }
    } catch (e) {
        expression = '';
    }
    if (expression === '') {
        expression = conversationState.conversation.responsePrefix + ' ' + conversationState.conversation.responseText + ' ' + conversationState.conversation.responseSuffix;
    }
    if (conversationState.conversation.responseScript !== "") {
        expression = eval(conversationState.conversation.responseScript);
    }

    var pObject = {
        Expression: expression,
        Step: conversationState.conversation.moveStep,
        Activity: conversationState.conversation.moveActivity,
        BotId: conversationState.botid
    };

    return pObject;
}

function getConversationState(botid, activity, step, exp) {
    var conversation = fs.readJsonSync('wwwroot\\Scripts\\generic.json');
    if (botid === "") {
        // conversation = fs.readJsonSync('wwwroot\\Scripts\\generic.json');// fileread('wwwroot\\Scripts\\generic.json');
    } else {
        try {
            conversation = fs.readJsonSync('wwwroot\\Scripts\\' + botid + '.json');
        } catch (e) {
            conversation = conversation;
        }

    }
    var result = null;
    if (result === null && botid !== "" && activity !== "" && step !== 0) {
        result = _.find(conversation, function (o) {
            return o.botid === botid && o.activity === activity && o.step === step;// && o.conversation.inputTerm === exp;
        });
        //substep process here
    }

    if (result === null && botid !== "" && activity !== "" && step === 0) {
        result = _.find(conversation, function (o) {
            return o.botid === botid && o.activity === activity && o.conversation.inputTerm === exp;
        });
    }
    if (result === null && botid !== "" && activity === "" && step === 0) {
        for (var i = 0; i <= conversation.length; i++) {
            var item = inputSentence(exp, [conversation[i].conversation.inputTerm]);

            if (item && item.r) {
                return conversation[i];
            }
        }
        //result = _.find(conversation, function (o) {

        //    return o.botid === botid && o.activity === activity && o.conversation.inputTerm === exp;
        //});
    }
    if (result === null && activity === "" && step === 0) {
        result = _.find(conversation, function (o) {
            return o.botid === botid && o.conversation.inputTerm === exp;
        });
    }
    if (result === null && botid === "" && activity === "" && step === 0) {
        result = _.find(conversation, function (o) {
            return o.botid === "" && o.conversation.inputTerm === exp;
        });
    }
    if (!result) {
        result = sampleConversation[0];
        result.conversation.inputTerm = exp;
        // return sampleConversation[0];
    }
    return result;

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


function check(inputSentence, arrayDictionary) {
    if (!arrayDictionary) {
        arrayDictionary = [""];
    }
    var a = FuzzySet(arrayDictionary, false, 2, 6);
    return a.get(inputSentence, null, 0.33);
}

function inputSentence(input, arrayDictionary) {

    input = cleanStr(input);
    var wordArray = input.split(' ');
    var inputdict = input.replace(/ /g, '\r\n');
    console.log(input);
    console.log(wordArray);
    console.log(inputdict);
    var resultWhole = check(input, arrayDictionary);
    var unknownWords = wordArray;
    var knownWords = [];
    console.log(resultWhole);
    for (var i = 0; i < wordArray.length; i++) {
        var result = check(wordArray[i], arrayDictionary);

        if (result) {
            knownWords.push({ Score: result[0][0], Word: result[0][1] });
            for (var j = 0; j < unknownWords.length - 1; j++) {
                if (unknownWords[j] === result[0][1]) {
                    unknownWords.splice(j, 1);
                }
            }

        }
    }
    console.log('unknown words');
    console.log(unknownWords);
    console.log('known words');
    console.log(knownWords);
    console.log('best possibility');
    console.log(resultWhole);
    return { r: resultWhole, u: unknownWords, k: knownWords };
}

function cleanStr(s) {
    s = s.replace(/[&\/\\#+()$~%'"*<>{}]/g, '');
    s = s.replace(/[;:,.?]/g, ' ');
    return s;
}

/*
 function permutation(arrayInput){


function permute(input) {
var permArr = [],
    usedChars = [];
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
    return permArr;
};
return permute(arrayInput);
}
console.log(JSON.stringify(permutation(["what", "time", "is", "it"])));
*/