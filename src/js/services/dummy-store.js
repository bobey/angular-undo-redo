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

angular.module('undo.services')
    .factory('DummyStoreService', DummyStoreService);
