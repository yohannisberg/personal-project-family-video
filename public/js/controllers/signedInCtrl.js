angular.module('familyVideo').controller('signedInCtrl', function($scope, mainService, $state, $timeout){

  $timeout(function() {
    $state.go('home');
  }, 5000);

  $timeout();

})
