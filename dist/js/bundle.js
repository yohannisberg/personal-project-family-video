'use strict';

angular.module('familyVideo', ['ui.router']).config(function ($stateProvider, $urlRouterProvider) {
  $stateProvider.state('home', {
    url: '/',
    templateUrl: "./views/home.html",
    controller: "homeCtrl"
  }).state('search', {
    url: '/search/',
    templateUrl: './views/search.html',
    controller: "searchCtrl"
  }).state('account', {
    url: '/account',
    templateUrl: './views/signIn.html',
    controller: "signInCtrl"
  }).state('createAccount', {
    url: '/account/create',
    templateUrl: './views/createAccount.html',
    controller: "createAccountCtrl"
  });

  $urlRouterProvider.otherwise('/');
});
'use strict';

angular.module('familyVideo').controller('mainCtrl', function ($scope, mainService) {

  $scope.searchBarClick = true;

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

  $scope.controlData = function (query) {
    mainService.getMovies(query).then(function (response) {
      $scope.forHtml = response;
    });
  };

  $scope.sessionCheck = function () {
    mainService.checkSessions().then(function (response) {
      console.log('this is the controller', response);
    });
  };

  $scope.sessionCheck();
});
'use strict';

angular.module('familyVideo').service('mainService', function ($http) {
  //This 'this' is the mainService- used within a function
  var self = this;

  this.checkSessions = function () {
    return $http.get('/api/sessionCheck').then(function (response) {
      // console.log('this is the sessionsCheck in the service', response)
      return response;
    });
  };

  this.getMovies = function (query) {
    return $http.get("https://api.themoviedb.org/3/search/movie?api_key=29cb68023cc937676c90dced0f11f657&query=" + query).then(function (response) {
      return response.data.results;
    });
  };

  this.createAccount = function (user) {
    console.log('this is the service', user);
    return $http({
      method: 'POST',
      url: '/api/account/create',
      data: {
        user: user
      }
    }).then(function (response) {
      self.checkSessions();
    });
  };

  this.addMovieToCart = function (movie) {
    return $http({
      method: 'POST',
      url: '/api/addMovie',
      data: {
        movie: movie
      }
    }).then(function (response) {});
  };
});
'use strict';

angular.module('familyVideo').controller('createAccountCtrl', function ($scope, mainService) {

  $scope.createUser = function (user) {
    if (user.password === $scope.confirmPassword) {
      console.log('passwords match');
      mainService.createAccount(user);
      user.first_name = '';
    } else {
      alert('nope');
      // use sweet alerts
      // http://t4t5.github.io/sweetalert/
      // or use a directive
      //  http://stackoverflow.com/questions/12581439/how-to-add-custom-validation-to-an-angularjs-form
    }
  };
});
'use strict';

angular.module('familyVideo').controller('homeCtrl', function ($scope, mainService) {});
//   $scope.myInterval = 3000;
//   $scope.slides = [
//     {
//       image: 'http://lorempixel.com/400/200/'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/food'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/sports'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/people'
//     }
//   ];
// })

// angular.module('familyVideo', ['ui.bootstrap']);
// function CarouselDemoCtrl($scope){
//   $scope.myInterval = 3000;
//   $scope.slides = [
//     {
//       image: 'http://lorempixel.com/400/200/'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/food'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/sports'
//     },
//     {
//       image: 'http://lorempixel.com/400/200/people'
//     }
//   ];
// }
'use strict';

angular.module('familyVideo').controller('searchCtrl', function ($scope, mainService) {

  $scope.addToCart = function (movieObject) {
    mainService.addMovieToCart(movieObject);
  };

  // mainService.testing=$scope.searchQuery;

  // $scope.controlData();

});
'use strict';

angular.module('familyVideo').controller('signInCtrl', function ($scope, mainService) {});
//# sourceMappingURL=bundle.js.map
