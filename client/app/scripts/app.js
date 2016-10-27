'use strict';

/**
 * @ngdoc overview
 * @name clientApp
 * @description
 * # clientApp
 *
 * Main module of the application.
 */
angular
  .module('clientApp', [
    'ngCookies',
    'ngRoute',
    'restangular'
  ])
  .config(function ($routeProvider, RestangularProvider) {
    RestangularProvider.setBaseUrl('http://localhost:8080/v1');

    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'main',
        loginRequired: true
      })
      .when('/sign', {
        templateUrl: 'views/sign.html',
        controller: 'SignCtrl',
        controllerAs: 'sign'
      })
      .when('/following', {
        templateUrl: 'views/following.html',
        controller: 'FollowingCtrl',
        controllerAs: 'following',
        loginRequired: true
      })
      .when('/feed', {
        templateUrl: 'views/feed.html',
        controller: 'FeedCtrl',
        controllerAs: 'feed',
        loginRequired: true
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'RegisterCtrl',
        controllerAs: 'register'
      })
      .when('/logout', {
        templateUrl: 'views/logout.html',
        controller: 'LogoutCtrl',
        controllerAs: 'logout'
      })
      .otherwise({
        redirectTo: '/sign'
      });
  }).run(function ($location, $rootScope, $cookies) {
  var postLogInRoute;
  $rootScope.$on('$routeChangeStart', function (event, nextRoute, currentRoute) {
    //if login required and you're logged out, capture the current path
    var cookieLogin = $cookies.userID;
    console.log(cookieLogin);
    if(cookieLogin == null){
      console.log("here");
    }
    if (nextRoute.loginRequired && cookieLogin == null) {
      postLogInRoute = $location.path();
      $location.path('/sign').replace();
    } else if (postLogInRoute) {
      //once logged in, redirect to the last route and reset it
      $location.path(postLogInRoute).replace();
      postLogInRoute = null;
    }
  })
});
//});
