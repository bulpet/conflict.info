var conflictApp = angular.module('conflictApp', []).run(function($rootScope) {
    $rootScope.selectedRegion = "Israel";
    //$rootScope.currentConflictDescr = null;
    $rootScope.$watch('selectedRegion', function () {
        //conflictApp.ConflictListCtrl();
    });
})

conflictApp.service('RegionalConflictService', function($http,$rootScope)
{
    this.Load = function(callbackFunc)
    {
        var service_url = 'https://www.googleapis.com/freebase/v1/search';
        var params = {
        'query': $rootScope.selectedRegion ,
        'filter': '(all type:/military/military_conflict tookplace_at./military/military_conflict/locations:' + $rootScope.selectedRegion.replace(/ /g,"_") + ')',
        'lang': 'en',
        'sort':'timepoint./time/event/start_date',
        'limit': 200,
        'indent': true,
        'scoring': 'entity',
        'output':'(all)'
        };

        $http({url:service_url, params:params})
            .success(function(response) {
                var tmp = response.result;

                for(var i=0; i<tmp.length; i++){
                    var end = tmp[i]['output']['all']['timepoint./time/event/end_date'];
                    var start = tmp[i]['output']['all']['timepoint./time/event/start_date'];

                    if((end != null) && (end != undefined) && (end.length > 0))
                        tmp[i].time_event_end_date = end[0];

                    if((start != null) && (start != undefined) && (start.length > 0))
                        tmp[i].time_event_start_date = start[0];
                }

                callbackFunc(tmp);
            });
    }

});

conflictApp.service('PersonConfilctService', function($http,$rootScope)
{
    this.Load = function(callbackFunc)
    {
        var service_url = 'https://www.googleapis.com/freebase/v1/search';
        var namePerson;
        //for(int i=0;i<$scope.currentConflictPersonnelInvolved.length;i++)
            //namePerson = $scope.currentConflictPersonnelInvolved[i]['name'];

        var params = {
        'query': name ,
        'filter': '(all type:/people/person)',
        'lang': 'en',
        'limit': 200,
        'indent': true,
        'scoring': 'entity',
        'output':'(all)'
        };

        $http({url:service_url, params:params})
            .success(function(response) {
                var tmp = response.result;

                for(var i=0; i<tmp.length; i++){
                    var end = tmp[i]['output']['all']['timepoint./time/event/end_date'];
                    var start = tmp[i]['output']['all']['timepoint./time/event/start_date'];

                    if((end != null) && (end != undefined) && (end.length > 0))
                        tmp[i].time_event_end_date = end[0];

                    if((start != null) && (start != undefined) && (start.length > 0))
                        tmp[i].time_event_start_date = start[0];
                }

                callbackFunc(tmp);
            });
    }

});

conflictApp.controller('ConflictListCtrl', function ($scope,RegionalConflictService,PersonConfilctService ) {
  	 
    $scope.Load = function(){
            RegionalConflictService.Load(function(data){$scope.conflicts = data;});
        };
    $scope.ShowDescr = function (item){
        debugger;
        $scope.currentConflictDescr = item['output']['all']['description./common/topic/description'][0];
        $scope.currentConflictName = item.name;
        $scope.currentConflictImages = item['output']['all']['property./common/topic/image'];
        $scope.currentConflict = item;
        };
    $scope.ResetCurrentConflict = function()
    {
        $scope.conflicts = null;
        $scope.currentConflictDescr = null;
        $scope.currentConflictImages = null;
    }
    $scope.ShowPerson = function (item){

        $scope.currentConflictPersonnelInvolved = item['output']['all']['participant./military/military_conflict/military_personnel_involved'];
        $scope.currentConflictCommander= item['output']['all']['participant./military/military_command/military_commander'];
        $scope.currentConflictCombatants= item['output']['all']['participant./military/military_combatant_group/combatants'];

        //PersonConfilctService.Load(function(data){$scope.persons = data;})
    }
    $scope.Load();

    //conflictApp.ConflictListLoad($scope,$http,$rootScope);
	/*$.getJSON(service_url + '?callback=?', params, function(response) {
			$scope.conflicts = (response);
			alert($scope.conflicts);
		});*/

	//alert($scope.conflicts);

});