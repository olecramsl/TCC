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
			angular.element('#AgendaCtrl').scope().LimparDadosAgendamento();
			angular.element('#AgendaCtrl').scope().novoAgendamento = true;

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
			
			angular.element('#AgendaCtrl').scope().agendamento.start         = start;
			angular.element('#AgendaCtrl').scope().agendamento.formatedStart = 
				angular.element('#AgendaCtrl').scope().agendamento.start.format('H:mm');
			angular.element('#AgendaCtrl').scope().agendamento.end           = end;
			
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();															
			angular.element('#AgendaCtrl').scope().$apply();			
		},
		eventClick : function(event, jsEvent, view) {
			angular.element('#AgendaCtrl').scope().novoAgendamento = false;
			
			var tmpLst = angular.element('#AgendaCtrl').scope().lstPacientesAtivos;
			for (var i = 0; i < tmpLst.length; i++) {
				if (tmpLst[i].id == event.paciente.id) {					
					angular.element('#AgendaCtrl').scope().indexPacienteSelecionado = i;					
					break;
				}				
			}
			
			event.formatedStart = event.start.format('H:mm');
							
			angular.element('#AgendaCtrl').scope().agendamento = angular.copy(event);			
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},		
		eventDrop : function( event ) {	
			var horas   = event.end.hours();
			var minutos = event.end.minutes();
			
			event.end = moment(event.start);
			event.end = moment(event.end).hours(horas).minutes(minutos)
			
			angular.element('#AgendaCtrl').scope().agendamento = angular.copy(event);
			angular.element('#AgendaCtrl').scope().updateEventDroped();
		},
		viewRender: function (view, element) {				
			$('#calendar').fullCalendar('removeEvents');
			angular.element('#AgendaCtrl').scope().listarAgendamento(view.start, view.end);						
        },        
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});	
});