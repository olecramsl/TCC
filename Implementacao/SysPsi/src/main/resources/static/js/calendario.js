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
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();			
							
			angular.element('#AgendaCtrl').scope().agendamento.start = start;
			angular.element('#AgendaCtrl').scope().agendamento.end   = end;
			angular.element('#AgendaCtrl').scope().$apply();			
		},
		eventClick : function(event, jsEvent, view) {						
			// se garantirmos que lstAgendamentos estah ordenada, podemos fazer uma busca
			// binaria ao inves de linear
			var tmpLst = angular.element('#AgendaCtrl').scope().lstAgendamentos;
			for (var i = 0; i < tmpLst.length; i++) {				
				if (tmpLst[i].id == event.id) {						
					angular.element('#AgendaCtrl').scope().agendamento = tmpLst[i];
					break;
				}
		    }
			
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},
		eventDrop : function( event ) {			
			for (var i = 0; i < angular.element('#AgendaCtrl').scope().lstAgendamentos.length; i++) {				
				if (angular.element('#AgendaCtrl').scope().lstAgendamentos[i].id == event.id) {							
					angular.element('#AgendaCtrl').scope().lstAgendamentos[i] = event;					
					break;
				}
		    };		    		    		    				
		},		
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});
});