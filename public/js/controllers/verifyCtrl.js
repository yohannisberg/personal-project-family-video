angular.module('familyVideo').controller('verifyCtrl', function($scope, mainService, $state){

  $scope.aeCard=['opacityCard'];
  $scope.viCard=['opacityCard'];
  $scope.mcCard=['opacityCard'];
  $scope.diCard=['opacityCard'];

  $scope.discountCode=true;

  $scope.creditCardInfo=true;

  $scope.address=mainService.serviceAddress;

  $scope.creditCard=function(){
  }

  $scope.checkCreditCard=function(number){
    $scope.aeCard=['opacityCard'];
    $scope.viCard=['opacityCard'];
    $scope.mcCard=['opacityCard'];
    $scope.diCard=['opacityCard'];

    console.log(number)
  if(parseInt(number[0])===3){
    console.log('Visa')
    $scope.aeCard.pop('opacityCard')
  }
  else if(parseInt(number[0])===4){
    console.log('Visa')
    $scope.viCard.pop('opacityCard')
  }
  else if(parseInt(number[0])===5){
    console.log('Mastercard')
    $scope.mcCard.pop('opacityCard')
  }
  else if(parseInt(number[0])===6){
    console.log('Discover')
    $scope.diCard.pop('opacityCard')
  }
  }

  $scope.placeOrder=function(){
    // console.log('yo')
    // console.log(mainService.forVerify)
    mainService.findAccount().then(function(response){
      let theId=response.data.id;
      mainService.deleteCart(theId).then(function(response){
        if(response){
          console.log('wroekd')
        }
      })
    })
 }


})
