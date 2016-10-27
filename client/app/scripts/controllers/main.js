'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('MainCtrl', function ($scope, Restangular) {
    Restangular.all('user/kk/post').getList().then(function(result) {
      $scope.tweets = result;
    });
  });
