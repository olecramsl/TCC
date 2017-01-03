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
			//$('#calendar').fullCalendar('renderEvent',	eventData, true); // stick? = true
			
			/*
			var title = prompt('Título do Evento:');
			var eventData;
			if (title) {
				eventData = {
					title : title,
					start : start,
					end : end
				};
				$('#calendar').fullCalendar('renderEvent',	eventData, true); // stick? = true
			}
			$('#calendar').fullCalendar('unselect')
			*/			
		},
		eventClick : function(event, jsEvent, view) {												
			angular.element('#AgendaCtrl').scope().agendamento.titulo = event.start.format('H:mm') + ' - ' + event.title;				    				    				   
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});
});