(function () {
    'use strict';
    angular.module('sort-app', [])
        .controller('MainController', ['$scope', '$timeout', '$q', '$http', function ($scope, $timeout, $q, $http) {
            $scope.numbersToSort = [];
            $scope.visitors = [];
            $scope.sortDirection = 'Rosnąco';

            $scope.addNewNumber = function (numberToAdd) {
                if(!numberToAdd || numberToAdd.indexOf(',') == -1) {
                    return;
                }
                var number = parseFloat(numberToAdd.split(',')[0]);

                $scope.numbersToSort.push(number);
                $scope.numberToAdd = '';
            };

            $scope.$on('deleteNumberTile', function (e, tileNumber) {
                $scope.numbersToSort.splice(tileNumber, 1);
            });

            $scope.startSorting = function () {
                callSync(function* () {
                    var arrLength = $scope.numbersToSort.length;
                    for(var i = 0; i < arrLength - 1; i++) {
                        for(var j = i + 1; j < arrLength; j++) {
                            hightlightTile(i);
                            yield hightlightTile(j);

                            if($scope.sortDirection == 'Rosnąco') {
                                if($scope.numbersToSort[i] > $scope.numbersToSort[j]) {
                                    yield changeTiles(i, j);
                                }
                            } else {
                                if($scope.numbersToSort[i] < $scope.numbersToSort[j]) {
                                    yield changeTiles(i, j);
                                }
                            }
                            disableTilehighlight(i);
                            disableTilehighlight(j);
                        }
                    }
                });
            };

            $scope.addNewVisitor = function (name, surname) {
                $.ajax({
                    url: 'addPersonToVisitList.php',
                    type: 'POST',
                    data: {name: name, surname: surname},
                    success: function () {
                        $('#add-to-visit-wall').modal("hide");
                        getVisitors();
                        window.swal('Dodany do listy!');
                    }
                });
            };

            window.test = $scope.addNewVisitor;

            function getVisitors() {
                $http({
                    method: 'GET',
                    url: 'people.txt'
                }).then(function (resp) {
                    $scope.visitors = resp.data.split('\n').filter(function (elem) {
                        return elem !== '';
                    });
                });
            }

            function hightlightTile(id) {
                var deferred = $q.defer();

                $scope.$broadcast('hightlightTile', id);
                setTimeout(function () {
                    deferred.resolve();
                }, 500);

                return deferred.promise;
            }

            function disableTilehighlight(id) {
                $scope.$broadcast('disableTilehighlight', id);
            }

            function changeTiles(firstId, secondId) {
                var deferred = $q.defer(),
                    firstTile = angular.element(document.querySelector('.number-container-' + firstId)),
                    secondTile = angular.element(document.querySelector('.number-container-' + secondId)),
                    firstTilePosition = {
                        left: firstTile.prop('offsetLeft'),
                        top: firstTile.prop('offsetTop')
                    },
                    secondTilePosition = {
                        left: secondTile.prop('offsetLeft'),
                        top: secondTile.prop('offsetTop')
                    };

                $scope.$broadcast('moveTile', firstId, {
                    left: secondTilePosition.left - firstTilePosition.left,
                    top: secondTilePosition.top - firstTilePosition.top
                }, true);

                $scope.$broadcast('moveTile', secondId, {
                    left: firstTilePosition.left - secondTilePosition.left,
                    top: firstTilePosition.top - secondTilePosition.top
                }, true);

                $timeout(function () {
                    $scope.$broadcast('moveTile', firstId, {left: 0, right: 0}, false);
                    $scope.$broadcast('moveTile', secondId, {left: 0, right: 0}, false);
                    swapArrayElements($scope.numbersToSort, firstId, secondId);
                    deferred.resolve();
                }, 400);

                return deferred.promise;
            }

            function swapArrayElements (a, x, y) {
                var b = a[y];
                a[y] = a[x];
                a[x] = b;
            }
            function callSync(fn) {
                var iterator = fn();
                var loop = function(result) {
                    return !result.done && result.value.then(function(res) {
                       return loop(iterator.next(res));
                    });
                };

                loop(iterator.next());
            }

            getVisitors();
        }]);
})();