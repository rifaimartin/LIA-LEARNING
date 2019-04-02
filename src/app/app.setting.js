'use strict';

angular.module('BlurAdmin.setting', [])
    .service("config", function($window, $location) {
        var url = new $window.URL($location.absUrl()).origin;
        this.url = url + "/";

        var serverMode = 'prod'
        var baseUrl = 'azurewebsites.net/api/'
        if (serverMode == 'dev') {
            var subDomain = ''

        } else {
            var subDomain = 'lia-'
        }

        this.api = "https://" + subDomain + "simak-pro." + baseUrl;
        this.apiEnumeration = "https://" + subDomain + "core-framework." + baseUrl;
        this.apiPRS = "https://" + subDomain + "hr-prs." + baseUrl;
        this.apiGeneral = "https://" + subDomain + "general-data." + baseUrl;
        this.apiHR = "https://" + subDomain + "hr-ijs." + baseUrl;
        this.apiHRMD = "https://" + subDomain + 'hr-md.' + baseUrl;
        this.apiSTD = "https://" + subDomain + 'simak-std.' + baseUrl;
        this.apiLRN = "https://" + subDomain + 'simak-lrn.' + baseUrl;
        this.apiUserManagement = "https://" + subDomain + 'user-management.' + baseUrl;
        this.apiStudent = "https://" + subDomain + 'simak-lrn.' + baseUrl;
        this.apiEnumeration = "https://" + subDomain + 'core-framework.' + baseUrl; 
        this.apiElearning = "https://" + subDomain + 'el-crs.' + baseUrl; 
        this.paramsSearch = function(params) {
            var obj = [];
            $.each(params.search.predicateObject, function(name, value) {
                obj.push(String(name + ":" + value));
            });
            return obj.join(",");
        }
        this.paramsSort = function(params) {
            if (params.sort.reverse) var sort = "asc";
            else var sort = "desc";
            return params.sort.predicate + ":" + sort;
        }
    });




