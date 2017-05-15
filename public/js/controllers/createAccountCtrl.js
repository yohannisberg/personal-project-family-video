angular.module('familyVideo').controller('createAccountCtrl', function($scope, mainService, $state){

  $scope.createUser=function(user){
    if (user.password === $scope.confirmPassword) {
      mainService.createAccount(user)
      $scope.user={};
      $scope.confirmPassword="";
      $state.go('accountCreated')
    } else {
      console.log('nope')
      // use sweet alerts
      // http://t4t5.github.io/sweetalert/
      // or use a directive
      //  http://stackoverflow.com/questions/12581439/how-to-add-custom-validation-to-an-angularjs-form
    }
    // user.first_name = '';

  }

})
