angular.module('familyVideo').controller('signInCtrl', function($scope, mainService, $state){

  $scope.logIn=function(account){
    mainService.logInUser(account).then(function(response) {
      $scope.account = {};

      alert('Hello')
    })
  }

})
