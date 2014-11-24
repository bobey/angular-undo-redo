/** @ngInject */
function UndoService ($q) {

    /* jshint -W004 */
    var UndoService = {
        undos: [],
        redos: []
    };

    var executeCommand = function(command) {
        return command.execute().then(function(data) {
            UndoService.undos.push(command);

            return data;
        });
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

        return executeCommand(UndoService.redos.pop());
    };

    UndoService.executeCommand = function(command) {
        UndoService.redos = [];
        return executeCommand(command);
    };

    return UndoService;
}

angular.module('undo.services')
    .factory('UndoService', UndoService);
