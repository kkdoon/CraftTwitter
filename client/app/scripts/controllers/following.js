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
    Restangular.all('/user/kk/follow').getList().then(function(result) {
      $scope.userIDs = result;
    });
    Restangular.all('/users?user=kk').getList().then(function(result) {
      $scope.nonFollowUserIDs = result;
    });

    $("#nonFollowList").on("click","button",function(){
      var userID = this.id;
      Restangular.all('/user/kk/follow?user=' + userID).post().then(function() {
        Restangular.all('/user/kk/follow').getList().then(function(result) {
            $scope.userIDs = result;
          });
        }, function(err) {
          alert("Unable to follow user: " + err.data.msg);
        });
      });
  });
