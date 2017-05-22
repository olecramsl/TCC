angular.module('syspsi').directive('formattedValor', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {			
			ctrl.$formatters.push(function(data) {				
				//convert data from model format to view format				
				if (data) {
					var valorFormat = $filter('monetarioFormat');
					return valorFormat(data); //converted
				}				
			});
		}
	}
}]);