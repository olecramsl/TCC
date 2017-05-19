package br.com.syspsi.repository;

import java.util.Calendar;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.TmpGCalendarEvent;

public interface TmpGCalendarEventRepositorio extends CrudRepository<TmpGCalendarEvent, Long> {
	@Query("SELECT idGCalendar FROM TmpGCalendarEvent "
			+ "WHERE DATE(start) BETWEEN DATE(?1) AND DATE(?2)")
	public List<String> listarPorPeriodo(Calendar start, Calendar end);
	public List<TmpGCalendarEvent> findByStartBetween(Calendar start, Calendar end);
	public TmpGCalendarEvent findByIdGCalendar(String idGCalendar);
	@Transactional
	public void deleteByIdGCalendar(String idGCalendar);
	@Transactional
	public void deleteByIdRecurring(String idRecurring);	
	public TmpGCalendarEvent findTop1ByIdRecurringOrderByStartAsc(String idRecurring);	
}
