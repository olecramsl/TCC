// Modulos desta controller
var lazyModules = ['ckeditor'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('ConsultaCtrl', function ($scope, consultaAPI) {
	var ctrl = this;			
	
	$scope.$watch(function () { return consultaAPI.getPaciente(); }, function (newValue, oldValue) {
		ctrl.paciente = newValue;		
	});
	
	// Editor options.
	ctrl.options = {
			language: 'pt-br',
			allowedContent: true,
			entities: false
	};

	// Called when the editor is completely ready.
	ctrl.onReady = function () {
		// ...
	};
});