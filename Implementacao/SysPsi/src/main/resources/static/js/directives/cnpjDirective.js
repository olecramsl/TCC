angular.module('syspsi').directive('formattedCnpj', ['$filter', function($filter) {	
	return {
		require: 'ngModel', 		
		link: function(scope, element, attrs, ctrl) {			
			ctrl.$formatters.push(function(data) {				
				//convert data from model format to view format				
				if (data) {
					var cnpjFormat = $filter('cnpjFormat');
					return cnpjFormat(data); //converted
				}				
			});
		}
	}
}]);