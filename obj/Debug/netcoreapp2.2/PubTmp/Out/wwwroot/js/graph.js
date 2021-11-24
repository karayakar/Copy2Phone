var timeFormat = 'MM/DD/YYYY HH:mm:ss';
timeFormat = 'HH:mm:ss';
function newDateString(days) {
    return moment().add(days, 'd').format(timeFormat);
}

function getNextSeconds(seconds) {
    return moment().add(seconds, 's').format(timeFormat);
}


Array.prototype.last = function () {
    return this[this.length - 1];
};


function getTimeLabels(s) {
    var labels = [];
    if (s > 0) {
        for (var i = 0; i < s; i++) {
            labels.push(getNextSeconds(i));
        }
    } else {
        for (var i = s; i < 0; i++) {
            labels.push(getNextSeconds(i));
        }
    }

    return labels;
}

function fillvalues(s) {
    var values = [];

    for (var i = 0; i < s; i++) {
        values.push(0);
    }
    return values;
}

function setLabels() {
    var labelsPrev = getTimeLabels(-90);
    var labelsNext = getTimeLabels(30);

    return labelsPrev.concat(labelsNext);

}

var color = Chart.helpers.color;
var config = {
    type: 'bar',
    data: {
        labels: [],
        datasets: [{
            type: 'bar',
            label: 'Buy',
            backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
            borderColor: window.chartColors.green,
            data: [],
        }, {
            type: 'bar',
            label: 'Sell',
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            data: [],
        }, {
            type: 'line',
            label: 'Current Price',
            backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(),
            borderColor: window.chartColors.grey,
            fill: false,
            data: [],
        }]
    },
    options: {
        title: {
            text: 'Chart.js Combo Time Scale'
        },

        scales: {
            xAxes: [{
                type: 'time',
                display: true,
                time: {
                    format: timeFormat,
                    // round: 'day'
                }
            }],

        },
    }
};
var configVolume = {
    type: 'bar',
    data: {
        labels: [

        ],
        datasets: [{
            type: 'bar',
            label: 'PredictionA',
            backgroundColor: color(window.chartColors.green).alpha(0.5).rgbString(),
            borderColor: window.chartColors.green,
            data: [

            ],
        }, {
            type: 'bar',
            label: 'PredictionB',
            backgroundColor: color(window.chartColors.red).alpha(0.5).rgbString(),
            borderColor: window.chartColors.red,
            data: [

            ],
        }, {
            type: 'line',
            label: 'FutureA',
            backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(),
            borderColor: window.chartColors.grey,
            fill: false,
            data: [

            ],
        }, {
            type: 'line',
            label: 'FutureB',
            backgroundColor: color(window.chartColors.grey).alpha(0.5).rgbString(),
            borderColor: window.chartColors.grey,
            fill: false,
            data: [

            ],
        }]
    },
    options: {
        title: {
            text: 'Chart.js Combo Time Scale'
        },

        scales: {
            xAxes: [{
                type: 'time',
                display: true,
                time: {
                    format: timeFormat,
                    // round: 'day'
                }
            }],

        },
    }
};

window.onload = function () {
    //var ctx = document.getElementById('canvas').getContext('2d');
    //window.myLine = new Chart(ctx, config);

    //var ctx2 = document.getElementById('volumecanvas').getContext('2d');
    //window.myLine2 = new Chart(ctx2, configVolume);


    var ctx = document.getElementById("canvas").getContext("2d");
    window.myLine = new Chart(ctx, config, {
        responsive: true
    });
    var ctx2 = document.getElementById("volumecanvas").getContext("2d");
    window.myLine2 = new Chart(ctx2, configVolume, {
        responsive: true
    });

};

//document.getElementById('addData').addEventListener('click', function () {
//    if (config.data.datasets.length > 0) {
//        config.data.labels.push(newDateString(config.data.labels.length));

//        for (var index = 0; index < config.data.datasets.length; ++index) {
//            config.data.datasets[index].data.push(randomScalingFactor());
//        }

//        window.myLine.update();
//    }
//});
