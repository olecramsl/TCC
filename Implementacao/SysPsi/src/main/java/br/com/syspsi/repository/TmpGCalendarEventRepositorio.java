package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.TmpGCalendarEvent;

public interface TmpGCalendarEventRepositorio extends CrudRepository<TmpGCalendarEvent, Long> {

}
