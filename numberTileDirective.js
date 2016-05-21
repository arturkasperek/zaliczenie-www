angular.module('sort-app')
    .directive('numberTile',['$timeout','$q', function($timeout) {
        return {
            restrict: 'E',
            templateUrl: 'numberTile.html',
            scope: {
                number: '=',
                tileId: '='
            },
            link: function ($scope, $elem) {
                $scope.$on('moveTile', function (e, tileId, moveVal, withAnimation) {
                    if(tileId != $scope.tileId) return;
                    else {
                        e.preventDefault();

                        if(!withAnimation) {
                            $elem.css('transition', 'none');
                        } else {
                            $elem.css('transition', '');
                        }
                        $elem.css('transform', 'none');
                        $elem.css('transform', 'translate('+ moveVal.left +'px, '+ moveVal.top +'px)');
                    }
                });

                $scope.$on('hightlightTile', function (e, tileId) {
                    if(tileId != $scope.tileId) return;
                    else {
                        e.preventDefault();
                        $elem.addClass('hightlighted');
                    }
                });

                $scope.$on('disableTilehighlight', function (e, tileId) {
                    if(tileId != $scope.tileId) return;
                    else {
                        e.preventDefault();
                        $elem.removeClass('hightlighted');
                    }
                });

                $timeout(function () {
                    $elem.addClass('show-tile');
                }, 1);
            },
            controller: ['$scope', function ($scope) {
                $scope.deleteTile = function () {
                    $scope.$emit('deleteNumberTile', $scope.tileId);
                };
            }],
            replace: true
        };
    }]);