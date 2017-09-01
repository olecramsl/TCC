// Modulos desta controller
var lazyModules = ['ckeditor'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('ConsultaPacienteCtrl', ['$scope','$mdDialog',
	'consultaPacienteFactory','agendamentoFactory', 'financeiroFactory', 'utilService', function (
			$scope, $mdDialog, consultaPacienteFactory, agendamentoFactory, financeiroFactory, 
			utilService) {	
	var ctrl = this;
		
	ctrl.salvando = false;
	ctrl.searchDisabled = false;
	
	if (consultaPacienteFactory.getLstAgendamentosComConsulta()) {		
		var qtdAgendamentosConsulta = consultaPacienteFactory.getLstAgendamentosComConsulta().length;		
		ctrl.dtInicio = new Date((consultaPacienteFactory.getLstAgendamentosComConsulta()[0]).consulta.inicio);
		ctrl.dtFim = new Date((consultaPacienteFactory.getLstAgendamentosComConsulta()[qtdAgendamentosConsulta-1]).consulta.inicio);		
	}
			
	// A consulta está sendo realizada pelo botão iniciar consulta da modal do agendamento
	$scope.$watch(function () { return (ctrl.agendamento.consulta)?ctrl.agendamento.consulta.prontuario:null; }, function (newValue, oldValue) {		
		if (consultaPacienteFactory.getConsulta() && consultaPacienteFactory.getProntuario() !== ctrl.oldProntuario) {			
			consultaPacienteFactory.setConteudoProntuarioMudou(true);
		} else {			
			consultaPacienteFactory.setConteudoProntuarioMudou(false);					
		}		
	});		
	
	$scope.$watch(function () { return consultaPacienteFactory.getLstAgendamentosComConsulta(); }, function (newValue, oldValue) {		
		ctrl.lstAgendamentosComConsulta = newValue;
	});
		
	ctrl.agendamento = consultaPacienteFactory.getAgendamento();
	ctrl.oldProntuario = consultaPacienteFactory.getProntuario();					
	
	// Editor options.
	ctrl.options = {			
			language: 'pt-br',
			// Define the toolbar: http://docs.ckeditor.com/#!/guide/dev_toolbar
			// The standard preset from CDN which we used as a base provides more features than we need.
			// Also by default it comes with a 2-line toolbar. Here we put all buttons in a single row.
			toolbar: [
				{ name: 'clipboard', items: [ 'Undo', 'Redo' ] },
				{ name: 'styles', items: [ 'Styles', 'Format' ] },
				{ name: 'basicstyles', items: [ 'Bold', 'Italic', 'Strike', '-', 'RemoveFormat' ] },
				{ name: 'paragraph', items: [ 'NumberedList', 'BulletedList', '-', 'Outdent', 'Indent', '-', 'Blockquote' ] },
				{ name: 'links', items: [ 'Link', 'Unlink' ] },
				{ name: 'insert', items: [ 'Image', 'EmbedSemantic', 'Table' ] },
				{ name: 'tools', items: [ 'Maximize' ] },
				{ name: 'editing', items: [ 'Scayt' ] }
			],									
			
			// Since we define all configuration options here, let's instruct CKEditor to not load config.js which it does by default.
			// One HTTP request less will result in a faster startup time.
			// For more information check http://docs.ckeditor.com/#!/api/CKEDITOR.config-cfg-customConfig
			customConfig: '',
			
			// Make the editing area bigger than default.
			height: 300,
			
			// An array of stylesheets to style the WYSIWYG area.
			// Note: it is recommended to keep your own styles in a separate file in order to make future updates painless.
			contentsCss: [ 'lib/angular-ckeditor/angular-ckeditor.css' ],
			
			// This is optional, but will let us define multiple different styles for multiple editors using the same CSS file.
			bodyClass: 'article-editor',
			
			// Reduce the list of block elements listed in the Format dropdown to the most commonly used.
			format_tags: 'p;h1;h2;h3;pre',
			
			// Simplify the Image and Link dialog windows. The "Advanced" tab is not needed in most cases.
			removeDialogTabs: 'image:advanced;link:advanced',
			
			// Define the list of styles which should be available in the Styles dropdown list.
			// If the "class" attribute is used to style an element, make sure to define the style for the class in "mystyles.css"
			// (and on your website so that it rendered in the same way).
			// Note: by default CKEditor looks for styles.js file. Defining stylesSet inline (as below) stops CKEditor from loading
			// that file, which means one HTTP request less (and a faster startup).
			// For more information see http://docs.ckeditor.com/#!/guide/dev_styles
			stylesSet: [
				/* Inline Styles */
				{ name: 'Marker',			element: 'span', attributes: { 'class': 'marker' } },
				{ name: 'Cited Work',		element: 'cite' },
				{ name: 'Inline Quotation',	element: 'q' },
				/* Object Styles */
				{
					name: 'Special Container',
					element: 'div',
					styles: {
						padding: '5px 10px',
						background: '#eee',
						border: '1px solid #ccc'
					}
				},
				{
					name: 'Compact table',
					element: 'table',
					attributes: {
						cellpadding: '5',
						cellspacing: '0',
						border: '1',
						bordercolor: '#ccc'
					},
					styles: {
						'border-collapse': 'collapse'
					}
				},
				{ name: 'Borderless Table',		element: 'table',	styles: { 'border-style': 'hidden', 'background-color': '#E6E6FA' } },
				{ name: 'Square Bulleted List',	element: 'ul',		styles: { 'list-style-type': 'square' } },
				/* Widget Styles */
				// We use this one to style the brownie picture.
				{ name: 'Illustration', type: 'widget', widget: 'image', attributes: { 'class': 'image-illustration' } },
				// Media embed
				{ name: '240p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-240p' } },
				{ name: '360p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-360p' } },
				{ name: '480p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-480p' } },
				{ name: '720p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-720p' } },
				{ name: '1080p', type: 'widget', widget: 'embedSemantic', attributes: { 'class': 'embed-1080p' } }
			]
	};
	
	ctrl.salvar = function(agendamento) {
		ctrl.salvando = true;
		consultaPacienteFactory.setAgendamento(agendamento);
		agendamento.consulta = prepararConsulta(agendamento.consulta.prontuario);		
		consultaPacienteFactory.salvarConsultaPaciente(agendamento).then(
				successCallback = function(response) {
					/*
					ctrl.showMsg = true;
				       $timeout(function(){
				          ctrl.showMsg = false;
				       }, 5000);
				    */
					ctrl.salvando = false;
					consultaPacienteFactory.setAgendamento(response.data);
					ctrl.oldProntuario = ctrl.agendamento.consulta.prontuario;
					consultaPacienteFactory.setConteudoProntuarioMudou(false);
				},
				errorCallback = function (error, status){
					ctrl.salvando = false;
					utilService.tratarExcecao(error); 
				}
		);
	};	
	
	ctrl.finalizarConsulta  = function(agendamento) {	
		financeiroFactory.setAgendamento(agendamento);
		$mdDialog.show({
			controller: 'DialogCtrl',			
		    templateUrl: 'templates/finalizar_consulta_modal.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: true		    
		}).then(function() {			
			if (consultaPacienteFactory.getValor()) {
				agendamento.consulta = prepararConsulta(agendamento.consulta.prontuario);
				
				consultaPacienteFactory.salvarConsultaPaciente(agendamento).then(
						successCallback = function(response) {
							consultaPacienteFactory.setAgendamento(response.data);
							ctrl.oldProntuario = ctrl.agendamento.consulta.prontuario;
							consultaPacienteFactory.setConteudoProntuarioMudou(false);
							
							// Imprime o recibo, caso necessário
							if (response.data.consulta.recibo) {
								// dados do recibo
								var confirm = $mdDialog.prompt()
							      .title('Informações Adicionais do Recibo')
							      .textContent('Pagamento referente a ...')
							      .placeholder('referente a ...')
							      .ariaLabel('Referente a ...')							      
							      //.targetEvent(ev)
							      .ok('Emitir Recibo')
							      .cancel('Cancelar');

							    $mdDialog.show(confirm).then(function(referenteA) {
							    	utilService.setMessage("Gerando recibo ...");
									utilService.showWait();
									consultaPacienteFactory.imprimirRecibo(agendamento, referenteA).then(
											successCalback = function(response) {
												utilService.hideWait();
												var file = new Blob([response.data], {
											    	type: 'application/pdf'
											    });
											    var fileURL = URL.createObjectURL(file);				    
												window.open(fileURL);
											},
											errorCallback = function(error, status) {
												utilService.hideWait();
												utilService.tratarExcecao("Não foi psossível gerar o recibo.");
											}
									);
							    }, function() {							      
							    });							    							
							}
						},
						errorCallback = function (error, status){					
							utilService.tratarExcecao(error); 
						}
				);
			} else {
				$mdDialog.show(
					$mdDialog.alert()
						.clickOutsideToClose(true)
						.title('Algo saiu errado ...')
						.textContent("O valor informado é inválido!")
						.ariaLabel('Alerta')
						.ok('Ok')						
				);
			}
		}, function() {});
	};		
	
	ctrl.isDisabled = function (agendamento) {
		if (ctrl.salvando === true) {
			return true;
		}
		
		if (!agendamento || !agendamento.paciente || !agendamento.consulta || !agendamento.consulta.prontuario || 
			ctrl.oldProntuario === agendamento.consulta.prontuario) {		
			return true;
		}		
		return false;
	}
	
	var prepararConsulta = function(prontuario) {
		if (!consultaPacienteFactory.getFim()) {
			consultaPacienteFactory.setFim(new Date());
		}
				
		return consulta = {
				id: consultaPacienteFactory.getId(),					
				prontuario: prontuario,
				valor: consultaPacienteFactory.getValor(),
				recibo: consultaPacienteFactory.getRecibo(),
				inicio: consultaPacienteFactory.getInicio(),
				fim: consultaPacienteFactory.getFim()
		};
	};
	
	ctrl.listarProntuariosPorPeriodo = function(dataInicial, dataFinal, paciente) {
		ctrl.searchDisabled = true;
		agendamentoFactory.listarAgendamentosComConsultaPeriodo(dataInicial, dataFinal, paciente).then(
				successCallback = function(response) {					
					consultaPacienteFactory.setLstAgendamentosComConsulta(response.data);					
					if (response.data.length > 0) {
						//consultaPacienteFactory.setAgendamento(response.data[0]);
						ctrl.agendamento = response.data[0];
					} else {
						$mdDialog.show(
							$mdDialog.alert()
								.clickOutsideToClose(true)
								.title('Prontuários')
								.textContent('Paciente não possui prontuários!')
								.ariaLabel('Alerta')
								.ok('Ok')						
						);
					}					
				},
				errorCallback = function (error, status){
					ctrl.searchDisabled = false;
					utilService.tratarExcecao(error); 
				}
		);
	}
	
	ctrl.imprimirRelatorioProntuarios = function(dataInicial, dataFinal, paciente) {
		utilService.setMessage("Gerando relatório ...");
		utilService.showWait();
		consultaPacienteFactory.imprimirRelatorioProntuarios(dataInicial, dataFinal, paciente).then(
				successCallback = function(response) {
					utilService.hideWait();
					var file = new Blob([response.data], {
				    	type: 'application/pdf'
				    });
				    var fileURL = URL.createObjectURL(file);				    
					window.open(fileURL);							
				},
				errorCallback = function(error) {
					utilService.hideWait();
					utilService.tratarExcecao(error);
				}
		);
	};
	
	ctrl.imprimirRelatorioProntuario = function(agendamento) {
		utilService.setMessage("Gerando relatório ...");
		utilService.showWait();
		consultaPacienteFactory.imprimirRelatorioProntuario(agendamento).then(
				successCallback = function(response) {
					utilService.hideWait();
					var file = new Blob([response.data], {
				    	type: 'application/pdf'
				    });
				    var fileURL = URL.createObjectURL(file);				    
					window.open(fileURL);							
				},
				errorCallback = function(error) {
					utilService.hideWait();
					utilService.tratarExcecao(error);
				}
		);
	};
}]);