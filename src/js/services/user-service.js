/** @ngInject */
function UserServiceFactory (DummyStoreService) {

    /* jshint -W004 */
    var UserService = {};

    UserService.getUsers = function () {

        return DummyStoreService.getAll('users');
    };

    UserService.getUser = function (id) {

        return DummyStoreService.getOne('users', id);
    };

    UserService.save = function (user) {

        if (user.isNew()) {
            return DummyStoreService.add('users', user);
        } else {
            return DummyStoreService.update('users', user);
        }
    };

    UserService.remove = function (user) {

        return DummyStoreService.remove('users', user.id);
    };

    return UserService;
}

angular.module('undo.services')
    .factory('UserService', UserServiceFactory);
