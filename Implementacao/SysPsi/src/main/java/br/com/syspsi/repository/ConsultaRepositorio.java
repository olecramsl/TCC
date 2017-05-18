package br.com.syspsi.repository;

import org.springframework.data.repository.CrudRepository;

import br.com.syspsi.model.entity.Consulta;

public interface ConsultaRepositorio extends CrudRepository<Consulta, Long> {
}
