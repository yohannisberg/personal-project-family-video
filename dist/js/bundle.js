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

angular.module('familyVideo').controller('mainCtrl', function ($scope, mainService, $rootScope) {

  $scope.searchBarClick = true;
  $scope.shoppingCart = true;
  $scope.emptyCart = true;

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
      var sessId = response.data;
      console.log(sessId);
    });
  };

  $scope.sessionCheck();

  $scope.notSignedIn = true;

  // $scope.findAccount=function(){
  //   console.log('hi', $scope.sessId);
  //   mainService.findAccount($scope.sessId).then(function(response){
  //     console.log('JOFJOF', response)
  //   })
  // }
  //
  // $scope.findAccount();

  $rootScope.$on('user', function (response) {
    console.log(response);
    $scope.user = response;
  });

  $scope.findAccount = function () {
    mainService.findAccount().then(function (response) {
      console.log('!!!This from the controller', response);
      $scope.user = response.data;
    });
  };

  $scope.findAccount();

  $scope.showCart = function () {
    mainService.showCart().then(function (response) {
      if (response.data === 'NotSignedIn') {
        $scope.emptyCart = false;
        $scope.shoppingCart = true;
        $scope.nothing = 'Nothing in here!';
      } else {
        $scope.shoppingCart = false;
        $scope.emptyCart = true;
        $scope.cartItems = response.data;
      }
    });
  };

  $scope.deleteItem = function (movie) {
    mainService.deleteItem(movie).then(function (response) {
      if (response) {
        $scope.showCart();
      }
    });
  };
});
'use strict';

angular.module('familyVideo').service('mainService', function ($http, $rootScope) {
  //This 'this' is the mainService- used within a function
  var self = this;

  this.checkSessions = function () {
    return $http.get('/api/sessionCheck').then(function (response) {
      console.log('this is the sessionsCheck in the service', response);
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

  // this.logInUser=function(account){
  //   // console.log('this is the service', user)
  //   return $http({
  //     method: 'POST',
  //     url: '/api/signIn',
  //     data: {
  //       account: account
  //     }
  //   }).then(function(response){
  //     return response;
  //   })
  // }

  this.logInUser = function (account) {
    // console.log('thisbetter work',account.email, account.password)
    return $http({
      method: 'POST',
      url: '/api/signIn',
      data: account
    }).then(function (response) {
      console.log('IF THIS WORKS YOURE GOOD TO GO', response);
      $rootScope.$emit('user', response.data);
      return response;
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

  this.deleteItem = function (movie) {
    return $http({
      method: 'POST',
      url: '/api/deleteMovie',
      data: {
        movie: movie
      }
    }).then(function (response) {
      return response;
    });
  };

  // this.findAccount=function(sessionId){
  //   return $http({
  //     method: 'POST',
  //     url: '/api/findAccount',
  //     data: {
  //       id:sessionId
  //     }
  //   }).then(function(response){
  //
  //   })
  // }

  this.findAccount = function () {
    return $http.get('/api/findAccount').then(function (response) {
      $rootScope.$emit('user', response.data);
      return response;
    });
  };

  this.showCart = function () {
    return $http.get('/api/getCart').then(function (response) {
      console.log('does this work or what', response);
      return response;
    });
  };
});
'use strict';

angular.module('familyVideo').controller('createAccountCtrl', function ($scope, mainService) {

  $scope.createUser = function (user) {
    if (user.password === $scope.confirmPassword) {
      console.log('passwords match');
      mainService.createAccount(user);
    } else {
      alert('nope');
      // use sweet alerts
      // http://t4t5.github.io/sweetalert/
      // or use a directive
      //  http://stackoverflow.com/questions/12581439/how-to-add-custom-validation-to-an-angularjs-form
    }
    // user.first_name = '';
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

angular.module('familyVideo').controller('signInCtrl', function ($scope, mainService, $state) {

  $scope.logIn = function (account) {
    mainService.logInUser(account).then(function (response) {
      console.log('from login', response);
      // $scope.firstName = response.data[0].first_name;

      // alert('Hello '+firstName)
    });
  };
});
//# sourceMappingURL=bundle.js.map
