$(document).ready(function() {
	$('#calendar').fullCalendar({
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		timezone: 'local',
		allDaySlot: false,
		ignoreTimezone: false,
		locale : 'pt-br',
		navLinks : true, // can click day/week names to navigate views
		selectable : true,
		slotDuration : "00:30:00",
		slotLabelFormat : [ 'ddd D/M', 'H:mm' ],
		selectHelper : true,		
		select : function(start, end) {	
			angular.element('#AgendaCtrl').scope().apagarDadosAgendamento();

			// Verifica se existe um horario pre definido
			if (!start.hasTime()) {		
				// armazena a data selecionada
				var dia = start.date();
				var mes = start.month();
				var ano = start.year();
								
				start = moment(); // reseta start com as informações atuais 
				start = moment(start).date(dia).month(mes).year(ano); // seta a data que foi clicada
				
				end = moment(start); // a consulta deve terminar no mesmo dia
				end.add(1, 'h'); // tempo da consulta
			}
			
			angular.element('#AgendaCtrl').scope().agendamento.start = start;										
			angular.element('#AgendaCtrl').scope().agendamento.end   = end;
			
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();															
			angular.element('#AgendaCtrl').scope().$apply();			
		},
		eventClick : function(event, jsEvent, view) {			
			var tmpLst = angular.element('#AgendaCtrl').scope().lstPacientesAtivos;
			for (var i = 0; i < tmpLst.length; i++) {
				if (tmpLst[i].id == event.paciente.id) {					
					angular.element('#AgendaCtrl').scope().indexPacienteSelecionado = i;
					break;
				}				
			}
							
			//setAgendamento(event);
			angular.element('#AgendaCtrl').scope().agendamento = angular.copy(event);
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},		
		eventDrop : function( event ) {	
			var horas   = event.end.hours();
			var minutos = event.end.minutes();
			
			event.end = moment(event.start);
			event.end = moment(event.end).hours(horas).minutes(minutos)
			
			//setAgendamento(event);
			angular.element('#AgendaCtrl').scope().agendamento = angular.copy(event);
			angular.element('#AgendaCtrl').scope().updateEventDroped();
		},
		viewRender: function (view, element) {
			angular.element('#AgendaCtrl').scope().listarAgendamento(view.start, view.end);						
        },        
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});
	
	/*
	setAgendamento = function (event) {	
		angular.element('#AgendaCtrl').scope().agendamento.id          = event.id;
		angular.element('#AgendaCtrl').scope().agendamento.gCalendarId = event.gCalendarId;
		angular.element('#AgendaCtrl').scope().agendamento.paciente    = event.paciente;
		angular.element('#AgendaCtrl').scope().agendamento.title       = event.title;
		angular.element('#AgendaCtrl').scope().agendamento.start       = event.start;
		angular.element('#AgendaCtrl').scope().agendamento.end         = event.end;
		angular.element('#AgendaCtrl').scope().agendamento.grupo       = event.grupo;
		angular.element('#AgendaCtrl').scope().agendamento.description = event.description;	 
	}
	*/
});