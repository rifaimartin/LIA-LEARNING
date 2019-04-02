
(function () {
    'use strict';
    angular.module('BlurAdmin.pages.SessionActivity', [])
        .factory('SessionActivitySvc', function ($http, config) {
            return {
                //service
                getlist: function (limit, offset, params) {
                    var url = config.apiElearning + "sessionactivity";
                    var criteria = params.search.predicateObject == undefined ? "?criteria=" : '?criteria=' + config.paramsSearch(params);
                    var limit = '&limit=' + limit;
                    // var offset = '&page=' + parseInt(offset + 1);
                    var offset = '&page=' + offset;
                    var sort = params.sort.predicate == undefined ? "&sortBy=MasterProgramName:asc,Session:asc" : '&sortBy=' + config.paramsSort(params);
                    var final = url + criteria + limit + offset + sort;
                    // console.log(final);
                    return $http.get(final);
                },
                create: function (data) {
                    var url = config.apiElearning + 'sessionactivity';
                    return $http.post(url, data)
                },
                delete: function (id) {
                    var url = config.apiElearning + 'sessionactivity?id=' + id;
                    return $http.delete(url);
                },
                update: function (data) {
                    var url = config.apiElearning + 'sessionactivity';
                    return $http.put(url, data)
                },
                getById: function (id) {
                    var url = config.apiElearning + 'sessionactivity?id=' + id
                    return $http.get(url)
                },
                getBranchProgramCurriculum: function (id) {
                    var url = config.api + 'mastercurriculum?Criteria=MasterProgramId:' + id
                    return $http.get(url)
                },
                getActivity:function (curriculumId){
                    var url = config.apiElearning + 'activity?Criteria=CurriculumId:' + curriculumId;
                    return $http.get(url)                    
                },                                
                
                getBranch: function () {
                    var sort = '?sortBy=Name:asc'
                    var url = config.apiGeneral + 'branch' + sort + '&Criteria=UnitId:1'

                    return $http.get(url)
                },
                getBranchClass: function(id){
                    var sort = '&sortBy=Name:asc'
                    var url = config.apiLRN + 'branchclass'+'?Criteria=BranchId:'+id

                    return $http.get(url)             
                },
                getSession: function(id){
                    var sort = '&sortBy=OccurenceStartDateTime:desc'
                    var url = config.apiLRN + 'branchclassschedule'+'?Criteria=BranchClassId:'+id + sort

                    return $http.get(url)             
                },
                getMasterProgramList: function(id){
                    var sort = '?sortBy=Name:asc'
                    var url = config.api + 'masterprogram' +sort +'&Criteria=IsLeaf:true'

                    return $http.get(url)             
                },
                getByIdLesson: function (id) {
                    var url = config.apiElearning + 'lesson?id=' + id
                    return $http.get(url)
                },  
                getByIdAssignment: function (id) {
                    var url = config.apiElearning + 'assignment?id=' + id
                    return $http.get(url)
                },
                getByIdQuiz: function (id) {
                    var url = config.apiElearning + 'quiz?id=' + id
                    return $http.get(url)
                },                                                
            };
        })
        .config(routeConfig);
    /** @ngInject */
    function routeConfig($stateProvider) {
        $stateProvider
            .state('SessionActivity', {
                url: '/session-activity',
                title: 'Session Activity',
                templateUrl: 'app/pages/SessionActivity/List.html',
                controller: 'SessionActivityCtrl',
            })
    }
})();