/** @ngInject */
function UserListController($state, users, User, UserCreateCommand, UserDeleteCommand, UndoService) {

    this.users = users;

    var stateReload = function() {
        $state.reload();
    };

    this.undo = function() {
        UndoService.undo().then(stateReload);
    };

    this.redo = function() {

        UndoService.redo().then(stateReload);
    };

    this.removeUser = function(user) {
        UndoService.executeCommand(new UserDeleteCommand(user)).then(stateReload);
    };

    this.addUser = function() {

        var user = new User({
            username: 'Gouzigouza' + (new Date().getTime())
        });
        UndoService.executeCommand(new UserCreateCommand(user)).then(stateReload);
    };
}

UserListController.resolve = {

    /** @ngInject */
    users: function(UserService) {
        return UserService.getUsers();
    }

};

angular
    .module('undo.controllers')
    .controller('UserListController', UserListController);
