// Modulos desta controller
var lazyModules = ['ckeditor'];
  
angular.forEach(lazyModules, function(dependency) {
	angular.module('syspsi').requires.push(dependency);
});

angular.module('syspsi').controller('ConsultaPacienteCtrl', ['$scope', '$mdDialog', 'consultaPacienteFactory', function ($scope, $mdDialog, 
		consultaPacienteFactory) {	
	var ctrl = this;
	
	$scope.$watch(function () { return consultaPacienteFactory.getPaciente(); }, function (newValue, oldValue) {
		ctrl.paciente = newValue;		
	});
	
	$scope.$watch(function () { return consultaPacienteFactory.getProntuario(); }, function (newValue, oldValue) {		
		ctrl.prontuario = newValue;		
	});
	
	$scope.$watch(function () { return ctrl.prontuario; }, function (newValue, oldValue) {
		if (ctrl.prontuario !== ctrl.oldProntuario) {
			consultaPacienteFactory.setConteudoProntuarioMudou(true);
		} else {
			consultaPacienteFactory.setConteudoProntuarioMudou(false);
		}
	});
	
	$scope.$watch(function () { return consultaPacienteFactory.getValor(); }, function (newValue, oldValue) {		
		ctrl.valor = newValue;		
	});
	
	ctrl.oldProntuario = consultaPacienteFactory.getProntuario();
	
	/**
	 * Trata eventuais excessoes que possam ocorrer
	 */
	var tratarExcecao = function(error) {
		var msg;
		try {
			// captura de excecao enviada pela Controller (codigo java)
			msg = error.data.message;
		} catch(erro) {
			// Erro nivel Javascript
			msg = error.data.message;
		}
		
		$mdDialog.show(
			$mdDialog.alert()
				.clickOutsideToClose(true)
				.title('Algo saiu errado ...')
				.textContent(msg)
				.ariaLabel('Alerta')
				.ok('Ok')						
		);
	};		
	
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
	
	ctrl.salvarProntuario = function(prontuario) {		
		var consulta = prepararConsulta(prontuario);
		
		consultaPacienteFactory.salvarConsultaPaciente(consulta).then(
				successCallback = function(response) {
					/*
					ctrl.showMsg = true;
				       $timeout(function(){
				          ctrl.showMsg = false;
				       }, 5000);
				    */		
					consultaPacienteFactory.setConsulta(response.data);
					consultaPacienteFactory.setProntuario(prontuario);					
					ctrl.oldProntuario = ctrl.prontuario;
					consultaPacienteFactory.setConteudoProntuarioMudou(false);
				},
				errorCallback = function (error, status){					
					tratarExcecao(error); 
				}
		);
	};	
	
	ctrl.finalizarConsulta  = function(prontuario) {
		$mdDialog.show({
			controller: 'DialogCtrl',			
		    templateUrl: 'templates/finalizar_consulta_modal.html',
		    parent: angular.element(document.body),		    
		    clickOutsideToClose: true		    
		}).then(function() {
			if (consultaPacienteFactory.getValor()) {
				var consulta = prepararConsulta(prontuario);
				
				consultaPacienteFactory.salvarConsultaPaciente(consulta).then(
						successCallback = function(response) {
							consultaPacienteFactory.setConsulta(response.data);
							consultaPacienteFactory.setProntuario(prontuario);
							ctrl.oldProntuario = ctrl.prontuario;
							consultaPacienteFactory.setConteudoProntuarioMudou(false);
						},
						errorCallback = function (error, status){					
							tratarExcecao(error); 
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
	
	var prepararConsulta = function(prontuario) {
		if (!consultaPacienteFactory.getFim()) {
			consultaPacienteFactory.setFim(new Date());
		}
				
		return consulta = {
				id: consultaPacienteFactory.getId(),					
				agendamento: consultaPacienteFactory.getAgendamento(),
				prontuario: prontuario,
				valor: consultaPacienteFactory.getValor(),
				recibo: consultaPacienteFactory.getRecibo(),
				inicio: consultaPacienteFactory.getInicio(),
				fim: consultaPacienteFactory.getFim()
		};
	};
}]);