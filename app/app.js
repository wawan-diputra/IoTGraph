'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'ngRoute',
  'myApp.view1',
  'myApp.view2',
  'myApp.version',
  'googlechart',
  'angular-ladda'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/view1'});
}]).
factory('BaliOffice', function($http) {

    var getData = function() {

        // Angular $http() and then() both return promises themselves 
        return $http({method:"GET", url:"https://gpiryeyzbf.execute-api.ap-southeast-2.amazonaws.com/dev/list"}).then(function(result){

            // What we return here is the data that will be accessible 
            // to us after the promise resolves
            return result.data;
        });
    };
    return { getData: getData };
}).
factory('YogyakartaOffice', function($http) {

    var getData = function() {

        // Angular $http() and then() both return promises themselves 
        return $http({method:"GET", url:"https://xi287ra6g9.execute-api.ap-southeast-2.amazonaws.com/dev/list"}).then(function(result){

            // What we return here is the data that will be accessible 
            // to us after the promise resolves
            return result.data;
        });
    };
    return { getData: getData };
}).
factory('BandungOffice', function($http) {

    var getData = function() {

        // Angular $http() and then() both return promises themselves 
        return $http({method:"GET", url:"https://gpiryeyzbf.execute-api.ap-southeast-2.amazonaws.com/dev/list"}).then(function(result){

            // What we return here is the data that will be accessible 
            // to us after the promise resolves
            return result.data;
        });
    };
    return { getData: getData };
});