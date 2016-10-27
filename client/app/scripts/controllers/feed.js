'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:FeedCtrl
 * @description
 * # FeedCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('FeedCtrl', function ($scope, Restangular, $cookies) {
    var userId = $cookies.userID;
    $scope.tweets = Restangular.all('user/' + userId + '/feed').getList().$object;
  });
