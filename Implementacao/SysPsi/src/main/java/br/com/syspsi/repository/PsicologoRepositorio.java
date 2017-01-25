package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Psicologo;

public interface PsicologoRepositorio extends CrudRepository<Psicologo, Long> {
}
