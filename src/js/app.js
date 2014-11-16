angular.module('undo.routes', ['ui.router.compat']);
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

]).config(function($provide) {
    $provide.decorator('$state', function($delegate) {
        $delegate.reload = function() {
            this.transitionTo(this.current, this.$current.params, { reload: true, inherit: true, notify: true });
        };
        return $delegate;
    });
});
