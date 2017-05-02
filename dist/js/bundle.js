'use strict';

angular.module('familyVideo', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: "../views/home.html",
    controller: "homeCtrl"
  }).state('search', {
    url: '/search',
    templateUrl: '../views/search.html',
    controller: "searchCtrl"
  });

  $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('familyVideo').controller('mainCtrl', function ($scope) {

  $scope.searchBarClick = true;

  $scope.searchBar = function () {
    if ($scope.searchBarClick) {
      // $window.onclick = null;
      $scope.searchBarClick = false;
    } else {
      $scope.searchBarClick = true;
    }
  };

  $scope.openNav = function () {
    // document.getElementById("mySidenav").style.width = "calc(100%-54px)";
    document.getElementById("mySidenav").style.width = "93%";
    // document.getElementById("main").style.marginLeft = "calc(100%-54px)";
    document.getElementById("main").style.marginLeft = "93%";
  };

  $scope.closeNav = function () {
    document.getElementById("mySidenav").style.width = "0px";
    document.getElementById("main").style.marginLeft = "0px";
  };
});
'use strict';

angular.module('familyVideo').service('mainService', function ($http) {

  this.getMovies = function () {
    return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query=" + this.testing).then(function (response) {
      return response.data.results;
    });
  };

  // this.getMovies=function(){
  //   return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query="+$scope.searchQuery).then(function(response){
  //     return response.data.results;
  //   })
  // }
});
'use strict';

angular.module('familyVideo').controller('homeCtrl', function ($scope, mainService) {});
'use strict';

angular.module('familyVideo').controller('searchCtrl', function ($scope, mainService) {

  $scope.testing = 'hi';

  mainService.testing = $scope.searchQuery;

  $scope.controlData = function () {
    mainService.getMovies().then(function (response) {
      $scope.forHtml = response;
    });
  };

  $scope.controlData();
});
//# sourceMappingURL=bundle.js.map
