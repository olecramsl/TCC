package br.com.syspsi.controller;

import java.security.Principal;
import java.util.Calendar;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import br.com.syspsi.exception.CadastroException;
import br.com.syspsi.model.Util;
import br.com.syspsi.model.dto.InPsicologoDTO;
import br.com.syspsi.model.entity.Convenio;
import br.com.syspsi.model.entity.GrupoPaciente;
import br.com.syspsi.model.entity.Paciente;
import br.com.syspsi.model.entity.Permissao;
import br.com.syspsi.model.entity.Psicologo;
import br.com.syspsi.model.entity.PsicologoTemPermissao;
import br.com.syspsi.repository.ConvenioRepositorio;
import br.com.syspsi.repository.GrupoPacienteRepositorio;
import br.com.syspsi.repository.PacienteRepositorio;
import br.com.syspsi.repository.PermissaoRepositorio;
import br.com.syspsi.repository.PsicologoRepositorio;
import br.com.syspsi.repository.PsicologoTemPermissaoRepositorio;

@RestController
public class CadastroController {
	@Autowired
	private ConvenioRepositorio convenioRepositorio;
	
	@Autowired
	private PacienteRepositorio pacienteRepositorio;
	
	@Autowired
	private PsicologoRepositorio psicologoRepositorio;
	
	@Autowired
	private GrupoPacienteRepositorio grupoPacienteRepositorio;
	
	@Autowired
	private PsicologoTemPermissaoRepositorio psicologoTemPermissaoRepositorio;
	
	@Autowired
	private PermissaoRepositorio permissaoRepositorio;
	
