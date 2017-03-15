'use strict';

angular.module('myApp.view1', ['ngRoute','googlechart','angular-ladda'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/showTemp.html',
    controller: 'View1Ctrl'
  });

}])

.controller('View1Ctrl',['$http', '$scope','$timeout','BaliOffice','YogyakartaOffice','BandungOffice','BaliLight'
,function($http, $scope,$timeout,BaliOffice,YogyakartaOffice,BandungOffice,BaliLight) {

    $scope.baliLampStatus1 = "Turn On Relay 1";
    $scope.baliLampStatus2 = "Turn On Relay 2";
    $scope.jogjaLampStatus1 = "Turn On Relay 1";
    $scope.jogjaLampStatus2 = "Turn On Relay 2";
    $scope.bandungLampStatus1 = "Turn On Relay 1";
    $scope.bandungLampStatus2 = "Turn On Relay 2";

    function getBaliData($scope, baliService) {
        var baliData = baliService.getData();

        baliData.then(function(result) {  
            result.body.forEach(function(bdata){
              // console.log('WWZ1:',JSON.stringify(bdata.id));
                var chartData = [];
                chartData.push(bdata.id);
                
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.temp);
                chartData.push(bdata.payload.humidity);
                chartData.push(bdata.payload.humidity);
                $scope.BaliChart.data.push(chartData);
                $scope.BaliChart.data.sort(function (a, b) {
                    if (a[0] < b[0]) return  1;
                    if (a[0] > b[0]) return -1;
                    if (a[2] > b[2]) return  1;
                    if (a[2] < b[2]) return -1;
                    return 0;
                });                
                $scope.BaliChart.data.splice(31,$scope.BaliChart.data.length-30);
                $scope.baliLoading = false;
              });
              // console.log('FullData:',$scope.BaliChart.data);
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
        $scope.intervalFunction = function(){
          $timeout(function() {
            $scope.getData();
            $scope.intervalFunction();
          }, 1000)
        };
        
        // Function to replicate setInterval using $timeout service.
        $scope.intervalFunction = function(){
          $timeout(function() {
            getBaliData($scope,BaliOffice).then(function() {
              $scope.intervalFunction();
            });
          }, 1000)
        };

        $scope.intervalFunction();

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
      if ($scope.baliLampStatus1 == "Turn On Relay 1") {
          $scope.baliLampStatus1 = "Turn Off Relay 1"
          sentstate = "ON"
      }else{
          $scope.baliLampStatus1 = "Turn On Relay 1"
          sentstate = "OFF"
      };
      sendMessage (devName,relayNum,sentstate);
    }
    $scope.baliRelay2 = function(devName,relayNum) {
      var sentstate;
      if ($scope.baliLampStatus2 == "Turn On Relay 2") {
          $scope.baliLampStatus2 = "Turn Off Relay 2"
          sentstate = "ON"
      }else{
          $scope.baliLampStatus2 = "Turn On Relay 2"
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

    function getBaliLightData($scope, baliLightService) {
        var BaliLightData = baliLightService.getData();
        BaliLightData.then(function(result) {  
            result.Items.forEach(function(jdata){
              jdata.lightpayload.forEach(function(value){
                if (value.lightState == 1) {
                  $scope.baliLightStatus = 'Turned ON'
                }else{
                  $scope.baliLightStatus = 'Turned OFF'
                }
              })
           });
        });
    } 
    $scope.refreshbalilamp = function(){
      getBaliLightData ($scope,BaliLight);
    };
    $scope.refreshbalilamp();
}]);