'use strict';

/**
 * @ngdoc function
 * @name clientApp.controller:RegisterCtrl
 * @description
 * # RegisterCtrl
 * Controller of the clientApp
 */
angular.module('clientApp')
  .controller('RegisterCtrl', function () {
    $("#nonFollowList").on("click","button",function(){
      Restangular.all('signup').post({username: $("#username") ,password: $("#password")}).then(function(result) {
        alert(result);
      });
    });
  });
