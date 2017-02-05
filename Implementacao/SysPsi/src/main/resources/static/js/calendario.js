$(document).ready(function() {
	$('#calendar').fullCalendar({
		header : {
			left : 'prev,next today',
			center : 'title',
			right : 'month,agendaWeek,agendaDay'
		},
		timezone: "local",
		allDaySlot: false,
		locale : 'pt-br',
		navLinks : true, // can click day/week names to navigate views
		selectable : true,
		slotDuration : "00:30:00",
		slotLabelFormat : [ 'ddd D/M', 'HH:mm' ],
		timeFormat : "HH:mm",
		selectHelper : true,		
		select : function(start, end) {					
			angular.element('#AgendaCtrl').scope().LimparDadosAgendamento();
			angular.element('#AgendaCtrl').scope().agendamentoCarregado = null;

			// Verifica se existe um horario pre definido
			if (!start.hasTime()) {		
				var time = moment();
				start = moment(start).hour(time.hour()).minute(time.minute()).second(0).millisecond(0);
				end = moment(start); // a consulta deve terminar no mesmo dia
				end.add(1, 'h'); // tempo da consulta
			}
			
			var dataInicialAgendamento = start.local();
			var dataFinalAgendamento = end.local();
			
			angular.element('#AgendaCtrl').scope().agendamento.start = new Date(dataInicialAgendamento);
			angular.element('#AgendaCtrl').scope().agendamento.end = new Date(dataFinalAgendamento);
			angular.element('#AgendaCtrl').scope().agendamento.formatedStart =	start.format('HH:mm');									
			
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
			
			event.formatedStart = event.start.format('H:mm');
							
			angular.element('#AgendaCtrl').scope().agendamento = angular.copy(event);
			
			angular.element('#AgendaCtrl').scope().agendamentoCarregado = angular.copy(event);
			
			console.log(angular.element('#AgendaCtrl').scope().agendamento.id);
			
			angular.element('#AgendaCtrl').scope().$ctrl.openEventModal();					
			angular.element('#AgendaCtrl').scope().$apply();				
		},		
		eventDrop : function(event, delta, revertFunc, jsEvent, ui, view) {	
			var oldEvent = angular.copy(event); // evento dropado
			oldEvent.repetirSemanalmente = false;						
			
			var days = moment.duration(delta).days()*(-1);
			oldEvent.start.add(days, "d");
			oldEvent.end.add(days, "d");						
			
			var horas   = event.end.hours();
			var minutos = event.end.minutes();
			
			event.end  = moment(event.start);
			event.end  = moment(event.end).hours(horas).minutes(minutos);
			event.repetirSemanalmente = false;
			
			angular.element('#AgendaCtrl').scope().updateEventDroped(angular.copy(event), angular.copy(oldEvent));								
		},
		viewRender: function (view, element) {				
			$('#calendar').fullCalendar('removeEvents');
			angular.element('#AgendaCtrl').scope().listarAgendamento(view.start, view.end);						
        },        
		editable : true,
		eventLimit : true // allow "more" link when too many events			
	});	
});