angular.module('familyVideo', ['ui.router'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider
    .state('home',{
            url:'/',
            templateUrl: "../views/home.html",
            controller: "homeCtrl"
        });


    $urlRouterProvider
        .otherwise('/');
});
