'use strict';

// Declare app level module which depends on filters, and services
var app = angular.module('app', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngStorage',
    'ui.router',
    'ui.bootstrap',
    'ui.load',
    'ui.jq',
    'ui.validate',
    'oc.lazyLoad',
    'pascalprecht.translate',
    'app.filters',
    'app.services',
    'app.directives',
    'app.controllers',
    'angularModalService'
])
    .run(
    ['$rootScope', '$state', '$stateParams',
        function ($rootScope, $state, $stateParams) {
            $rootScope.$state = $state;
            $rootScope.$stateParams = $stateParams;
            $rootScope.clientVeriable = window._client_variable;
        }
    ]
)
    .config(
    ['$stateProvider', '$urlRouterProvider', '$controllerProvider', '$compileProvider', '$filterProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $controllerProvider, $compileProvider, $filterProvider, $provide) {

            // lazy controller, directive and service
            app.controller = $controllerProvider.register;
            app.directive = $compileProvider.directive;
            app.filter = $filterProvider.register;
            app.factory = $provide.factory;
            app.service = $provide.service;
            app.constant = $provide.constant;
            app.value = $provide.value;
            $urlRouterProvider
                .otherwise('/app/video_list');


            $stateProvider
                .state('app', {
                    abstract: true,
                    url: '/app',
                    templateUrl: 'tpl/app.html'
                }).state('app.video_list', {
                    url: '/video_list',
                    templateUrl: '/cms_video/videoList.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/videoList.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.uploadvideo', {
                    url: '/uploadvideo',
                    templateUrl: '/cms_video/uploadVideo.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function( uiLoad ){
                                return uiLoad.load(['/cms_video/uploadVideo.js',
                                    'js/jquery/fileupload/tmpl.min.js',
                                    'js/jquery/fileupload/jquery.ui.widget.js',
                                    'js/jquery/fileupload/load-image.all.min.js',
                                    'js/jquery/fileupload/canvas-to-blob.min.js',
                                    'js/jquery/fileupload/jquery.iframe-transport.js',
                                    'js/jquery/fileupload/jquery.fileupload.js',
                                    'js/jquery/fileupload/jquery.fileupload-process.js',
                                    'js/jquery/fileupload/jquery.fileupload-image.js',
                                    'js/jquery/fileupload/jquery.fileupload-audio.js',
                                    'js/jquery/fileupload/jquery.fileupload-video.js',
                                    'js/jquery/fileupload/jquery.fileupload-validate.js',
                                    'js/jquery/fileupload/jquery.fileupload-ui.js',
                                    'js/jquery/fileupload/jquery.fileupload.css',
                                    'js/jquery/fileupload/jquery.fileupload-ui.css'
                                ])
                            }]
                    }
                }).state('app.index_setting', {
                    url: '/index_setting',
                    templateUrl: '/cms_video/indexSetting.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                    return uiLoad.load(['/cms_video/indexSetting.js',
                                        'js/jquery/fileupload/tmpl.min.js',
                                        'js/jquery/fileupload/jquery.ui.widget.js',
                                        'js/jquery/fileupload/load-image.all.min.js',
                                        'js/jquery/fileupload/canvas-to-blob.min.js',
                                        'js/jquery/fileupload/jquery.iframe-transport.js',
                                        'js/jquery/fileupload/jquery.fileupload.js',
                                        'js/jquery/fileupload/jquery.fileupload-process.js',
                                        'js/jquery/fileupload/jquery.fileupload-image.js',
                                        'js/jquery/fileupload/jquery.fileupload-audio.js',
                                        'js/jquery/fileupload/jquery.fileupload-video.js',
                                        'js/jquery/fileupload/jquery.fileupload-validate.js',
                                        'js/jquery/fileupload/jquery.fileupload-ui.js',
                                        'js/jquery/fileupload/jquery.fileupload.css',
                                        'js/jquery/fileupload/jquery.fileupload-ui.css'
                                    ]);
                                }
                            );
                        }]
                    }
                }).state('app.poster_setting', {
                    url: '/poster_setting',
                    templateUrl: '/cms_video/poster.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                    return uiLoad.load(['/cms_video/indexSetting.js',
                                        'js/jquery/fileupload/tmpl.min.js',
                                        'js/jquery/fileupload/jquery.ui.widget.js',
                                        'js/jquery/fileupload/load-image.all.min.js',
                                        'js/jquery/fileupload/canvas-to-blob.min.js',
                                        'js/jquery/fileupload/jquery.iframe-transport.js',
                                        'js/jquery/fileupload/jquery.fileupload.js',
                                        'js/jquery/fileupload/jquery.fileupload-process.js',
                                        'js/jquery/fileupload/jquery.fileupload-image.js',
                                        'js/jquery/fileupload/jquery.fileupload-audio.js',
                                        'js/jquery/fileupload/jquery.fileupload-video.js',
                                        'js/jquery/fileupload/jquery.fileupload-validate.js',
                                        'js/jquery/fileupload/jquery.fileupload-ui.js',
                                        'js/jquery/fileupload/jquery.fileupload.css',
                                        'js/jquery/fileupload/jquery.fileupload-ui.css'
                                    ]);
                                }
                            );
                        }]
                    }
                }).state('app.topic_list', {
                    url: '/topic_list',
                    templateUrl: '/cms_video/topicList.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/topicList.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.commentDetail', {
                    url: '/commentDetail?id',
                    templateUrl: '/cms_video/commentDetail.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/commentDetail.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.replyDetail', {
                    url: '/replyDetail?id',
                    templateUrl: '/cms_video/replyDetail.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/replyDetail.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.tags_setting', {
                    url: '/tags_setting',
                    templateUrl: '/cms_video/tags.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/tags.js',             
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.jiaocheng', {
                    url: '/jiaocheng',
                    templateUrl: '/cms_video/jiaocheng.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/jiaocheng.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.jcDetail', {
                    url: '/jcDetail?id',
                    templateUrl: '/cms_video/jcDetail.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/jcDetail.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.userMessage', {
                    url: '/push_message',
                    templateUrl: '/cms_video/userMessage.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/userMessage.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.get_feedback', {
                    url: '/get_feedback',
                    templateUrl: '/cms_video/get_feedback.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/get_feedback.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                }).state('app.add_author', {
                    url: '/add_author',
                    templateUrl: '/cms_video/add_author.html',
                    resolve: {
                        deps: ['uiLoad','$ocLazyLoad',
                            function (uiLoad,$ocLazyLoad) {
                                return $ocLazyLoad.load('ngGrid').then(
                                    function(){
                                        return uiLoad.load(['/cms_video/add_author.js',
                                            'js/jquery/fileupload/tmpl.min.js',
                                            'js/jquery/fileupload/jquery.ui.widget.js',
                                            'js/jquery/fileupload/load-image.all.min.js',
                                            'js/jquery/fileupload/canvas-to-blob.min.js',
                                            'js/jquery/fileupload/jquery.iframe-transport.js',
                                            'js/jquery/fileupload/jquery.fileupload.js',
                                            'js/jquery/fileupload/jquery.fileupload-process.js',
                                            'js/jquery/fileupload/jquery.fileupload-image.js',
                                            'js/jquery/fileupload/jquery.fileupload-audio.js',
                                            'js/jquery/fileupload/jquery.fileupload-video.js',
                                            'js/jquery/fileupload/jquery.fileupload-validate.js',
                                            'js/jquery/fileupload/jquery.fileupload-ui.js',
                                            'js/jquery/fileupload/jquery.fileupload.css',
                                            'js/jquery/fileupload/jquery.fileupload-ui.css'
                                        ]);
                                    }
                                );
                            }]
                    }
                });
        }
    ]
)

// translate config
    .config(['$translateProvider', function ($translateProvider) {

        // Register a loader for the static files
        // So, the module will search missing translation tables under the specified urls.
        // Those urls are [prefix][langKey][suffix].
        $translateProvider.useStaticFilesLoader({
            prefix: 'l10n/',
            suffix: '.js'
        });

        // Tell the module what language to use by default
        $translateProvider.preferredLanguage('en');

        // Tell the module to store the language in the local storage
        $translateProvider.useLocalStorage();

    }])

/**
 * jQuery plugin config use ui-jq directive , config the js and css files that required
 * key: function name of the jQuery plugin
 * value: array of the css js file located
 */
    .constant('JQ_CONFIG', {
        easyPieChart: ['js/jquery/charts/easypiechart/jquery.easy-pie-chart.js'],
        sparkline: ['js/jquery/charts/sparkline/jquery.sparkline.min.js'],
        plot: ['js/jquery/charts/flot/jquery.flot.min.js',
            'js/jquery/charts/flot/jquery.flot.resize.js',
            'js/jquery/charts/flot/jquery.flot.tooltip.min.js',
            'js/jquery/charts/flot/jquery.flot.spline.js',
            'js/jquery/charts/flot/jquery.flot.orderBars.js',
            'js/jquery/charts/flot/jquery.flot.pie.min.js'],
        slimScroll: ['js/jquery/slimscroll/jquery.slimscroll.min.js'],
        sortable: ['js/jquery/sortable/jquery.sortable.js'],
        nestable: ['js/jquery/nestable/jquery.nestable.js',
            'js/jquery/nestable/nestable.css'],
        filestyle: ['js/jquery/file/bootstrap-filestyle.min.js'],
        slider: ['js/jquery/slider/bootstrap-slider.js',
            'js/jquery/slider/slider.css'],
        chosen: ['js/jquery/chosen/chosen.jquery.min.js',
            'js/jquery/chosen/chosen.css'],
        TouchSpin: ['js/jquery/spinner/jquery.bootstrap-touchspin.min.js',
            'js/jquery/spinner/jquery.bootstrap-touchspin.css'],
        wysiwyg: ['js/jquery/wysiwyg/bootstrap-wysiwyg.js',
            'js/jquery/wysiwyg/jquery.hotkeys.js'],
        dataTable: ['js/jquery/datatables/jquery.dataTables.min.js',
            'js/jquery/datatables/dataTables.bootstrap.js',
            'js/jquery/datatables/dataTables.bootstrap.css'],
        vectorMap: ['js/jquery/jvectormap/jquery-jvectormap.min.js',
            'js/jquery/jvectormap/jquery-jvectormap-world-mill-en.js',
            'js/jquery/jvectormap/jquery-jvectormap-us-aea-en.js',
            'js/jquery/jvectormap/jquery-jvectormap.css'],
        footable: ['js/jquery/footable/footable.all.min.js',
            'js/jquery/footable/footable.core.css'],
        daterangepicker: ['js/jquery/bootstrap-daterangepicker/daterangepicker.js',
            'js/jquery/bootstrap-daterangepicker/daterangepicker-bs3.css'],
        filepuload:['js/jquery/fileupload/tmpl.min.js',
            'js/jquery/fileupload/jquery.ui.widget.js',
            'js/jquery/fileupload/load-image.all.min.js',
            'js/jquery/fileupload/canvas-to-blob.min.js',
            'js/jquery/fileupload/jquery.iframe-transport.js',
            'js/jquery/fileupload/jquery.fileupload.js',
            'js/jquery/fileupload/jquery.fileupload-process.js',
            'js/jquery/fileupload/jquery.fileupload-image.js',
            'js/jquery/fileupload/jquery.fileupload-audio.js',
            'js/jquery/fileupload/jquery.fileupload-video.js',
            'js/jquery/fileupload/jquery.fileupload-validate.js',
            'js/jquery/fileupload/jquery.fileupload-ui.js',
            'js/jquery/fileupload/jquery.fileupload.css',
            'js/jquery/fileupload/jquery.fileupload-ui.css']
    }
)

// modules config
    .constant('MODULE_CONFIG', {
        select2: ['js/jquery/select2/select2.css',
            'js/jquery/select2/select2-bootstrap.css',
            'js/jquery/select2/select2.min.js',
            'js/modules/ui-select2.js']
    }
)

// oclazyload config
    .config(['$ocLazyLoadProvider', function ($ocLazyLoadProvider) {
        // We configure ocLazyLoad to use the lib script.js as the async loader
        $ocLazyLoadProvider.config({
            debug: false,
            events: true,
            modules: [
                {
                    name: 'ngGrid',
                    files: [
                        'js/modules/ng-grid/ng-grid.min.js',
                        'js/modules/ng-grid/ng-grid.css',
                        'js/modules/ng-grid/theme.css'
                    ]
                },
                {
                    name: 'toaster',
                    files: [
                        'js/modules/toaster/toaster.js',
                        'js/modules/toaster/toaster.css'
                    ]
                },
            ]
        })
    }]).config(["$httpProvider", function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        $httpProvider.defaults.withCredentials = true;
        $httpProvider.defaults.headers.common['X-Requested-With'] = "XMLHttpRequest";
        $httpProvider.interceptors.push('sessionChecker');
    }])
    .factory('sessionChecker', ["$location", function ($location) {
        var sessionChecker = {
            responseError: function (response) {
                if (response.status == 401) {
                    $location.path('/login/signin');
                    return;
                }
                return response;
            }
        };
        return sessionChecker;
    }]);


