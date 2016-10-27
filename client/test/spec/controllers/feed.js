'use strict';

describe('Controller: FeedCtrl', function () {

  // load the controller's module
  beforeEach(module('clientApp'));

  var FeedCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    FeedCtrl = $controller('FeedCtrl', {
      $scope: scope
      // place here mocked dependencies
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(FeedCtrl.awesomeThings.length).toBe(3);
  });
});
