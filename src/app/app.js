'use strict';

angular.module('BlurAdmin', [
        'ngAnimate',
        'isteven-multi-select',
        'ngStorage',
        'dndLists',
        'ui.bootstrap',
        'ui.select',
        'ui.sortable',
        'ui.mask',
        'ui.router',
        'ngTouch',
        'toastr',
        'smart-table',
        "xeditable",
        'ui.slimscroll',
        'ngJsTree',
        'angular-progress-button-styles',
        'BlurAdmin.setting',
        'BlurAdmin.theme',
        'BlurAdmin.pages',
        'bootstrap.angular.validation',
        'ngSanitize',
        'darthwade.dwLoading',
    
    ])
    .config(['bsValidationConfigProvider', function(bsValidationConfigProvider) {
        bsValidationConfigProvider.global.setValidateFieldsOn('submit');
        bsValidationConfigProvider.global.successClass = false;
        bsValidationConfigProvider.global.errorMessagePrefix = '<span class="glyphicon glyphicon-warning-sign"></span> &nbsp;';
    }])
    .config(['uiMask.ConfigProvider', function (uiMaskConfigProvider) {
        uiMaskConfigProvider.maskDefinitions({ 'A': /[a-z]/, '*': /[a-zA-Z0-9]/, '1': /[0-1]/, '2': /[0-2]/, '3': /[0-3]/ });
        uiMaskConfigProvider.clearOnBlur(false);
        uiMaskConfigProvider.eventsToHandle(['input', 'keyup', 'click']);
    }])