var myApp = angular.module('myApp', ['angularUtils.directives.dirPagination', 'ngLoadingSpinner']);

function MyController($scope, $http, $attrs) {

    $scope.searchIManage = function() {

        var inputBusca = $scope.seatchIManage != undefined ? $scope.seatchIManage : ""
        $scope.currentPage = 1;
        $scope.pageSize = 10;
        $scope.items = [];
        window.location.hash = "k=" + inputBusca;

        queryAPI(inputBusca);

    }

    $scope.openDoc = function(id) {

        if ($attrs.urlapi.toLowerCase() != "searchworkspaces") {
            window.open("http://site/WorkSite/scripts/GetDoc.aspx?latest=0&nrtid=" + escape(id) + "&ext=1")
        } else {
            window.open("http://site/WorkSite/scripts/home.aspx?latest=0&page=" + escape(id) + "&ext=1")
        }
    }


    $scope.Enter = function(keyEvent) {
        if (keyEvent.which === 13)
            $scope.searchIManage();
    }

    $scope.currentPage = 1;
    $scope.pageSize = 10;
    $scope.items = [];



    function queryAPI(param) {

        var queryAPI = "/_vti_bin/PNA.Intranet.Worksite.Services/DataService.svc/" + $attrs.urlapi + "?Text=" + param

        $http.get(_spPageContextInfo.siteAbsoluteUrl + queryAPI, {
                withCredentials: true
            })
            .success(function(data) {
                var x2js = new X2JS();
                var aftCnv = x2js.xml_str2json(data);


                if (aftCnv.SearchResults._ItemCount == 1) {
                    var arrayUmItem = new Array();
                    arrayUmItem.push(aftCnv.SearchResults.Document != undefined ? aftCnv.SearchResults.Document : aftCnv.SearchResults.Workspace)
                    $scope.items = arrayUmItem;
                } else {
                    $scope.items = aftCnv.SearchResults.Document != undefined ? aftCnv.SearchResults.Document : aftCnv.SearchResults.Workspace;

                }

                if ($scope.items == undefined) {
                    $scope.vazio = '"Nenhum resultado encontrado no iManage"';
                } else {
                    $scope.vazio = ""
                }
            })
            .error(function(data, status) {
                var data = data || "Request failed";
                var status = status;
                alert(data);
            });
    }

    var hash = window.location.hash;
    if (hash != "") {
        queryAPI(window.location.hash.split('#k=')[1]);
    } else {
        queryAPI("");
    }

    $scope.pageChangeHandle = function(num) {
        //console.log('meals page changed to ' + num);
    };
}

function OtherController($scope) {
    $scope.pageChangeHandler = function(num) {
        //console.log('going to page ' + num);
    };
}

myApp.controller('MyController', MyController);
myApp.controller('OtherController', OtherController);


myApp.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        if (input != undefined) {
            return input.split(splitChar)[splitIndex];
        } else {
            return "";
        }
    }
});



myApp.filter('DateFormat', function() {
    var weekday = new Array(7);
    weekday[0] = "Dom";
    weekday[1] = "Seg";
    weekday[2] = "Ter";
    weekday[3] = "Qua";
    weekday[4] = "Qui";
    weekday[5] = "Sex";
    weekday[6] = "Sab";


    return function(input) {
        if (input != "" && input != undefined) {
            var dia = "";
            var mes = "";
            var ano = "";
            var formatDate = input;
            try {
                dia = formatDate.split(' ')[0].split('/')[0]
                mes = formatDate.split(' ')[0].split('/')[1]
                ano = formatDate.split(' ')[0].split('/')[2]

            } catch (ex) {}

            formatDate = mes + "/" + dia + "/" + ano + " " + input.split(' ')[1]

            var d = new Date(formatDate);

            var weekName = weekday[d.getDay()];

            return weekName + " " + input.split(' ')[0];
        } else {
            return "";
        }
    }
});