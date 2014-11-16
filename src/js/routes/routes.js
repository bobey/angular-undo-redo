/** @ngInject */
function mainRoutesConfiguration ($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/users');

    $stateProvider
        .state('userlist', {
            url: '/users',
            templateUrl: 'partials/users/list.html',
            controller: 'UserListController as listCtrl',
            resolve: UserListController.resolve
        });
}

angular
    .module('undo.routes')
    .config(mainRoutesConfiguration);
