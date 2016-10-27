'use strict';

describe('Controller: FollowingCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var FollowingCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FollowingCtrl = $controller('FollowingCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FollowingCtrl.awesomeThings.length).toBe(3);
  });
});
