angular.module('familyVideo')
.directive('navBar', function() {

  return {
    restrict: 'E',
    templateUrl: './views/navBar.html',
    link: function(scope){
    },
    controller: 'mainCtrl'
  }

})
