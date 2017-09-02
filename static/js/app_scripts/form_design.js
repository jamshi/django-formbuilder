var my_app = angular.module('formdesign', []);
my_app.controller('formDesignCntrlr', ['$scope', '$compile', '$http', '$window', function ($scope, $compile, $http, $window) {

    $scope.controls = {};
    $scope.selected = null;
    $scope.formname = '';

    function guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }

        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
            s4() + '-' + s4() + s4() + s4();
    }

    /*Function to add the control to design mode*/

    $scope.addControl = function (ctrl, _uuid) {
        var uuid = null;
        var show_initial = false;
        if (!_uuid) {
            uuid = guid();
            show_initial = true;
        }
        else
            uuid = _uuid;

        var text_html = '<div class="form-group" id="ctrl-' + uuid + '">';
        if (ctrl == 'textInput') {
            $scope.controls[uuid] = {'control': 'textbox', 'label': 'Label', 'placeholder': 'Enter ...', 'value': '', 'name': 'input'};

            text_html += '<label for="" class="col-sm-2 col-lg-2 col-md-2 control-label">' + '{{controls[\'' + uuid.toString() + '\'].label}}</label>' +
                '<div class="col-sm-10 col-lg-5 col-md-5">' +
                '<input type="text" value="{{controls[\'' + uuid + '\'].value}}" class="form-control {{controls[\'' + uuid + '\'].theme}}" id="' + uuid + '" placeholder="{{controls[\'' + uuid + '\'].placeholder}}">' +
                '</div>';
        }
        else if (ctrl == 'hiddenInput') {
            $scope.controls[uuid] = {'control': 'hidden', 'label': 'Label', 'placeholder': 'Enter ...', 'value': '', 'name': 'input'};

            text_html += '<label for="" class="col-sm-2 col-lg-2 col-md-2 control-label">' + 'Hidden Input:' + '</label>' +
                '<div class="col-sm-10 col-lg-5 col-md-5">' +
                '<input type="hidden" value="{{controls[\'' + uuid + '\'].value}}" class="form-control" id="' + uuid + '" />' +
                '<p class="form-control-static">#hidden-input==>' + '{{controls[\'' + uuid.toString() + '\'].name}}#</p>' +
                '</div>';
        }
        else if (ctrl == 'textAreaInput') {
            $scope.controls[uuid] = {'control': 'textArea', 'label': 'Label', 'placeholder': 'Enter ...', 'value': '', 'name': 'input'};

            text_html += '<label for="" class="col-sm-2 col-lg-2 col-md-2 control-label">' + '{{controls[\'' + uuid.toString() + '\'].label}}</label>' +
                '<div class="col-sm-10 col-lg-5 col-md-5">' +
                '<textarea value="{{controls[\'' + uuid + '\'].value}}" class="form-control  {{controls[\'' + uuid + '\'].theme}}" id="' + uuid + '" placeholder="{{controls[\'' + uuid + '\'].placeholder}}"></textarea>' +
                '</div>';
        }
        else if (ctrl == 'selectInput') {
            $scope.controls[uuid] = {'control': 'select', 'label': 'Label', 'placeholder': 'Enter ...', 'value': '', 'name': 'input', 'options': [
                {'value': '', 'text': ''}
            ]};

            text_html += '<label for="" class="col-sm-2 col-lg-2 col-md-2 control-label">' +
                '{{controls[\'' + uuid.toString() + '\'].label}}</label>' +
                '<div class="col-sm-10 col-lg-5 col-md-5">' +
                '<select  class="form-control  {{controls[\'' + uuid + '\'].theme}}" id="' + uuid +
                '" ng-model="opted" ng-options="x.text for x in controls[\'' + uuid.toString() + '\'].options">' +
                '</select></div>';

        }

        text_html += '<div class="col-sm-12 col-lg-5 col-md-5 edit-actions">' +
            '<a href="#" ><span class="glyphicon glyphicon-pencil" aria-hidden="true" ng-click="showConfig(\'' + uuid + '\')"></span></a>' +
            '<a href="#" ><span class="glyphicon glyphicon-trash" aria-hidden="true" ng-click="removeCtrl(\'' + uuid + '\')"></span></a>' +
            '</div>' +
            '</div>';

        $('#form_container').append($compile(text_html)($scope));
        if (show_initial) $scope.showConfig(uuid);
    }


    $scope.removeCtrl = function (uuid) {
        $("#ctrl-" + uuid).remove();
        delete $scope.controls[uuid];
    }


    $scope.showConfig = function (uuid) {
        $scope.selected = $scope.controls[uuid];
        $('#config_modal').modal('show');
    }


    $scope.addRow = function () {
        $scope.selected.options.push({'value': '', 'text': ''})
    }

    $scope.removeOption = function (index) {
        if (index > -1) {
            $scope.selected.options.splice(index, 1);
        }
    }

    /*Construct final form html*/
    $scope.constructHtml = function () {
        var html = "";
        for (var key in $scope.controls) {
            html += '<div class="form-group" id="ctrl-' + key + '">';
            var p = $scope.controls[key];
            if (p.control != 'hidden') {
                html += '<label for="' + key + '">' + $scope.controls[key].label + '</label>';
            }
            if (p.control == 'textbox') {
                html += '<input type="text" class="form-control ' + $scope.controls[key].theme + '" id="' + key +
                    '" placeholder="' + $scope.controls[key].placeholder + '" name="' + $scope.controls[key].name + '" value="' +
                    $scope.controls[key].value + '"/>';
            }
            else if (p.control == 'textArea') {
                html += '<textarea class="form-control ' + $scope.controls[key].theme + '" id="' + key +
                    '" placeholder="' + $scope.controls[key].placeholder + '" name="' + $scope.controls[key].name + '" value="' +
                    $scope.controls[key].value + '"></textarea>';
            }
            else if (p.control == 'hidden') {
                html += '<input type="hidden" id="' + key + ' name="' + $scope.controls[key].name + '" value="' +
                    $scope.controls[key].value + '">';
            }
            else if (p.control == 'select') {
                html += '<select class="form-control ' + $scope.controls[key].theme + '" id="' + key +
                    '" placeholder="' + $scope.controls[key].placeholder + '" name="' + $scope.controls[key].name + '" value="' +
                    $scope.controls[key].value + '">';
                for (var i = 0; i < p.options.length; i++) {
                    html += '<option value="' + p.options[i].value + '">' + p.options[i].text + '</option>';
                }
                html += '</select>';
            }
            html += '</div>';
        }
        return html;

    }

    /*Save the form */
    $scope.saveForm = function () {
        // use $.param jQuery function to serialize data from JSON
        var data = $.param({
            form_name: $scope.formname,
            form_html: $scope.constructHtml(),
            config: JSON.stringify($scope.controls)
        });

        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }

        $http.post('/saveform/', data, config)
            .then(function (data, status, headers, config) {
                $window.location.href = '/';
            })
            .catch(function (data, status, header, config) {

            });
    };

    $scope.clearDesigner = function () {
        $('#form_container').html('');
        $scope.controls = {};
        $scope.formname = '';
    }


    /*Load an existing form to the designer*/
    $scope.loadForm = function (pk) {
        var config = {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8;'
            }
        }
        $http.post('/getform/', $.param({'pk': pk}), config)
            .then(function (data, status, headers, config) {
                data = data.data;
                if (!data.status) {
                    alert('Failed to load form.');
                    return;
                }
                $scope.clearDesigner();
                var _data = JSON.parse(data.config);
                for (var key in _data) {
                    var obj = _data[key];
                    if (obj.control == 'textbox')
                        $scope.addControl('textInput', key);
                    else if (obj.control == 'hidden')
                        $scope.addControl('hiddenInput', key);
                    else if (obj.control == 'textArea')
                        $scope.addControl('textAreaInput', key);
                    else if (obj.control == 'select')
                        $scope.addControl('selectInput', key);
                }
                $scope.controls = _data;
                $scope.formname = data['form_name'];
            })
            .catch(function (data, status, header, config) {
                alert('Failed to load form.');
            });
    }
}]);