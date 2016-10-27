'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:FollowingCtrl
 * @description
 * # FollowingCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('FollowingCtrl', function ($scope, Restangular, $cookies) {
    var userId = $cookies.userID;
    Restangular.all('/user/' + userId + '/follow').getList().then(function(result) {
      $scope.userIDs = result;
    });
    Restangular.all('/users?user=' + userId).getList().then(function(result) {
      $scope.nonFollowUserIDs = result;
    });

    $("#nonFollowList").on("click","button",function(){
      var followerID = this.id;
      Restangular.all('/user/' + userId + '/follow?user=' + followerID).post().then(function() {
        Restangular.all('/user/' + userId + '/follow').getList().then(function(result) {
            $scope.userIDs = result;
          });
        }, function(err) {
          alert("Unable to follow user: " + err.data.msg);
        });
      });
  });
