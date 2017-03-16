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

    $scope.baliLampStatus1 = false;
    $scope.baliLampStatus2 = false;
    $scope.jogjaLampStatus1 = "Turn On Relay 1";
    $scope.jogjaLampStatus2 = "Turn On Relay 2";
    $scope.bandungLampStatus1 = "Turn On Relay 1";
    $scope.bandungLampStatus2 = "Turn On Relay 2";

  $scope.message = 'false';

  $scope.onChange = function(cbState) {
    $scope.message = cbState;
  };

    function getBaliData($scope, baliService, callback) {
        var baliData = baliService.getData();

        baliData.then(function(result) {  
            var res = JSON.parse(result.body);
            var newBaliChart = [];
            res.Items.forEach(function(bdata){
              // console.log('WWZ1:',JSON.stringify(bdata.id));
                var chartData = [];

                var stamp = new Date(bdata.timestamp);
                chartData.push(stamp.getHours() +":"+stamp.getMinutes()+":"+stamp.getSeconds());
                
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.humidity);
                chartData.push(bdata.payload.humidity);
                newBaliChart.push(chartData);
              });      
                $scope.BaliChart.data = newBaliChart;
                //var backup = $scope.BaliChart.data[0];
               // _.sortBy($scope.BaliChart.data, '0');  
               // $scope.BaliChart.data.reverse();   
                $scope.BaliChart.data.splice(16, $scope.BaliChart.data.length-15);
                $scope.BaliChart.data.splice(0, 1, getChartHeader()); 
                $scope.baliLoading = false;
              // console.log('FullData:',$scope.BaliChart.data);
        }).then(function() {
          
          if (typeof callback === 'function') callback();
        });
    }

    function getJogjaData($scope, jogjaService, officeLoc) {
        var jogjaData = jogjaService.getData();

        jogjaData.then(function(result) {  
          // console.log('WWZ1:',JSON.stringify(result));
            result.Items.forEach(function(jdata){
              
                var chartData = [];
                chartData.push(jdata.id);
                chartData.push(jdata.payload.temp);
                chartData.push(jdata.payload.temp);
                chartData.push(jdata.payload.humidity);
                chartData.push(jdata.payload.humidity);
                $scope.YogyaChart.data.push(chartData);
                $scope.YogyaChart.data.sort(function (a, b) {
                    if (a[0] < b[0]) return  1;
                    if (a[0] > b[0]) return -1;
                    if (a[2] > b[2]) return  1;
                    if (a[2] < b[2]) return -1;
                    return 0;
                });   
                $scope.YogyaChart.data.splice(31,$scope.YogyaChart.data.length-30);
                $scope.yogyaLoading = false;
              });
        });
    } 

    function getBandungData($scope, baliService) {
        var bandungData = baliService.getData();

        bandungData.then(function(result) {  
            result.Items.forEach(function(bgdata){
              // console.log('WWZ1:',JSON.stringify(bgdata.id));
                var chartData = [];
                chartData.push(bgdata.id);
                
                chartData.push(bgdata.payload.temp);
                chartData.push(bgdata.payload.temp);
                chartData.push(bgdata.payload.humidity);
                chartData.push(bgdata.payload.humidity);
                $scope.BandungChart.data.push(chartData);
                $scope.BandungChart.data.sort(function (a, b) {
                    if (a[0] < b[0]) return  1;
                    if (a[0] > b[0]) return -1;
                    if (a[2] > b[2]) return  1;
                    if (a[2] < b[2]) return -1;
                    return 0;
                });                
                $scope.BandungChart.data.splice(31,$scope.BaliChart.data.length-30);
                $scope.bandungLoading = false;
              });
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
          }, 5000)
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
          title: 'Mitrais - Bali Office',
          backgroundColor: { fill:'transparent' }
        };
    };
    // $scope.loadBaliChart(40);
    setInterval($scope.loadBaliChart(), 100);
    // *********************************
    // Load Yogya Office Data
    $scope.yogyaLoading = true;
    $scope.loadYogyaChart = function () {
        $scope.YogyaChart = {};
        $scope.YogyaChart.type = 'LineChart';
        $scope.YogyaChart.data = [
            [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
        ];
        
        getJogjaData($scope,YogyakartaOffice,'Yogyakarta');
        $scope.YogyaChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'right' },
          title: 'Mitrais - Yogyakarta Office',
          backgroundColor: { fill:'transparent' }
        };
    };
    $scope.loadYogyaChart(40);

    // *********************************
    // Load Bandung Office Data
    $scope.bandungLoading = true;
    $scope.loadBandungChart = function () {
        $scope.BandungChart = {};
        $scope.BandungChart.type = 'LineChart';
        $scope.BandungChart.data = [
            [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
        ];

        getBandungData($scope,BandungOffice,'Bandung');

        $scope.BandungChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'right' },
          title: 'Mitrais - Bandung Office',
          backgroundColor: { fill:'transparent' }
        };
    };
    $scope.loadBandungChart(40);


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
 $scope.onChange = function() {
    debugger
  };
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
      if ($scope.jogjaLampStatus1 == "Turn On Relay 1") {
          $scope.jogjaLampStatus1 = "Turn Off Relay 1"
          sentstate = "ON"
      }else{
          $scope.jogjaLampStatus1 = "Turn On Relay 1"
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.jogjaRelay2 = function(devName,relayNum) {
      var sentstate;
      if ($scope.jogjaLampStatus2 == "Turn On Relay 2") {
          $scope.jogjaLampStatus2 = "Turn Off Relay 2"
          sentstate = "ON"
      }else{
          $scope.jogjaLampStatus2 = "Turn On Relay 2"
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.bandungRelay1 = function(devName,relayNum) {
      var sentstate;
      if ($scope.bandungLampStatus1 == "Turn On Relay 1") {
          $scope.bandungLampStatus1 = "Turn Off Relay 1"
          sentstate = "ON"
      }else{
          $scope.bandungLampStatus1 = "Turn On Relay 1"
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.bandungRelay2 = function(devName,relayNum) {
      var sentstate;
      if ($scope.bandungLampStatus2 == "Turn On Relay 2") {
          $scope.bandungLampStatus2 = "Turn Off Relay 2"
          sentstate = "ON"
      }else{
          $scope.bandungLampStatus2 = "Turn On Relay 2"
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