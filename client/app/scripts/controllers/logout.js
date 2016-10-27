'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:LogoutCtrl
 * @description
 * # LogoutCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('LogoutCtrl', function ($scope, Restangular, $cookies, $location) {
    $cookies.userID = null;
    $location.path('/sign').replace();
    $("#logoutToggle").text("");
    $("#loginID").toggle();
  });
