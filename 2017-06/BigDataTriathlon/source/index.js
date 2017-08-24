const fs = require('fs');
const xml2js = require('xml2js');
const moment = require('moment');

var parser = new xml2js.Parser();

const import_data = []
fs.readFile(__dirname + '/import/export.xml', function(err, data) {
    parser.parseString(data, function (err, result) {
        console.dir(result.HealthData.Record[0]['$']);
				(result.HealthData.Record).forEach(function (value) { 
        		if (value['$'].type  == 'HKQuantityTypeIdentifierStepCount') {
							if (!('Steps' in import_data)) {
								import_data['Steps'] = [];
							}
							import_data['Steps'].push({
								date: moment(value['$'].creationDate).format('LL'),
								time: moment(value['$'].creationDate).format('ha'),
								unit: value['$'].unit,
								units: value['$']['value']
							})
						}
				})
				console.log(import_data);
    });
});

