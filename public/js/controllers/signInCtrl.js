angular.module('familyVideo').controller('signInCtrl', function($scope, mainService, $state){

  $scope.logIn=function(account){
    mainService.logInUser(account).then(function(response) {
      console.log('from login', response)
      $scope.account = {};

      // alert('Hello '+firstName)
    })
  }

})
