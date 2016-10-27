'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:FollowingCtrl
 * @description
 * # FollowingCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('FollowingCtrl', function ($scope, Restangular) {
    Restangular.all('users').getList().then(function(result) {
      $scope.userIDs = result;
    });
  });
