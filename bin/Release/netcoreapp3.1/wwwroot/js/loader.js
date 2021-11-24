var loader = (function () {

    function _load(tag) {
        return function (url) {
            // This promise will be used by Promise.all to determine success or failure
            return new Promise(function (resolve, reject) {
                var element = document.createElement(tag);
                var parent = 'body';
                var attr = 'src';

                // Important success and error for the promise
                element.onload = function () {
                    resolve(url);
                };
                element.onerror = function () {
                    reject(url);
                };

                // Need to set different attributes depending on tag type
                switch (tag) {
                    case 'script':
                        element.async = true;
                        element[attr] = url;
                        break;
                    case 'link':
                        element[attr] = url;
                        element.type = 'text/css';
                        element.rel = 'stylesheet';
                        attr = 'href';
                        parent = 'head';
                        break;
                    case 'div':
                    //$.get('templates/Template.html', function (data) {
                    //    html = data;
                    //}); 
                }
                debugger;
                // Inject into document to kick off loading
                element[attr] = url;
                $(parent).append(element);
            });
        };
    }

    return {
        css: _load('link'),
        js: _load('script'),
        img: _load('img'),
        html: _load('div')
    }
})();

function sortByKey(array, key) {
    return array.sort(function (a, b) {
        var x = a[key]; var y = b[key];
        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    });
}

function loaddependencies(loadModel) {
    debugger;
    var PromiseTemplate = "Promise.all([{{promise}}]).then(function () { console.log('Everything has loaded!'); }).catch(function (e) {console.log('Oh no, epic failure!'+e);})";
    var promises = "";
    //{ "Type": null, "Data": null, "Order": 0 };
    if (loadModel.length > 0) {
        sortByKey(loadModel, "Order");
        for (var i = 0; i < loadModel.length; i++) {
            if (loadModel[i].Type == "Script") {
                promises += "loader.js('" + loadModel[i].Data + "'),";
            } else if (loadModel[i].Type == "Css") {
                promises += "loader.css('" + loadModel[i].Data + "'),";
            } else if (loadModel[i].Type == "Image") {
                promises += "loader.img('" + loadModel[i].Data + "'),";
            } else if (loadModel[i].Type == "Html") {
                promises += "loader.html('" + loadModel[i].Data + "'),";
            }
        }
        promises = promises.substring(0, promises.length - 1);
        var promise = PromiseTemplate.replace('{{promise}}', promises);
        eval(promise);
    }

}
debugger;
loaddependencies([{ Type: "Script", Data: "Assets/models/webresponse.js", Order: 0 }]);
// Usage:  Load different file types with one callback
//Promise.all([
//    load.js('lib/highlighter.js'),
//    load.js('lib/main.js'),
//    load.css('lib/highlighter.css'),
//    load.img('images/logo.png')
//]).then(function () {
//    console.log('Everything has loaded!');
//}).catch(function () {
//    console.log('Oh no, epic failure!');
//});