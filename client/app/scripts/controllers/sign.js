'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:SignCtrl
 * @description
 * # SignCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('SignCtrl', function ($scope, Restangular, $cookies, $location) {
    $("#loginForm").on("click","button",function(){
      Restangular.all('login').post({username: $("#username").val() ,password: $("#password").val()}).then(function(result) {
        $cookies.userID = result.userID;
        $("#logoutToggle").text(result.userID);
        $("#loginID").toggle();
        //$("#logoutToggle").show();
        $location.path('/').replace();
      }, function(err) {
        alert("Unable to login: " + err.data.msg);
      })
    });
  });
