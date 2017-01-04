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
			angular.element('#AgendaCtrl').scope().$ctrl.openNewEventModal();			
							
			angular.element('#AgendaCtrl').scope().agendamento.inicio = start;
			angular.element('#AgendaCtrl').scope().agendamento.fim = end;			
			angular.element('#AgendaCtrl').scope().$apply();			
		},
		eventClick : function(event, jsEvent, view) {			
			angular.element('#AgendaCtrl').scope().agendamento.id = event.id;
			angular.element('#AgendaCtrl').scope().agendamento.titulo = event.title;
			angular.element('#AgendaCtrl').scope().agendamento.inicio = event.start;				    				    				   
			angular.element('#AgendaCtrl').scope().agendamento.fim = event.end;
			
			alert(angular.element('#AgendaCtrl').scope().agendamento.id);
			alert(angular.element('#AgendaCtrl').scope().agendamento.titulo);
			
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});
});