angular.module('familyVideo').controller('checkoutCtrl', function($scope, mainService, $state){
 $scope.checkout=function(address){
   console.log('from checkout ctrl', address)
   mainService.getAddress(address);
   if(address){
     $state.go('verify');
   }
}
})
