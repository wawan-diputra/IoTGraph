'use strict';

angular.module('myApp.view1', ['ngRoute','googlechart','angular-ladda'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/showTemp.html',
    controller: 'View1Ctrl'
  });

}])

.controller('View1Ctrl',['$http', '$scope','$timeout','BaliOffice','YogyakartaOffice','BandungOffice'
,function($http, $scope,$timeout,BaliOffice,YogyakartaOffice,BandungOffice) {
    
    
    function getTempData($scope, myService, officeLoc) {
        var myDataPromise = myService.getData();
        console.log(JSON.stringify(myDataPromise));
        myDataPromise.then(function(result) {  
            result.Items.forEach(function(xdata){
            var chartData = [];
              chartData.push(xdata.timeStamp);
              chartData.push(xdata.payload.state.reported.temp);
              chartData.push(xdata.payload.state.reported.temp);
              chartData.push(xdata.payload.state.reported.humidity);
              chartData.push(xdata.payload.state.reported.humidity);
              switch (officeLoc){
                case 'Bali':
                  $scope.BaliChart.data.push(chartData);
                  $scope.BaliChart.data.splice(31,$scope.BaliChart.data.length-30);
                  $scope.baliLoading = false;
                  break;
                case 'Yogyakarta':
                  $scope.YogyaChart.data.push(chartData);
                  $scope.YogyaChart.data.splice(3,$scope.YogyaChart.data.length-3);
                  $scope.yogyaLoading = false;
                default:
                  $scope.BandungChart.data.push(chartData);
                  $scope.BandungChart.data.splice(15,$scope.BandungChart.data.length-15);
                  $scope.bandungLoading = false;     
              }
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

        getTempData($scope,BaliOffice,'Bali');

        $scope.BaliChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'bottom' },
          title: 'Mitrais - Bali Office',
        };
    };
    $scope.loadBaliChart(40);

    // *********************************
    // Load Yogya Office Data
    $scope.yogyaLoading = true;
    $scope.loadYogyaChart = function () {
        $scope.YogyaChart = {};
        $scope.YogyaChart.type = 'LineChart';
        $scope.YogyaChart.data = [
            [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
        ];
        
        getTempData($scope,YogyakartaOffice,'Yogyakarta');
        $scope.YogyaChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'bottom' },
          title: 'Mitrais - Yogyakarta Office',
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

        getTempData($scope,BandungOffice,'Bandung');

        $scope.BandungChart.options = {
          titleTextStyle: {
            fontName: 'Verdana',
            fontSize: 18,
            bold: true,
          },
          fontSize: 10,
          legend:{ position:'bottom' },
          title: 'Mitrais - Bandung Office',
        };
    };
    $scope.loadBandungChart(40);

  }]);