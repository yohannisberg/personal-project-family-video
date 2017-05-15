angular.module('familyVideo').controller('accountCreatedCtrl', function($scope, mainService, $timeout, $state){
  $timeout(function() {
    $state.go('home');
  }, 5000);

  $timeout();

})
