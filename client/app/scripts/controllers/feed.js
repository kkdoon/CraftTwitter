'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:FeedCtrl
 * @description
 * # FeedCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('FeedCtrl', function ($scope, Restangular) {
    Restangular.all('user/kk/feed').getList().then(function(result) {
      $scope.tweets = result;
    });
  });
