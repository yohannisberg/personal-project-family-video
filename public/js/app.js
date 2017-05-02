angular.module('familyVideo', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home',{
            url:'/',
            templateUrl: "../views/home.html",
            controller: "homeCtrl"
        })
    .state('search', {
          url: '/search',
          templateUrl: '../views/search.html',
          controller: "searchCtrl"
        });


    $urlRouterProvider
        .otherwise('/');
});
