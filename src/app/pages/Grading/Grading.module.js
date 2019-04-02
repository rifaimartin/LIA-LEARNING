(function () {
    'use strict';
    angular.module('BlurAdmin.pages.Grading', [])
        .factory('GradingSvc', function ($http, config) {
            return {
                //service
                getlist: function (limit, offset, params) {
                    var url = config.apiElearning + "studentSubmission";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=" : '?criteria=' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "" : '&sortBy=' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    return $http.get(final);
                },
                create: function (data) {
                    var url = config.apiElearning + 'studentSubmission';
                    return $http.post(url, data)
                },
                delete: function (id) {
                    var url = config.apiElearning + 'studentSubmission?id=' + id;
                    return $http.delete(url);
                },
                update: function (data) {
                    var url = config.apiElearning + 'studentSubmission';
                    return $http.put(url, data)
                },
                getById: function (id) {
                    var url = config.apiElearning + 'studentSubmission?id=' + id;
                    return $http.get(url)
                },
                getUnit: function () {
                    var url = config.apiGeneral + 'unit?sortBy=Code:asc';
                    return $http.get(url)
                },
                getBranch: function (id) {
                    var url = config.apiGeneral + 'branch?criteria=UnitId:' + id + '&sortBy=Name:asc';
                    return $http.get(url)
                },
                getTransaction: function () {
                    var url = config.apiFinance + 'documenttype';
                    return $http.get(url)
                },
                getCoa: function () {
                    var url = config.apiFinanceAKT + 'chartofaccount?mode=leaf';
                    return $http.get(url)
                },
                getPCC: function (unitId, branchId) {
                    var url = config.apiFinanceAKT + 'profitcostcenter?mode=leaf&sortBy=Code:asc&Criteria=UnitId:' + unitId + ',BranchId:' + branchId;
                    return $http.get(url)
                },
                getInvoice: function (unitId, branchId, BusinessPartnerId) {
                    var url = config.apiFinance + 'invoice?Criteria=UnitId:' + unitId + ',BranchId:' + branchId + ',BusinessPartnerId:' + BusinessPartnerId;
                    return $http.get(url)
                },
                getApInvoice: function () {
                    var url = config.apiFinance + 'apinvoice';
                    return $http.get(url)
                },
                getCustomer: function (unitId, branchId) {
                    var url = config.apiGeneral + 'businesspartner?mode=customer&Criteria=UnitId:' + unitId + ',BranchId:' + branchId;
                    return $http.get(url)
                },
                getBank: function (unitId, branchId) {
                    var url = config.apiFinance + 'bankaccount?Criteria=UnitId:' + unitId + ',BranchId:' + branchId;
                    return $http.get(url)
                },

            };
        })
        .config(routeConfig);

    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('StudentSubmission', {
                url: '/student-submission',
                title: 'Student Submission',
                templateUrl: 'app/pages/Grading/index.html',
                controller: 'GradingCtrl',
            });
    }
})();