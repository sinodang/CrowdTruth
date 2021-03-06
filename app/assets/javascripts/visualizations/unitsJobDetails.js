function unitsJobDetails(category , categoryName, openModal) {
    var queryField = 'unit_id';
    var infoFields = [ {field:'type', name:'type'}, {field:'softwareAgent_id', name:'platform'} ];
    var querySettings = {};
    var jobsMaps = {};
    var yAxisTitle = 'unit clarity per job'

    if (category == '#crowdagents_tab'){
        queryField = 'crowdAgent_id';
        var yAxisTitle = 'metrics';
        infoFields.push({field:'avg_worker_agreement', name:'avg worker agreement in this job'});
        infoFields.push({field:'worker_cosine', name:'avg worker cosine in this job'});
        querySettings = {'metricCateg':'workers',metricFilter:['withoutFilter', 'withFilter'], aggName:'aggWorkers', metricFields:['avg_worker_agreement','worker_cosine'],
        metricName:['worker agreement','worker cosine'], metricSuffix: "",
        metricTooltip : [{key:'CrowdTruth Average Worker Agreement score', value:'Higher scores indicate better quality workers. Click to select/deselect.'},{key:'CrowdTruth Average Cosine Similarity', value:'Higher Scores indicate better quality workers. Click to select/deselect.'}]}
    } else {
        infoFields.push({field:'max_relation_Cos', name:'avg unit clarity in this job'});
        querySettings = {'metricCateg':'units', metricFilter:['withSpam', 'withoutSpam'], aggName:"aggUnits", metricFields:['max_relation_Cos'],
        metricName:['unit clarity'],
        metricTooltip : [{key:'CrowdTruth Average Unit Clarity', value:"the value is defined as the maximum unit annotation score achieved on any annotation for that unit. " +
            "High agreement over the annotations is represented by high cosine scores, indicating a clear unit. " +
                "Click to select/deselect."}],
        metricSuffix: ".avg"}
    }

    var urlBase = "/api/analytics/piegraph/?match[type][]=workerunit&";
    var currentSelection = [];
    var jobSelection = [];
    var currentSelectionInfo = {};
    var pieChartOptions = {};
    var unitInfo = {};
    var metrics_ids = [];
    var spam_ids = [];
    var seriesBase = [];
    var pieChart = "";
    var barChart = "";

    var createImage = function (id,chart, url, title, searchSet, w, h, x, y){
        var img = chart.renderer.image(url, w, h, x, y);
        img.add();
        img.css({'cursor': 'pointer'});
        img.attr({'title': 'Pop out chart'});
        img.attr("data-toggle", "tooltip");
        img.attr("style", "opacity:0.5");
        img.attr("id", id);
        img.attr("title", title);
        img.on('click', function () {
            var hideIcon = true;
            for (var series in searchSet) {
                var series_id = searchSet[series];
                if (barChart.series[series_id].visible) {
                    hideIcon = true;
                    barChart.series[series_id].hide()
                    barChart.series[series_id].options.showInLegend = false;
                    barChart.series[series_id].legendItem = null;
                    barChart.legend.destroyItem(barChart.series[series_id]);
                    barChart.legend.render();
                } else {
                    hideIcon = false;
                    barChart.series[series_id].show();
                    barChart.series[series_id].options.showInLegend = true;
                    barChart.legend.renderItem(barChart.series[series_id]);
                    barChart.legend.render();
                }

            }
            if (hideIcon == true) {
                this.setAttribute("style", "opacity:0.5");
            } else {
                this.setAttribute("style", "opacity:1");
            }
        });
    }

    var callback = function callback($this) {

        createImage("judgementButtonID",this, '/assets/judgements.png', "Low quality judgements", spam_ids, $this.chartWidth-60,15,19,14);


        createImage('metricsButtonID',this, '/assets/metrics.png',
            "Results of metrics before filtering the low quality annotations and workers",
            metrics_ids, $this.chartWidth-90, 16, 19, 12);

    }

    var compare = function (a, b) {
        a_array = a._id.split("/");
        b_array = b._id.split("/");
        a_id = a_array[a_array.length - 1];
        b_id = b_array[b_array.length - 1];
        return a_id - b_id;
    };

    var getJobsData = function (url) {
        //make a check and see which units have workers?
        var categories = [];
        var colorMaps = {};
        var seriesMaps = {};
        var colors =  Highcharts.getOptions().colors;
        var series = seriesBase;
        var jobsURL = url + 'project[' + queryField + ']=' + queryField +
            '&project[spam]=spam&group=job_id&push[spam]=spam&push[' + queryField + ']=' + queryField;
        for (var iterSeries in series) {
            series[iterSeries]['data'] = [];
        }

        //get the list of workers for this units
        $.getJSON(jobsURL, function (data) {
            data.sort(compare);
            var max = -1;
            var urlJobMatchStr = "";
            for (var iterData in data) {
                //urlJobMatchStr += "&match[_id][]=" + data[iterData]['_id'];
                categories.push(data[iterData]['_id']);
                jobsMaps[data[iterData]['_id']] = [];
                for (var iterSeries in series) {
                    if (iterSeries % 2 == 1)
                        continue
                    var unit_id = series[iterSeries]['name'];
                    var nonSpamValue = 0;
                    var spamValue = 0;
                    for (var iterUnits in data[iterData][queryField]) {
                        if (data[iterData][queryField][iterUnits] == unit_id) {
                            if (data[iterData]['spam'][iterUnits]) {
                                spamValue++
                            } else {
                                nonSpamValue++
                            }
                            jobsMaps[data[iterData]['_id']].push(unit_id);
                        }
                    }

                    var nextSeries = parseInt(iterSeries) + 1
                    series[iterSeries]['data'].push(nonSpamValue);
                    series[nextSeries]['data'].push(spamValue);
                    if (nonSpamValue + spamValue > max) {
                        max = nonSpamValue + spamValue;
                    }
                }
            }

            var newSeries = {};
            var urlJobsInfo =  '/api/v1/?field[type]=job&';
            for (var iterCateg in categories) {
                urlJobsInfo += 'field[_id][]=' + categories[iterCateg] + '&';
            }

            for (var iterSeries in series) {
                if (iterSeries % 2 == 1)
                    continue
                var color = Highcharts.Color(colors[iterSeries/2%(colors.length)]).get();
                var categoryID =  series[iterSeries]['name'];
                series[iterSeries]['color'] = color;
                series[iterSeries]['type'] = 'column';
                series[iterSeries]['categoryID'] = categoryID;


                var nextSeries = parseInt(iterSeries) + 1
                series[nextSeries]['color'] = Highcharts.Color(color).brighten(0.2).get();
                series[nextSeries]['type'] = 'column';
                series[nextSeries]['categoryID'] = categoryID;
                series[nextSeries]['borderWidth'] = 1;
                series[nextSeries]['showInLegend'] = false;
                series[nextSeries]['visible'] = false;
                series[nextSeries]['borderColor'] = 'red';
                currentSelectionInfo[categoryID + '_hide'] = currentSelectionInfo[categoryID]

                newSeries[categoryID] = {};
                for (var iterMetric in querySettings['metricFields']){
                    var metricName = querySettings['metricFields'][iterMetric]

                    var metricFilters = querySettings['metricFilter']
                    for (var iterFilter in metricFilters) {
                        urlJobsInfo += '&only[]=metrics.' + querySettings['metricCateg'] + '.' +
                            metricFilters[iterFilter] + '.' + categoryID +  querySettings['metricSuffix'] +'.' + metricName;
                    }

                    var dashStyle ='shortdot';
                    if (iterMetric % 2 == 0) { dashStyle = 'LongDash'; }
                    var worker_id = categoryID;
                    var arrayID = worker_id.split("/");
                    var value = arrayID[arrayID.length - 1];

                    newSeries[categoryID][metricName] = {}
                    newSeries[categoryID][metricName][metricFilters[1]] =
                                                                      {'name': value + ' ' + querySettings['metricName'][iterMetric] + ' after filter' ,
                                                                        data:[],
                                                                        categoryID: categoryID,
                                                                        type: 'spline',
                                                                        lineWidth: 2,
                                                                        visible: false,
                                                                        color:Highcharts.Color(color).brighten(0.2).get(),
                                                                        dashStyle:dashStyle,
                                                                        yAxis:1};
                    newSeries[categoryID][metricName][metricFilters[0]] =
                                                                    {'name': value + ' ' + querySettings['metricName'][iterMetric] + ' before filter' ,
                                                                        data:[],
                                                                        categoryID: categoryID,
                                                                        type: 'spline',
                                                                        lineWidth: 0.5,
                                                                        showInLegend : false,
                                                                        visible: false,
                                                                        color:Highcharts.Color(color).brighten(0.2).get(),
                                                                        dashStyle:dashStyle,
                                                                        yAxis:1};

                    currentSelectionInfo[value + ' ' + querySettings['metricName'][iterMetric] + ' after filter'] = {}
                    currentSelectionInfo[value + ' ' + querySettings['metricName'][iterMetric] + ' before filter'] = {}
                    var metricKey = querySettings['metricTooltip'][iterMetric]['key'];
                    var metricValue = querySettings['metricTooltip'][iterMetric]['value'];
                    currentSelectionInfo[value + ' ' + querySettings['metricName'][iterMetric] + ' after filter']['tooltipLegend'] = {}
                    currentSelectionInfo[value + ' ' + querySettings['metricName'][iterMetric] + ' after filter']['tooltipLegend'][metricKey] = metricValue
                    currentSelectionInfo[value + ' ' + querySettings['metricName'][iterMetric] + ' before filter']['tooltipLegend'] = {}
                    currentSelectionInfo[value + ' ' + querySettings['metricName'][iterMetric] + ' before filter']['tooltipLegend'][metricKey] = metricValue

                }
            }

            //get worker's info
            var urlUnitInfo = '/api/analytics/metrics/?&'
            for (var indexUnits in currentSelection) {
                urlUnitInfo += 'match['+ queryField + '][]=' + currentSelection[indexUnits] + '&';
            }
            urlUnitInfo += 'match[type][]=workerunit&project[job_id]=job_id&push[job_id]=job_id' +
                '&metrics[]=type&metrics[]=softwareAgent_id&'
            for (var indexMetric in querySettings['metricFields']) {
                urlUnitInfo += 'metrics[]=metrics.' + querySettings['aggName'] + '.mean.' + querySettings['metricFields'][indexMetric] + '&';
            }

            $.getJSON(urlUnitInfo, function (data) {
                for(var iterData in data) {
                    unitInfo[data[iterData]['_id']] = data[iterData];
                    for (var indexMetric in querySettings['metricFields']) {
                        var metricName = querySettings['metricFields'][indexMetric];
                        unitInfo[data[iterData]['_id']][metricName] = data[iterData]['metrics'][querySettings['aggName']]['mean'][metricName];
                    }
                }

                $.getJSON(urlJobsInfo, function (data) {
                    data.sort(compare);
                    var maxMetric = -1;
                    for (var iterData in data) {
                        var metrics_before_filter = data[iterData]['metrics'][querySettings['metricCateg']][querySettings['metricFilter'][0]];
                        var metrics_after_filter = data[iterData]['metrics'][querySettings['metricCateg']][querySettings['metricFilter'][1]];
                        for (var iterSeries in series) {
                            if (iterSeries % 2 == 1)
                                continue
                            var id = series[iterSeries]['name'];
                            if (id in metrics_before_filter){
                                for (var indexMetric in querySettings['metricFields']) {
                                    var metricName = querySettings['metricFields'][indexMetric];
                                    var filters = querySettings['metricFilter'];
                                    var beforeData = metrics_before_filter[id][metricName]
                                    var afterData = metrics_after_filter[id][metricName]
                                    if (querySettings['metricSuffix'] != "" ){
                                        beforeData = metrics_before_filter[id]['avg'][metricName];
                                        afterData = metrics_after_filter[id]['avg'][metricName];
                                    }

                                    newSeries[id][metricName][filters[0]]['data'].push(beforeData);
                                    newSeries[id][metricName][filters[1]]['data'].push(afterData);
                                    if (beforeData > maxMetric) {
                                        maxMetric = beforeData
                                    }
                                    if (afterData > maxMetric) {
                                        maxMetric = afterData
                                    }
                                }
                            } else {
                                for (var indexMetric in querySettings['metricFields']) {
                                    var metricName = querySettings['metricFields'][indexMetric];
                                    var filters = querySettings['metricFilter'];
                                    newSeries[id][metricName][filters[0]]['data'].push(0);
                                    newSeries[id][metricName][filters[1]]['data'].push(0);
                                }
                            }
                        }
                    }

                    for (var iterSeries = 0; iterSeries < series.length; iterSeries++) {
                        var series_name = series[iterSeries]['name'];

                        if (series_name.indexOf("_hide") != -1) continue;

                        for (var metricKey in newSeries[series_name]) {
                            series.splice(iterSeries, 0, newSeries[series_name][metricKey][filters[0]], newSeries[series_name][metricKey][filters[1]]);
                            iterSeries += 2
                        }

                    }
                    metrics_ids = [];
                    spam_ids = [];
                    for (var series_id in series) {
                        var series_name = series[series_id]['name'];
                        if (series_name.indexOf("_hide") != -1) {
                            spam_ids.push(series_id)
                        }
                        if (series_name.indexOf("before filter") != -1) {
                            metrics_ids.push(series_id)
                        }
                    }

                    drawBarChart(series, categories , [max, maxMetric]);
                    var buttonLength = barChart.exportSVGElements.length;
                    barChart.exportSVGElements[buttonLength - 2].hide();
                });
            });
        });
    }

    var drawBarChart = function (series, categories, max) {
        //get the metrics for the units

        barChart = new Highcharts.Chart({
            chart: {
                zoomType: 'x',
                renderTo: 'jobsBar_div',
                alignTicks: false,
                marginRight: 60,
                marginLeft: 60,
                resetZoomButton: {

                    theme:{
                        fill: '#2aabd2',
                        style:{
                            color:'white'
                        }
                    },
                    position:{
                        x: -70,
                        y: -50
                    }
                },
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(235, 235, 255)'],
                        [1, 'rgb(255, 255, 255)']
                    ]
                },
                type: 'column',
                width: (3.7*(($('.maincolumn').width() - 0.05*($('.maincolumn').width()))/5)),
                height: 430,
                events: {
                    load: function () {
                        var chart = this,
                            legend = chart.legend;
                        for (var i = 0, len = legend.allItems.length; i < len; i++) {
                            var item = legend.allItems[i].legendItem;
                            var tooltipValue = "";
                            /*if (typeof currentSelectionInfo[legend.allItems[i].name]['tooltipLegend'] === 'string') {
                             var tooltipValue = currentSelectionInfo[legend.allItems[i].name]['tooltipLegend'];
                             } else {*/
                            for (var indexInfoKey in currentSelectionInfo[legend.allItems[i].name]['tooltipLegend']) {
                                tooltipValue +=  " " + indexInfoKey + ": " +
                                    currentSelectionInfo[legend.allItems[i].name]['tooltipLegend'][indexInfoKey] + '<br/>';
                            }
                            //}

                            item.attr("data-toggle","tooltip");
                            item.attr("title", tooltipValue);

                        }

                    }
                }
            },
            exporting: {
                buttons: {
                    resetButton: {
                        text: "View in jobs' chart",
                        theme: {
                            fill: '#2aabd2',
                            id:"resetSelection",
                            style:{
                                color: 'white'
                            }
                        },
                        x: - (3.7*(($('.maincolumn').width() - 0.05*($('.maincolumn').width()))/5)) + 160,
                        y: 0,
                        onclick: function(e) {
                            localStorage.setItem("jobList", JSON.stringify(jobSelection));
                            $('#jobTabOption')[0].children[0].click();
                        }
                    }
                }
            },
            title: {
                style: {
                    fontWeight: 'bold'
                },
                text: 'Judgements on ' + categories.length +' Job(s) of ' + currentSelection.length + ' Selected ' +  categoryName + '(s)'
            },
            subtitle: {
                text: 'Select an area to zoom. To see detailed information select individual units.From legend select/deselect features.'
            },
            xAxis: {
                tickInterval: Math.ceil( categories.length/35),
                title :{
                    text: 'Job ID'
                },
                categories: categories,
                labels: {
                    formatter: function () {
                        var arrayUnit = this.value.split("/");
                        var value = arrayUnit[arrayUnit.length - 1];
                        return value;
                    },
                    rotation: -45,
                    align: 'right'
                },
                events:{
                    setExtremes :function (event) {
                        var min = 0;
                        if (event.min != undefined){
                            min = event.min;
                        }
                        var max = barChart.series[0].data.length
                        if (event.max != undefined){
                            max = event.max;
                        }
                        // chart.yAxis[0].options.tickInterval
                        barChart.xAxis[0].options.tickInterval = Math.ceil( (max-min)/20);
                    },
                    afterSetExtremes :function(event){
                        var graph = '';
                        var interval = (event.max - event.min + 1);
                        if (interval == barChart.series[0].data.length) {
                            title = 'Judgements on ' + interval.toFixed(0) +' Job(s) of ' + currentSelection.length + ' Selected ' +  categoryName + '(s)'
                        } else {
                            title = 'Judgements on ' + interval.toFixed(0) + '/' + barChart.series[0].data.length +' Job(s) of ' + currentSelection.length + ' Selected ' +  categoryName + '(s)'
                        }
                        barChart.setTitle({text: title});
                    }
                }

            },
            legend: {
                maxHeight: 100,
                labelFormatter: function() {
                    var arrayName = this.name.split("/");
                    var value = arrayName[arrayName.length - 1];
                    if (arrayName.length > 1) {
                        var indexHideStr = value.indexOf('_hide')
                        if (indexHideStr != -1) {
                            return  '# of low quality judgements of ' + categoryName + ' ' + value.substring(0, indexHideStr);
                        } else {
                            return  '# of high quality judgements of ' + categoryName + ' ' + value;
                        }

                    } else {
                        return categoryName + ' ' + value;
                    }
                }
            },
            yAxis: [{
                min: 0,
                offset: 0,
                showEmpty: false,
                labels: {
                    formatter: function () {
                        return this.value;
                    },
                    style: {
                        color: '#274B6D'
                    }
                },
                gridLineColor:  '#274B6D',
                startOnTick: false,
                endOnTick: false,
                title: {
                    text: '# judgements per job',
                    style: {
                        color: '#274B6D'
                    }
                }
            },
                {
                    min: 0,
                    offset: 0,
                    showEmpty: false,
                    labels: {
                        formatter: function () {
                            return this.value;
                        },
                        style: {
                            color: '#4897F1'
                        }
                    },
                    gridLineColor:  '#4897F1',
                    startOnTick: false,
                    endOnTick: false,
                    title: {
                        text: yAxisTitle,
                        style: {
                            color: '#4897F1'
                        }
                    },
                    opposite:true
                }],
            tooltip: {

                hideDelay:10,
                useHTML : true,
                formatter: function() {
                    var arrayID = this.x.split("/");
                    var id =  arrayID[arrayID.length - 1];
                    var s = '<div style="white-space:normal;"><b>Job '+ id +'</b><br/>';
                    for (var index in infoFields) {
                        var field = infoFields[index]['field'];
                        var pointValue =  unitInfo[this.x][field];
                        if (pointValue != undefined &&!(typeof pointValue === 'string') && !(pointValue % 1 === 0)){
                            pointValue = pointValue.toFixed(2);
                        }
                        s +=  '' + infoFields[index]['name'] + ' : ' + pointValue + '<br/>';
                    }


                    var seriesOptions = {};
                    $.each(this.points, function(i, point) {
                        var pointValue = point.y
                        if (pointValue != undefined &&!(typeof pointValue === 'string') && !(pointValue % 1 === 0)){
                            pointValue = point.y.toFixed(2);
                        }
                        var id = point.series.options.categoryID;

                        var name = point.series.name;
                        var arrayName = id.split('/');
                        var shortName = arrayName[arrayName.length - 1];
                        if (point.series.type == 'column') {
                            var indexHideStr = point.series.name.indexOf('_hide')
                            if (indexHideStr != -1) {
                                name = '# of low quality judgements in this job';
                            } else {
                                name = '# of high quality judgements in this job';
                            }
                        } else {
                            name = name.substr(shortName.length + 1,name.length) + ' in this job';
                        }

                        var line = '<tr><td></td><td style="color: ' + point.series.color + ';text-align: left">&nbsp;&nbsp;'
                            + name +':</td>' + '<td style="text-align: right">' + pointValue + '</td></tr>';
                        if(!(id in seriesOptions)){
                            seriesOptions[id] = [];
                        }
                        seriesOptions[id].push(line);
                    });
                    s += '<div style="border:1px solid black;text-align: center"></div>'
                    s += '<table calss="table table-condensed">';
                    for (var item in seriesOptions)
                    {
                        if (jobsMaps[this.x].indexOf(item) == -1) continue;
                        var arrayName = item.split('/');
                        var id = arrayName[arrayName.length - 1];
                        s += '<tr><td> </td><td style="text-align: left"><b>' + categoryName + ' ' +  id + ':</b></td></tr>';
                        if('tooltipChart' in currentSelectionInfo[item]){
                            for (var tooltipInfo in currentSelectionInfo[item]['tooltipChart']){
                                pointValue = currentSelectionInfo[item]['tooltipChart'][tooltipInfo];
                                if (pointValue != undefined &&!(typeof pointValue === 'string') && !(pointValue % 1 === 0)){
                                    pointValue = pointValue.toFixed(2);
                                }
                                s += '<tr><td></td><td style="text-align: left">&nbsp;&nbsp;' + tooltipInfo +':</td>'+
                                    '<td style="text-align: right">' + pointValue + '</td></tr>';
                            }
                        }

                        for(var li in seriesOptions[item]) {
                            s += seriesOptions[item][li];
                        }

                    }
                    s += '</table>';

                    return s;
                },
                shared: true,
                crosshairs: true
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                series: {
                    minPointLength : 2
                },
                column: {
                    stacking: 'normal',
                    states: {

                        select: {
                            color: null,
                            borderWidth:3,
                            borderColor:'Blue'
                        }
                    },

                    point: {
                        events: {
                            contextmenu: function (e) {
                                urlBase = "";

                                for (var indexUnits in currentSelection) {
                                    urlBase += 'match['+ queryField + '][]=' + currentSelection[indexUnits] + '&';
                                }
                                anchorModal = $('<a class="testModal"' +
                                    'data-modal-query="job=' + this.category + '&' + urlBase + '" data-api-target="/api/analytics/job?" ' +
                                    'data-target="#modalIndividualJob" data-toggle="tooltip" data-placement="top" title="" ' +
                                    'data-original-title="Click to see the individual worker page">6345558 </a>');
                                //$('body').append(anchorModal);
                                openModal(anchorModal, "#job_tab");


                            },
                            click: function () {
                                for (var iterSeries = 0; iterSeries < barChart.series.length; iterSeries++) {
                                    barChart.series[iterSeries].data[this.x].select(null,true);
                                }

                                if($.inArray(this.category, jobSelection) > -1) {
                                    jobSelection.splice( $.inArray(this.category, jobSelection), 1 );
                                } else {
                                    jobSelection.push(this.category)
                                }


                                var buttonLength = barChart.exportSVGElements.length;
                                if(jobSelection.length == 0) {
                                    barChart.exportSVGElements[buttonLength - 2].hide();
                                } else {
                                    barChart.exportSVGElements[buttonLength - 2].show();
                                }



                            }
                        }
                    }
                }
            },
            series: series
        },callback);

    }

    var drawPieChart = function (platform, spam, totalValue) {
        pieChart = new Highcharts.Chart({
            chart: {
                renderTo: 'jobsPie_div',
                backgroundColor: {
                    linearGradient: [0, 0, 500, 500],
                    stops: [
                        [0, 'rgb(255, 255, 255)'],
                        [1, 'rgb(225, 225, 255)']
                    ]
                },
                type: 'pie',
                width: (1.3*(($('.maincolumn').width() - 0.05*($('.maincolumn').width()))/5)),
                height: 430
            },
            title: {
                style: {
                    fontWeight: 'bold'
                },
                text: 'Platform distribution for ' + totalValue + ' Job(s) of the ' + currentSelection.length + ' selected ' + categoryName + '(s)'
            },
            subtitle: {
                text: 'Click a category to see the distribution of judgements per jobs'
            },
            yAxis: {
                scalable:false,
                title: {
                    text: 'Number of workers per unit'
                }
            },
            dataLabels: {
                enabled: true
            },
            credits: {
                enabled: false
            },
            plotOptions: {
                pie: {

                    shadow: false,

                    allowPointSelect: true,
                    center: ['50%', '50%'],
                    point: {
                        events: {
                            click: function () {
                                searchSet = pieChartOptions[this.options.platform]['all'];
                                if ('type' in this.options) {
                                    searchSet = pieChartOptions[this.options.platform][this.options.type];
                                }

                                for (var iterData = 0; iterData < barChart.series[0].data.length; iterData++) {
                                    seriesCategory = barChart.series[0].data[iterData].category;
                                    if($.inArray(seriesCategory, searchSet) > -1 && !this.selected ) {
                                        for (var iterSeries = 0; iterSeries < barChart.series.length; iterSeries++) {
                                            barChart.series[iterSeries].data[iterData].select(true,true);
                                        }

                                    } else {
                                        for (var iterSeries = 0; iterSeries < barChart.series.length; iterSeries++) {
                                            barChart.series[iterSeries].data[iterData].select(false,true);
                                        }
                                    }
                                }

                            }
                        }
                    }
                }
            },
            tooltip: {
                useHTML : true,
                formatter: function() {
                    var seriesValue = this.key;
                    return '<p><b>' + seriesValue + ' </b></br>' + this.series.name + ' : ' +
                        this.percentage.toFixed(2) + ' % ('  + this.y + '/' + this.total + ')' +
                        '</p>';
                },
                followPointer : false,
                hideDelay:10
            },

            series: [
                {
                    name: '# of jobs',
                    data: platform,
                    size: '40%',
                    dataLabels: {
                        formatter: function () {
                            // display only if larger than 1
                            return this.point.name;
                        },
                        color: 'white',
                        distance: -30
                    }


                },
                {
                    name: '# of jobs',
                    data: spam,
                    size: '60%',
                    innerSize: '40%',
                    dataLabels: {
                        formatter: function () {
                            // display only if larger than 1
                            return this.point.name;
                        },
                        color: 'black',
                        distance: 3

                    }

                }
            ]
        });
    }


    this.update = function (selectedUnits, selectedInfo) {
        pieChartOptions = {};
        unitInfo = {};
        seriesBase = [];
        jobSelection = [];
        if(selectedUnits.length == 0){
                $('#jobsBar_div').hide();
                $('#jobsPie_div').hide();
            return;
        } else {
            $('#jobsBar_div').show();
            $('#jobsPie_div').show();
        }
        currentSelection = selectedUnits;
        currentSelectionInfo = selectedInfo
        seriesBase = [];
        urlBase = "/api/analytics/piegraph/?match[type][]=workerunit&";
        //create the series data
        for (var indexUnits in selectedUnits) {
            urlBase += 'match['+ queryField + '][]=' + selectedUnits[indexUnits] + '&';
            seriesBase.push({'name': selectedUnits[indexUnits], data: [],  yAxis: 0,
                type: 'column'});
            seriesBase.push({'name': selectedUnits[indexUnits] + '_hide', data: [],
                type: 'column'});
        }

        getJobsData(urlBase);

        platformURL = urlBase + 'project[job_id]=job_id&group=softwareAgent_id&addToSet=job_id';
        $.getJSON(platformURL, function (data) {
            var platformData = [];
            var categoriesData = [];
            var requests = [];
            var iterColors = 0;
            var colors = ['#FFC640', '#A69C00'];


            for (var platformIter in data) {
                var platformID = data[platformIter]['_id'];
                platformData.push({name: platformID, y: data[platformIter]['content'].length,
                    color: Highcharts.Color(colors[platformIter]).brighten(0.07).get(),
                    platform: platformID});
                pieChartOptions[platformID] = {};
                pieChartOptions[platformID]['all'] = data[platformIter]['content'];
                //get the jobs by category
                var urlType = "/api/analytics/piegraph/?match[type][]=job&";
                for (var jobIter in data[platformIter]['content']) {
                    urlType += 'match[_id][]='+data[platformIter]['content'][jobIter] + '&';
                }
                urlType += '&project[_id]=_id&group=type&addToSet=_id';
                requests.push($.get(urlType));

            }
            var defer = $.when.apply($, requests);
            defer.done(function () {
                var totalValue = 0;


                $.each(arguments, function (index, responseData) {
                    // "responseData" will contain an array of response information for each specific request
                    if ($.isArray(responseData)) {
                        if (responseData[1] == 'success') {
                            responseData = responseData[0];
                        }
                        for (var iterObj in responseData) {

                            categoriesData.push({name: responseData[iterObj]['_id'],
                                type: responseData[iterObj]['_id'],
                                y: responseData[iterObj].content.length,
                                color: Highcharts.Color(colors[index]).brighten(-0.01*iterObj).get(),
                                platform: data[index]['_id']});
                            totalValue += responseData[iterObj].content.length;
                            pieChartOptions[data[index]['_id']][responseData[iterObj]['_id']] = responseData[iterObj].content;
                        }
                    }
                });
                drawPieChart(platformData, categoriesData, totalValue);
            });

        });
       //get the list of jobs of the units grouped by platform units

       //get the set of job ids
       //get the types of the set of jobs
       //draw the
    }

    this.createUnitsJobDetails = function () {
    }

}