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

angular
    .module('undo.commands')
    .factory('UserDeleteCommand', UserDeleteCommand);
