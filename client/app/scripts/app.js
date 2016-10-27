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
        controllerAs: 'main'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
        controllerAs: 'about'
      })
      .when('/home', {
        templateUrl: 'views/home.html',
        controller: 'HomeCtrl',
        controllerAs: 'home'
      })
      .when('/posts', {
        templateUrl: 'views/posts.html',
        controller: 'PostsCtrl',
        controllerAs: 'posts'
      })
      .when('/sign', {
        templateUrl: 'views/sign.html',
        controller: 'SignCtrl',
        controllerAs: 'sign'
      })
      .when('/following', {
        templateUrl: 'views/following.html',
        controller: 'FollowingCtrl',
        controllerAs: 'following'
      })
      .when('/feed', {
        templateUrl: 'views/feed.html',
        controller: 'FeedCtrl',
        controllerAs: 'feed'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
