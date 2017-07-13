angular.module('syspsi').controller('ConfiguracaoCtrl', ['$mdDialog', 'configuracaoFactory', 
	'psicologoFactory', 'utilService', 'consts', function($mdDialog, configuracaoFactory, 
			psicologoFactory, utilService, consts) {	
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
	
	ctrl.onChange = function(cbState, ev) {
		if (cbState) {			
			window.location.href = "https://accounts.google.com/o/oauth2/auth?access_type=offline&client_id=627696234751-11bnv9gph6uq6g0co0rej6nmtj6sfe28.apps.googleusercontent.com&redirect_uri="+consts.BASE_URL+"/gCalendarCallBack&response_type=code&approval_prompt=force&scope=https://www.googleapis.com/auth/calendar%20https://www.googleapis.com/auth/userinfo.profile"				                    
		} else {			
			ctrl.isVinculadoGCal = false;
			var confirm = $mdDialog.confirm()
	        	.title('Você tem certeza que deseja desvincular a agenda?')
	        	.textContent('Todos os agendamentos serão desvinculados!')
	        	.ariaLabel('Desvincular Google Calendar')
	        	.targetEvent(ev)
	        	.ok('Sim')
	        	.cancel('Não');

			$mdDialog.show(confirm).then(function() {
				utilService.setMessage("Desvinculando agendamentos ...");
				utilService.showWait();
				configuracaoFactory.desvincularAgendamentosDoGoogleCalendar().then(
						successCallback = function(response) {
							psicologoFactory.setVinculadoGCal();
							utilService.hideWait();
						}, 
						errorCallback = function(error) {
							utilService.hideWait();
							util.service.tratarExcecao(error);
						}
				);				
			}, function() {				
				ctrl.isVinculadoGCal = true;
			});
		}
	};
}]);