/*
* IoT Hub Raspberry Pi NodeJS - Microsoft Sample Code - Copyright (c) 2017 - Licensed MIT
*/
'use strict';

const Bme280Sensor = require('./bme280Sensor.js');
const SimulatedSensor = require('./simulatedSensor.js');
var axios = require('axios');
const moment = require('moment');

function MessageProcessor(option) {
  option = Object.assign({
    deviceId: '[Unknown device] node',
    temperatureAlert: 30
  }, option);
  this.sensor = option.simulatedData ? new SimulatedSensor() : new Bme280Sensor(option.i2cOption);
  this.deviceId = option.deviceId;
  this.temperatureAlert = option.temperatureAlert
  this.sensor.init(() => {
    this.inited = true;
  });
}

MessageProcessor.prototype.getMessage = function (messageId, cb) {
  if (!this.inited) { return; }
  this.sensor.read((err, data) => {
    if (err) {
      console.log('[Sensor] Read data failed: ' + err.message);
      return;
    }

    var x={
      temperature: data.temperature,
      humidity: data.humidity,
      corriente: data.corriente,
      voltaje: data.voltaje
    };
      defobjpost(x);

    cb(JSON.stringify({
      messageId: messageId,
      deviceId: this.deviceId,
      temperature: data.temperature,
      humidity: data.humidity,
      corriente: data.corriente,
      voltaje: data.voltaje
      }
    ), data.temperature > this.temperatureAlert);
  });
}

function defobjpost (x){
  try{
  var date = date || Date.now();
  Object.assign(x, { date: moment(date).format('YYYY-MM-DD') });
  Object.assign(x, {time: moment(date).format('hh:mm:ss') });

  }

  catch (err) {
    console.log(x);
    console.error(err);
  }



  var temperatura= {
    id: '1',
    fecha:x.date,
    hora:x.time,
    variable: 'Temperatura',
    valor: x.temperature,
    unidad: 'C',
  };
  var humedad= {
    id: '1',
    fecha:x.date,
    hora:x.time,
    variable: 'Humedad',
    valor: x.humidity,
    unidad: '%',
  };
  var voltaje= {
    id: '1',
    fecha:x.date,
    hora:x.time,
    variable: 'Voltaje',
    valor: x.voltaje,
    unidad: 'V',
  }
  var corriente= {
    id: '1',
    fecha:x.date,
    hora:x.time,
    variable: 'Corriente',
    valor: x.corriente,
    unidad: 'A',
  }

ejecutpost(temperatura);
ejecutpost(humedad);
ejecutpost(corriente);
ejecutpost(voltaje);
}



function ejecutpost(x){
  axios.post('http://labsolar.azurewebsites.net/index2.php/api/sensores/add', x)
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

}






module.exports = MessageProcessor;
