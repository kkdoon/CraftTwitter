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
    var baseUrl = Restangular.all('user/kk/post');
    baseUrl.getList().then(function(result) {
      $scope.tweets = result;
    });
    $("#postTweet").on("click", function() {
      var tweetMsg = $("#tweetMsg").val();
      if(tweetMsg == null || tweetMsg.length == 0){
        alert("Cannot post empty tweet!");
      }else{
        var msgBody = {msg: tweetMsg};
        baseUrl.post(msgBody).then(function() {
          baseUrl.getList().then(function(result) {
            $scope.tweets = result;
            $("#tweetMsg").val("");
          });
        }, function(err) {
          alert("Unable to post tweet: " + err.data.msg);
        });
      }
    });
  });
