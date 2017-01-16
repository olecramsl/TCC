$(document).ready(function() {
	$('#calendar').fullCalendar({
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		locale : 'pt-br',
		navLinks : true, // can click day/week names to navigate views
		selectable : true,
		slotDuration : "00:30:00",
		slotLabelFormat : [ 'ddd D/M', 'H:mm' ],
		selectHelper : true,
		select : function(start, end) {	
			angular.element('#AgendaCtrl').scope().apagarDadosAgendamento();
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();				
							
			angular.element('#AgendaCtrl').scope().agendamento.start = start;
			angular.element('#AgendaCtrl').scope().agendamento.end   = end;
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
				
			alert(event.repetirSemanalmente);
			angular.element('#AgendaCtrl').scope().agendamento.id                  = event.id;
			angular.element('#AgendaCtrl').scope().agendamento.gCalendarId         = event.gCalendarId;
			angular.element('#AgendaCtrl').scope().agendamento.paciente            = event.paciente;
			angular.element('#AgendaCtrl').scope().agendamento.title               = event.title;
			angular.element('#AgendaCtrl').scope().agendamento.start               = event.start;
			angular.element('#AgendaCtrl').scope().agendamento.end                 = event.end;
			angular.element('#AgendaCtrl').scope().agendamento.repetirSemanalmente = event.repetirSemanalmente;
			angular.element('#AgendaCtrl').scope().agendamento.description         = event.description;								
			
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},		
		eventDrop : function( event ) {	
			angular.element('#AgendaCtrl').scope().agendamento.id                  = event.id;
			angular.element('#AgendaCtrl').scope().agendamento.gCalendarId         = event.gCalendarId;
			angular.element('#AgendaCtrl').scope().agendamento.paciente            = event.paciente;
			angular.element('#AgendaCtrl').scope().agendamento.title               = event.title;
			angular.element('#AgendaCtrl').scope().agendamento.start               = event.start;
			angular.element('#AgendaCtrl').scope().agendamento.end                 = event.end;
			angular.element('#AgendaCtrl').scope().agendamento.repetirSemanalmente = event.repetirSemanalmente;
			angular.element('#AgendaCtrl').scope().agendamento.description         = event.description;
			angular.element('#AgendaCtrl').scope().updateEventDroped();
		},		
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});
});