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
