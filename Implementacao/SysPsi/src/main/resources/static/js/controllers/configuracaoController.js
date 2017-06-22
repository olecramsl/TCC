angular.module('syspsi').controller('ConfiguracaoCtrl', ['configuracaoFactory', 'utilService', 
	function(configuracaoFactory, utilService) {	
	var ctrl = this;		
	
	configuracaoFactory.isVinculadoGCal().then(
			successCallback = function(response) {
				ctrl.isVinculadoGCal = response.data;
			},
			errorCallback = function(error) {
				utilService.tratarExcecao("Não foi possível verificar a vinculação com o Google Calendar. A integração não foi ativada!");
				ctrl.isVinculadoGCal = false;
			}
	);	
	
	ctrl.onChange = function(cbState) {
		if (cbState) {
			window.location.href = "https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=627696234751-220l8b06g00manskl4a3q2tjujt61v1o.apps.googleusercontent.com&redirect_uri=https://localhost:8443/gCalendarCallBack&response_type=code&scope=https://www.googleapis.com/auth/calendar.readonly";
		}
	};
}]);