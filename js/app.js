;(function( window, undefined ){angular.module('undo.routes', ['ui.router.compat']);
angular.module('undo.controllers', []);
angular.module('undo.models', []);
angular.module('undo.services', []);
angular.module('undo.commands', []);


angular.module('undo', [

    'undo.routes',
    'undo.controllers',
    'undo.models',
    'undo.services',
    'undo.commands'

]).config(['$provide', function($provide) {
    $provide.decorator('$state', ['$delegate', function($delegate) {
        $delegate.reload = function() {
            this.transitionTo(this.current, this.$current.params, { reload: true, inherit: true, notify: true });
        };
        return $delegate;
    }]);
}]);

/** @ngInject */
function UserCreateCommand (UserService) {

    /* jshint -W004 */
    function UserCreateCommand (userToCreate) {
        this.userToCreate = userToCreate;
        this.userCreated = null;
    }

    UserCreateCommand.prototype = {
        execute: function() {

            return UserService.save(this.userToCreate).then(function(userCreated) {

                this.userCreated = userCreated;

                return userCreated;
            }.bind(this));

        },

        reverse: function() {

            return UserService.remove(this.userCreated).then(function() {
                this.userCreated = null;
            }.bind(this));
        }
    };

    return UserCreateCommand;
}
UserCreateCommand.$inject = ['UserService'];

angular
    .module('undo.commands')
    .factory('UserCreateCommand', UserCreateCommand);

/** @ngInject */
function UserDeleteCommand (UserCreateCommand) {

    /* jshint -W004 */
    var UserDeleteCommand = function UserDeleteCommand (userToDelete) {

        var userToCreate = angular.copy(userToDelete);
        userToCreate.id = null;

        this.createCommand = new UserCreateCommand(userToCreate);
        this.createCommand.userCreated = userToDelete;
    };

    UserDeleteCommand.prototype = {
        execute: function() {
            return this.createCommand.reverse();
        },

        reverse: function() {
            return this.createCommand.execute();
        }
    };

    return UserDeleteCommand;
}
UserDeleteCommand.$inject = ['UserCreateCommand'];

angular
    .module('undo.commands')
    .factory('UserDeleteCommand', UserDeleteCommand);

/** @ngInject */
function UserListController($state, users, User, UserCreateCommand, UserDeleteCommand, UndoService) {

    this.users = users;

    this.undo = function() {
        UndoService.undo().then(function() {
            $state.reload();
        });
    };

    this.redo = function() {

        UndoService.redo().then(function() {
            $state.reload();
        });
    };

    this.removeUser = function(user) {

        var deleteCommand = new UserDeleteCommand(user);

        UndoService.executeCommand(deleteCommand).then(function() {
            $state.reload();
        });
    };

    this.addUser = function() {

        var user = new User({
            username: 'Gouzigouza' + (new Date().getTime())
        });

        var createCommand = new UserCreateCommand(user);

        UndoService.executeCommand(createCommand).then(function() {
            $state.reload();
        });
    };
}
UserListController.$inject = ['$state', 'users', 'User', 'UserCreateCommand', 'UserDeleteCommand', 'UndoService'];

UserListController.resolve = {

    /** @ngInject */
    users: ['UserService', function(UserService) {
        return UserService.getUsers();
    }]

};

angular
    .module('undo.controllers')
    .controller('UserListController', UserListController);

/** @ngInject */
function UserFactory () {

    /* jshint -W004 */
    var UserFactory = function UserFactory (data) {

        data = data || {};

        this.username = data.username || null;
    };

    UserFactory.prototype = {
        /**
         * @returns {boolean}
         */
        isNew: function() {
            return !this.id;
        }
    };

    return UserFactory;
}

angular
    .module('undo.models')
    .factory('User', UserFactory);

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
mainRoutesConfiguration.$inject = ['$stateProvider', '$urlRouterProvider'];

angular
    .module('undo.routes')
    .config(mainRoutesConfiguration);

/** @ngInject */
function DummyStoreService ($q, $window) {

    var data = {},
        CryptoJS = $window.CryptoJS,
        getEntityIndex = function(type, id) {

            if (undefined === data[type]) {
                data[type] = [];
            }

            for (var index = 0 ; index < data[type].length ; index++) {

                if (data[type][index].id === id) {
                    return index;
                }
            }

            return -1;
        },
        /* jshint -W004 */
        DummyStoreService = {};

    DummyStoreService.getAll = function(type) {

        var deferred = $q.defer();

        if (undefined === data[type]) {
            data[type] = [];
        }

        deferred.resolve(data[type]);

        return deferred.promise;

    };

    DummyStoreService.getOne = function(type, id) {

        var deferred = $q.defer();

        if (data[type][id]) {
            deferred.resolve(data[type][id]);
        } else {
            deferred.reject('Entity doesnt exist in this dummy store');
        }

        return deferred.promise;
    };

    DummyStoreService.add = function(type, entity) {
        entity = angular.copy(entity);
        var deferred = $q.defer();

        entity.id = CryptoJS.SHA1('' + new Date().getTime()).toString();
        data[type].push(entity);

        deferred.resolve(entity);

        return deferred.promise;
    };

    DummyStoreService.update = function(type, entity) {

        var deferred = $q.defer(),
            index = getEntityIndex(type, entity.id);

        if (index > -1) {
            data[type][index] = entity;
            deferred.resolve(entity);
        } else {
            deferred.reject('Entity doesnt exist in this dummy store');
        }

        return deferred.promise;
    };

    DummyStoreService.remove = function(type, id) {

        var deferred = $q.defer(),
            index = getEntityIndex(type, id);

        if (index > -1) {
            data[type].splice(index, 1);
            deferred.resolve();
        } else {
            deferred.reject('Entity doesnt exist in this dummy store');
        }

        return deferred.promise;
    };

    return DummyStoreService;
}
DummyStoreService.$inject = ['$q', '$window'];

angular.module('undo.services')
    .factory('DummyStoreService', DummyStoreService);

/** @ngInject */
function UndoService ($q) {

    /* jshint -W004 */
    var UndoService = {
        undos: [],
        redos: []
    };

    UndoService.undo = function() {

        if (!UndoService.undos.length) {

            var deferred = $q.defer();
            deferred.resolve('nothing to undo');

            return deferred.promise;
        }

        var command = UndoService.undos.pop();

        return command.reverse().then(function(data) {
            UndoService.redos.push(command);

            return data;
        });
    };

    UndoService.redo = function() {
        if (!UndoService.redos.length) {
            var deferred = $q.defer();
            deferred.resolve('nothing to redo');

            return deferred.promise;
        }

        var command = UndoService.redos.pop();

        return command.execute().then(function(data) {
            UndoService.undos.push(command);

            return data;
        });
    };

    UndoService.executeCommand = function(command) {
        UndoService.redos = [];
        return command.execute().then(function(data) {
            UndoService.undos.push(command);

            return data;
        });
    };

    return UndoService;
}
UndoService.$inject = ['$q'];

angular.module('undo.services')
    .factory('UndoService', UndoService);

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
UserServiceFactory.$inject = ['DummyStoreService'];

angular.module('undo.services')
    .factory('UserService', UserServiceFactory);
}( window ));