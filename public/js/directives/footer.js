angular.module('familyVideo')
.directive('footer', function() {

  return {
    restrict: 'E',
    templateUrl: './views/footer.html',
    link: function(scope){
    },
    controller: 'footerCtrl'
  }

})
