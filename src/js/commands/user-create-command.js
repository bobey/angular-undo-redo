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

angular
    .module('undo.commands')
    .factory('UserCreateCommand', UserCreateCommand);