	private static final Logger logger = LoggerFactory.getLogger(CadastroController.class);	
	private static void logMessage(String msg, boolean error) {
    	if(!error){
    		logger.debug(msg);
    	}

    	//logs an error message with parameter
    	if (error) {
    		logger.error(msg);
    	}
    }
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConveniosAtivos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConveniosAtivos() throws Exception {
		try {
			return this.convenioRepositorio.findByAtivo(true);
		} catch(Exception ex) {
			logMessage("listarConveniosAtivos - erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar os convênios ativos.");
		}
	}
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConveniosInativos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConveniosInativos() throws Exception {
		try {
			return this.convenioRepositorio.findByAtivo(false);
		} catch(Exception ex) {
			logMessage("listarConveniosInativos - erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar os convênios inativos.");
		}
	}
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarConvenios", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<Convenio> listarConvenios() throws Exception {
		try {
			return (List<Convenio>) this.convenioRepositorio.findAll();
		} catch(Exception ex) {
			logMessage("listarConvenios - erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar os convênios.");
		}
	}
	
	/**
	 * @return uma lista de convênios ativos cadastrados no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/listarGruposPacientes", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE					
			)		
	public List<GrupoPaciente> listarGruposPacientes() throws Exception {
		try {
			return (List<GrupoPaciente>) this.grupoPacienteRepositorio.findAll();
		} catch(Exception ex) {
			logMessage("listarGruposPacientes - erro: " + ex.getMessage(), true);
			throw new Exception("Não foi possível listar os grupos de pacientes.");
		}
	}
	
	/**
	 * Salva um paciente no BD
	 * @param paciente o paciente a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Paciente salvarPaciente(@RequestBody Paciente paciente, Principal user) throws Exception {			
		try {
			if (user == null) {
				logMessage("salvarPaciente - user null!", true);
				throw new Exception("Erro ao salvar o paciente: psicólogo não informado.");
			}
			
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			paciente.setPsicologo(psicologo);
			if (paciente.getPsicologo() != null) {			
				if (paciente.getCpf() != null && !paciente.getCpf().trim().isEmpty()) {
					try {
						Util.validarCPF(paciente.getCpf());
					} catch(Exception ex) {
						logMessage("salvarPaciente - CPF " + paciente.getCpf() + " do paciente é inválido", true);
						throw new CadastroException("O CPF do paciente é inválido!");
					}
				}
				
				if (paciente.getCpfResponsavel() != null && !paciente.getCpfResponsavel().trim().isEmpty()) {
					try {
						Util.validarCPF(paciente.getCpfResponsavel());
					} catch(Exception ex) {
						logMessage("salvarPaciente - CPF " + paciente.getCpfResponsavel() + " do responsável é inválido", true);
						throw new CadastroException("O CPF do responsável é inválido!");
					}
				}
				
				Paciente novoPaciente = (Paciente) this.pacienteRepositorio.save(paciente);
				logMessage("salvarPaciente - cadastro do paciente " + novoPaciente.getNomeExibicao() + " realizado com sucesso!", false);
				
				try {
					return novoPaciente;
				} catch (DataIntegrityViolationException e) {
					if (e.getMessage().toLowerCase().contains("cpf")) {
						logMessage("salvarPaciente - CPF já cadastrado!", true);
						throw new CadastroException("O CPF informado já está cadastrado.");
					} else {
						logMessage("salvarPaciente - erro ao salvar o paciente: " + e.getMessage(), true);
						throw new CadastroException("Erro ao salvar o paciente.");
					}
				} 
			} else {
				logMessage("salvarPaciente: psicologo null!", true);
				throw new Exception("Erro ao salvar o paciente: psicólogo não informado.");
			}
		} catch(CadastroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("salvarPaciente - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao salvar o paciente: psicólogo não informado.");
		}
	}
	
	@RequestMapping(
			value = "/listarPacientesAtivosInativos", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Paciente> listarPacientesAtivosInativos(@RequestParam("ativo") Boolean ativo, 
			Principal user) throws Exception {		
		try {
			if (user == null) {
				logMessage("user null!", true);
				throw new CadastroException("Erro ao listar pacientes: psicólogo não informado.");
			}
			
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			List<Paciente> lstPacientes = (List<Paciente>) this.pacienteRepositorio.findByAtivoAndPsicologoOrderByNomeCompletoAsc(ativo, psicologo);			
			return lstPacientes;
		} catch(CadastroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("listarPacientesAtivosInativos - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao listar pacientes.");
		}
	}
	
	@RequestMapping(
			value = "/listarPacientes", 
			method={RequestMethod.GET},
			produces = MediaType.APPLICATION_JSON_VALUE			
			)
	public List<Paciente> listarPacientes(Principal user) throws Exception {		
		try {
			if (user == null) {
				logMessage("user null!", true);
				throw new CadastroException("Erro ao listar pacientes: psicólogo não informado.");
			}
			
			Psicologo psicologo = this.psicologoRepositorio.findByLogin(user.getName());
			List<Paciente> lstPacientes = (List<Paciente>) this.pacienteRepositorio.findByPsicologoOrderByNomeCompletoAsc(psicologo);
			logMessage("CadastroController.listarPacientes: fim", false);
			return lstPacientes;
		} catch(CadastroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("listarPacientes - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao listar pacientes.");
		}
	}
	
	@RequestMapping(
			value = "/excluirPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void excluirPaciente(@RequestBody Paciente paciente) throws Exception {
		try {
			if (paciente != null) {
				this.pacienteRepositorio.delete(paciente);			
				logMessage("Paciente id " + paciente.getId() + " e nome exibição " + paciente.getNomeExibicao() + " removido com sucesso", false);
			} else {
				logMessage("Paciente nulo", true);
				throw new CadastroException("Não foi possível remover o paciente");
			}
		} catch(CadastroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("excluirPaciente - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao remover o paciente.");
		}
	}
	
	@RequestMapping(
			value = "/atualizarPaciente", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void atualizarPaciente(@RequestBody Paciente paciente) throws Exception {
		try {
			this.pacienteRepositorio.save(paciente);		
		} catch(Exception ex) {
			logMessage("atualizarPaciente - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao atualizar o paciente.");
		}
	}
	
	/**
	 * Salva um psicologo no BD
	 * @param psicologo o psicologo a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarPsicologo", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Psicologo salvarPsicologo(@RequestBody InPsicologoDTO inPsicologoDTO) throws Exception {		
		try {
			Psicologo psicologo = inPsicologoDTO.getPsicologo();
			psicologo.setSenha((new BCryptPasswordEncoder().encode(inPsicologoDTO.getSenha())).getBytes());
					
			Psicologo psi = this.psicologoRepositorio.findByLogin(psicologo.getLogin());
			if (psi != null) {
				logMessage("salvarPsicologo - Psicólogo já cadastrador", true);
				throw new CadastroException("Usuário já cadastrado!");
			}
			
			if (psicologo.getCpf() != null && !psicologo.getCpf().trim().isEmpty()) {
				try {
					Util.validarCPF(psicologo.getCpf());
				} catch(Exception ex) {
					logMessage("salvarPsicologo - CPF " + psicologo.getCpf() + " do psicólogo é inválido", true);
					throw new CadastroException("O CPF é inválido!");
				}
			}
					
			psicologo.setChave(Util.gerarChave().getBytes());		
			psicologo.setId(this.psicologoRepositorio.getNextId());		
				
			try {
				Permissao permissao = this.permissaoRepositorio.findByNome("PSICOLOGO".toUpperCase());
				if (permissao != null) {			
					Psicologo novoPsicologo = (Psicologo) this.psicologoRepositorio.save(psicologo);
					logMessage("salvarPsicologo - Cadastro do psicologo " + novoPsicologo.getLogin() + " realizado com sucesso!", false);						
					
					PsicologoTemPermissao psicologoTemPermissao = new PsicologoTemPermissao(novoPsicologo, permissao, Calendar.getInstance());
					this.psicologoTemPermissaoRepositorio.save(psicologoTemPermissao);
					
					return novoPsicologo;
				} 
				logMessage("salvarPsicologo - Permissao não encontrada!", true);
				throw new CadastroException("Não foi possível cadastrar o psicólogo.");
			} catch (DataIntegrityViolationException e) {
				if (e.getMessage().toLowerCase().contains("cpf")) {
					logMessage("salvarPsicologo - CPF já cadastrado!", true);
					throw new CadastroException("O CPF informado já está cadastrado.");
				} else if (e.getMessage().toLowerCase().contains("crp")) {
					logMessage("salvarPsicologo - CRP já cadastrado!", true);
					throw new CadastroException("O CRP informado já está cadastrado.");
				} else {
					logMessage("salvarPsicologo - erro ao salvar o psicologo: " + e.getMessage(), true);
					throw new CadastroException("Erro ao salvar o psicologo.");
				}
			} 	
		} catch(CadastroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("salvarPsicologo - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao salvar o psicólogo.");
		}
	}
	
	/**
	 * Salva um convênio no BD
	 * @param paciente o paciente a ser persistido no BD
	 * @throws Exception caso algum problema ocorra
	 */
	@RequestMapping(
			value = "/salvarConvenio", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public Convenio salvarConvenio(@RequestBody Convenio convenio) throws Exception {
		try {				
			if (convenio.getCnpj() != null && !convenio.getCnpj().trim().isEmpty()) {
				try {
					Util.validarCNPJ(convenio.getCnpj());
				} catch(Exception ex) {
					logMessage("salvarConvenio - CNPJ " + convenio.getCnpj() + " inválido", true);
					throw new CadastroException(ex.getMessage());
				}
			}
				
			try {
				convenio = (Convenio) this.convenioRepositorio.save(convenio);
				
				logMessage("salvarConvenio - cadastro do convenio " + convenio.getNome() + " realizado com sucesso!", false);				
				return convenio;
			} catch (DataIntegrityViolationException e) {
				if (e.getMessage().toLowerCase().contains("cnpj")) {
					logMessage("salvarConvenio - CNPJ já cadastrado!", true);
					throw new CadastroException("O CNPJ informado já está cadastrado.");
				} else {
					logMessage("salvarConvenio - erro ao salvar o Convênio: " + e.getMessage(), true);
					throw new CadastroException("Erro ao salvar o convênio.");
				}
			} 
		} catch(CadastroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("salvarConvenio - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao salvar o convênio.");
		}
	}
	
	@RequestMapping(
			value = "/atualizarConvenio", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void atualizarConvenio(@RequestBody Convenio convenio) throws Exception {
		try {
			this.convenioRepositorio.save(convenio);
		} catch(Exception ex) {
			logMessage("atualizarConvenio - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao atualizar o convênio.");
		}
	}
	
	@RequestMapping(
			value = "/excluirConvenio", 
			method={RequestMethod.POST},
			produces = MediaType.APPLICATION_JSON_VALUE,
			consumes = MediaType.APPLICATION_JSON_VALUE
			)
	public void excluirConvenio(@RequestBody Convenio convenio) throws Exception {
		try {
			if (convenio != null) {
				this.convenioRepositorio.delete(convenio);			
				logMessage("excluirConvenio - Convenio id " + convenio.getId() + " e nome " + convenio.getNome() + " removido com sucesso", false);
			} else {
				logMessage("excluirConvenio - Convenio nulo", true);
				throw new CadastroException("Não foi possível excluir o convenio");
			}
		} catch(CadastroException ex) {
			throw new Exception(ex.getMessage());
		} catch(Exception ex) {
			logMessage("excluirConvenio - erro: " + ex.getMessage(), true);
			throw new Exception("Erro ao excluir o convênio.");
		}
	}
}
