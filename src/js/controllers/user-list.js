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

UserListController.resolve = {

    /** @ngInject */
    users: function(UserService) {
        return UserService.getUsers();
    }

};

angular
    .module('undo.controllers')
    .controller('UserListController', UserListController);
