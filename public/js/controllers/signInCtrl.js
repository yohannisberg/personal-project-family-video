angular.module('familyVideo').controller('signInCtrl', function($scope, mainService, $state){

  $scope.logIn=function(account){
    mainService.logInUser(account).then(function(response) {
      console.log('from login', response)
      // $scope.firstName = response.data[0].first_name;

      // alert('Hello '+firstName)
    })
  }

})
