/** @ngInject */
function UserListController($state, users, User, UserService) {

    this.users = users;

    this.undo = function() {
        // TODO
    };

    this.redo = function() {
        // TODO
    };

    this.removeUser = function(user) {

        UserService.remove(user).then(function() {
            $state.reload();
        });
    };

    this.addUser = function() {

        var user = new User({
            username: 'Gouzigouza' + (new Date().getTime())
        });

        UserService.save(user).then(function() {
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
