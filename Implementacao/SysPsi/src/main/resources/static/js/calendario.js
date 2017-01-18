$(document).ready(function() {
	$('#calendar').fullCalendar({
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		timezone: 'local',
		locale : 'pt-br',
		navLinks : true, // can click day/week names to navigate views
		selectable : true,
		slotDuration : "00:30:00",
		slotLabelFormat : [ 'ddd D/M', 'H:mm' ],
		selectHelper : true,		
		select : function(start, end) {	
			angular.element('#AgendaCtrl').scope().apagarDadosAgendamento();
			
			if (start.hour() == 0) {
				var now = moment();
				start = moment(start).hours(now.hour()).minutes(now.minute()).seconds(0);
				now.add(30, 'm'); // 30 min ao final
				end   =  moment(end).hours(now.hour()).minutes(now.minute()).seconds(0);
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
							
			setAgendamento(event);											
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},		
		eventDrop : function( event ) {	
			setAgendamento(event);
			angular.element('#AgendaCtrl').scope().updateEventDroped();
		},
		viewRender: function (view, element) {
			$('#calendar').fullCalendar('removeEvents');
			angular.element('#AgendaCtrl').scope().listarAgendamento(view.start, view.end);						
        },
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});
	
	setAgendamento = function (event) {	
		angular.element('#AgendaCtrl').scope().agendamento = event;		 
	}
});