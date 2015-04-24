angular.module('trialsTrackmap')
.directive('showTrackInModal', function($rootScope, $filter){
    return {
        restrict: 'A',
        link: function(scope, element, attrs){

            function setTitle(typeId, title){
                if(typeId)
                    title = $filter('translate')('page.trackDetail.'+typeId);

                element.attr('title',title);
            }

            function init(){

                if(!('startline' in scope.track)){
                    return false;
                }

                var type = attrs.showTrackInModal,
                    typeId,
                    index = type.split(':')[1],
                    title = '';

                switch(true){
                    case 'startline' == type:
                        typeId = 'startline';
                        break;
                    case type.indexOf('datacube') >= 0:
                        typeId = 'datacubeGuide';
                        break;
                    case type.indexOf('candy') >= 0:
                        title = scope.track.candys[index].title;
                        break;
                    case type.indexOf('youtube') >= 0:
                        typeId = 'driveThrough';
                        break;
                }

                element.bind('click',function($event){
                    $event.preventDefault();
                    $event.stopPropagation();

                    $rootScope.$broadcast('showModal',scope.track,type,title);
                });

                setTitle(typeId, title);

                $rootScope.$on('$translateChangeSuccess', function(){
                    setTitle(typeId, title);
                });
            }

            scope.$watch('track',function(){
                init();
            });
        }
    }
})