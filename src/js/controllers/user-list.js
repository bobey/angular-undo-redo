/** @ngInject */
function UserListController($state, users, User, UserCreateCommand, UserDeleteCommand, UndoService) {

    this.users = users;

    this.undo = function() {
        UndoService.undo().then($state.reload);
    };

    this.redo = function() {

        UndoService.redo().then($state.reload);
    };

    this.removeUser = function(user) {
        UndoService.executeCommand(new UserDeleteCommand(user)).then($state.reload);
    };

    this.addUser = function() {

        var user = new User({
            username: 'Gouzigouza' + (new Date().getTime())
        });
        UndoService.executeCommand(new UserCreateCommand(user)).then($state.reload);
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
