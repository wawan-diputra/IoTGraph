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
              console.log('FullData:',$scope.BaliChart.data);
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
    // *********************************
    // Load Bali Office Data
    $scope.baliLoading = true;
    $scope.loadBaliChart = function () {
        $scope.BaliChart = {};
        $scope.BaliChart.type = 'LineChart';
        $scope.BaliChart.data = [
            [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
        ];

        getBaliData($scope,BaliOffice);

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

    // // *********************************
    // // Load Bandung Office Data
    // $scope.bandungLoading = true;
    // $scope.loadBandungChart = function () {
    //     $scope.BandungChart = {};
    //     $scope.BandungChart.type = 'ColumnChart';
    //     $scope.BandungChart.data = [
    //         [ 'Date', 'Temperature',{ role: 'Temperature' }, 'Humidity',{ role: 'Humidity' }]
    //     ];

    //     getTempData($scope,BandungOffice,'Bandung');

    //     $scope.BandungChart.options = {
    //       titleTextStyle: {
    //         fontName: 'Verdana',
    //         fontSize: 18,
    //         bold: true,
    //       },
    //       fontSize: 10,
    //       legend:{ position:'right' },
    //       title: 'Mitrais - Bandung Office',
    //     };
    // };
    // $scope.loadBandungChart(40);

  }]);