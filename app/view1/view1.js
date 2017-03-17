'use strict';

angular.module('myApp.view1', ['ngRoute','googlechart','angular-ladda', 'underscore', 'ngMaterial'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/showTemp.html',
    controller: 'View1Ctrl'
  });

}])

.controller('View1Ctrl',['$http', '$scope','$timeout','BaliOffice','YogyakartaOffice','BandungOffice','BaliLight','_'
,function($http, $scope,$timeout,BaliOffice,YogyakartaOffice,BandungOffice,BaliLight, _) {

    $scope.baliLampStatus1    = false;
    $scope.baliLampStatus2    = false;
    $scope.jogjaLampStatus1   = false;
    $scope.jogjaLampStatus2   = false;
    $scope.bandungLampStatus1 = false;
    $scope.bandungLampStatus2 = false;

  $scope.message = 'false';

  $scope.onChange = function(cbState) {
    $scope.message = cbState;
  };

    function getBaliData($scope, baliService, callback) {
        var baliData = baliService.getData();

        baliData.then(function(result) {  
            var res = JSON.parse(result.body);
            var newChart = [];
            res.Items.forEach(function(bdata){
              // console.log('WWZ1:',JSON.stringify(bdata.id));
                var chartData = [];

                var stamp = new Date(bdata.timestamp);
                chartData.push(stamp.getHours() +":"+stamp.getMinutes()+":"+stamp.getSeconds());
                
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.humidity);
                chartData.push(bdata.payload.humidity);
                newChart.push(chartData);
              });      
                $scope.BaliChart.data = newChart;
                $scope.BaliChart.data.splice(16, $scope.BaliChart.data.length-15);
                $scope.BaliChart.data.splice(0, 1, getChartHeader()); 
                $scope.baliLoading = false;
        }).then(function() {
          
          if (typeof callback === 'function') callback();
        });
    }

    function getJogjaData($scope, service, callback) {
        var jogjaData = service.getData();

        jogjaData.then(function(result) {  
            var newChart = [];
            result.Items.forEach(function(bdata){
                var chartData = [];

                var stamp = new Date(bdata.timestamp);
                chartData.push(stamp.getHours() +":"+stamp.getMinutes()+":"+stamp.getSeconds());
                
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.humidity);
                chartData.push(bdata.payload.humidity);
                newChart.push(chartData);
              });           
                $scope.YogyaChart.data = newChart;
                $scope.YogyaChart.data.splice(16, $scope.YogyaChart.data.length-15);
                $scope.YogyaChart.data.splice(0, 1, getChartHeader()); 
                $scope.yogyaLoading = false;
        }).then(function() {
          if (typeof callback === 'function') callback();
        });
    } 

    function getBandungData($scope, service, callback) {
      debugger
        var bandungData = service.getData();

        bandungData.then(function(result) {  
            var newChart = [];
            result.Items.forEach(function(bdata){
                var chartData = [];

                var stamp = new Date(bdata.timestamp);
                chartData.push(stamp.getHours() +":"+stamp.getMinutes()+":"+stamp.getSeconds());
                
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.humidity);
                chartData.push(bdata.payload.humidity);
                newChart.push(chartData);
              });
                $scope.BandungChart.data = newChart;
                $scope.BandungChart.data.splice(16, $scope.BandungChart.data.length-15);
                $scope.BandungChart.data.splice(0, 1, getChartHeader()); 
                $scope.bandungLoading = false;
        }).then(function() {
          if (typeof callback === 'function') callback();
        });
    }

    function getChartHeader() {
      return [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }];
    }

    // *********************************
    // Load Bali Office Data
    $scope.baliLoading = true;
    $scope.loadBaliChart = function () {
        $scope.BaliChart = {};
        $scope.BaliChart.type = 'LineChart';
        $scope.BaliChart.data = [
            [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
        ];

        
        // Function to replicate setInterval using $timeout service.
        $scope.intervalBaliChart = function(){
          $timeout(function() {
            getBaliData($scope,BaliOffice, function () {
              $scope.intervalBaliChart();
            });
          }, 2000)
        };

        $scope.intervalBaliChart();

        $scope.BaliChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'right' },
          curveType: 'function',
          title: 'Mitrais - Bali Office',
          hAxis: {
            direction: -1
          },
          series: {
            0: { color: '#6288d5' },
            1: { color: '#dc3912' }
          },
          backgroundColor: { fill:'transparent' }
        };
    };
    // $scope.loadBaliChart(40);
    $scope.loadBaliChart();
    // *********************************
    // Load Yogya Office Data
    $scope.yogyaLoading = true;
    $scope.loadYogyaChart = function () {
        $scope.YogyaChart = {};
        $scope.YogyaChart.type = 'LineChart';
        $scope.YogyaChart.data = [
            [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
        ];


        $scope.intervalJogjaChart = function(){
          $timeout(function() {
            getJogjaData($scope, YogyakartaOffice, function () {
              $scope.intervalJogjaChart();
            });
          }, 2000);
        };

        $scope.intervalJogjaChart();

        $scope.YogyaChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'right' },
          curveType: 'function',
          title: 'Mitrais - Yogyakarta Office',
          hAxis: {
            direction: -1
          },
          series: {
            0: { color: '#6288d5' },
            1: { color: '#dc3912' }
          },
          backgroundColor: { fill:'transparent' }
        };
    };

    $scope.loadYogyaChart();

    // *********************************
    // Load Bandung Office Data
    $scope.bandungLoading = true;
    $scope.loadBandungChart = function () {
        $scope.BandungChart = {};
        $scope.BandungChart.type = 'LineChart';
        $scope.BandungChart.data = [
            [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
        ];



        $scope.intervalBandungChart = function(){
          $timeout(function() {
            getBandungData($scope, BandungOffice, function () {
              $scope.intervalBandungChart();
            });
          }, 2000);
        };

        $scope.intervalBandungChart();

        $scope.BandungChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'right' },
          curveType: 'function',
          title: 'Mitrais - Bandung Office',
          hAxis: {
            direction: -1
          },
          series: {
            0: { color: '#6288d5' },
            1: { color: '#dc3912' }
          },
          backgroundColor: { fill:'transparent' }
        };
    };

    $scope.loadBandungChart();


    function sendMessage(deviceLoc,relNo,sentstate) {
      var data = {
        "deviceId" : deviceLoc,
        "relay" : relNo,
        "state" : sentstate
      };
      $http({
        method: 'POST',
        url: 'https://gpiryeyzbf.execute-api.ap-southeast-2.amazonaws.com/dev/lamp',
        data: data,
      });
    };
    $scope.baliRelay1 = function(devName,relayNum) {
      var sentstate;
      if ($scope.baliLampStatus1 == false) {
          $scope.baliLampStatus1 = true;
          sentstate = "ON"
      }else{
          $scope.baliLampStatus1 = false;
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.baliRelay2 = function(devName,relayNum) {
      var sentstate;
      if ($scope.baliLampStatus2 == false) {
          $scope.baliLampStatus2 = true;
          sentstate = "ON"
      }else{
          $scope.baliLampStatus2 = false;
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.jogjaRelay1 = function(devName,relayNum) {
      var sentstate;
      if ($scope.jogjaLampStatus1 == false) {
          $scope.jogjaLampStatus1 = true
          sentstate = "ON"
      }else{
          $scope.jogjaLampStatus1 = false;
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.jogjaRelay2 = function(devName,relayNum) {
      var sentstate;
      if ($scope.jogjaLampStatus2 == false) {
          $scope.jogjaLampStatus2 = true;
          sentstate = "ON"
      }else{
          $scope.jogjaLampStatus2 = false;
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.bandungRelay1 = function(devName,relayNum) {
      var sentstate;
      if ($scope.bandungLampStatus1 == false) {
          $scope.bandungLampStatus1 = true;
          sentstate = "ON"
      }else{
          $scope.bandungLampStatus1 = false;
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.bandungRelay2 = function(devName,relayNum) {
      var sentstate;
      if ($scope.bandungLampStatus2 == false) {
          $scope.bandungLampStatus2 = true;
          sentstate = "ON"
      }else{
          $scope.bandungLampStatus2 = false;
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }

    function getBaliLightData($scope, baliLightService, callback) {
        var BaliLightData = baliLightService.getData();
        BaliLightData.then(function(result) {  
            result.Items.forEach(function(jdata){
              jdata.lightpayload.forEach(function(value){
                if (value.lightState == 1) {
                  $scope.baliLightStatus = true;
                }else{
                  $scope.baliLightStatus = false;
                }
              })
           });
        }).then(function () {
          if (typeof callback === "function") callback();
        });
    } 

    // Function to replicate setInterval using $timeout service.
    $scope.refreshbalilamp = function(){
      $timeout(function() {
        getBaliLightData($scope, BaliLight, function () {
          $scope.refreshbalilamp();
        });
      }, 3000)
    };

    $scope.refreshbalilamp();

}]);