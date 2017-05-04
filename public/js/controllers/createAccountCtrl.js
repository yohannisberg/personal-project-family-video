angular.module('familyVideo').controller('createAccountCtrl', function($scope, mainService){

  $scope.createUser=function(user){
    if (user.password === $scope.confirmPassword) {
      console.log('passwords match');
      mainService.createAccount(user)
    } else {
      alert('nope')
      // use sweet alerts
      // http://t4t5.github.io/sweetalert/
      // or use a directive
      //  http://stackoverflow.com/questions/12581439/how-to-add-custom-validation-to-an-angularjs-form
    }
    // user.first_name = '';

  }
})
