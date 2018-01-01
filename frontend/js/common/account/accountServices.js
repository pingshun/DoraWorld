/**
 * User Api
 */
common.factory('userApi', ['$http', 'promiseService', function($http, promiseService) {
    return {
        getUserById: function(id, purpose) {
            return promiseService.wrap(function(promise) {
                $http.get(CONSTANT.HOST + 'api/account/get_user?id=' + id).then(function (res) {
                    promise.resolve(res.data);
                }, promise.reject);
            });
        }
    }
}]);