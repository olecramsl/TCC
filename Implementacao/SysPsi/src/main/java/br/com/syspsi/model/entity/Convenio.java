package br.com.syspsi.model.entity;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.InputMismatchException;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Convenio implements Serializable {
	private static final long serialVersionUID = 1L;
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	private Integer id;
	private String nome;
	private String cnpj;
	private String email;
	@Column(name="telefonecontato")
	private String telefoneContato;
	private String logradouro;
	private String complemento;
	private String bairro;
	private String localidade;
	private String uf;
	private String cep;
	@Column(name="valorconsultaindividual")
	private BigDecimal valorConsultaIndividual;
	@Column(name="valorconsultacasal")
	private BigDecimal valorConsultaCasal;
	@Column(name="valorconsultafamilia")
	private BigDecimal valorConsultaFamilia;
	private boolean ativo;
		
	/**
	 * @return the id
	 */
	public Integer getId() {
		return id;
	}
	
	/**
	 * @param id the id to set
	 */
	public void setId(Integer id) {
		this.id = id;
	}
	
	/**
	 * @return the nome
	 */
	public String getNome() {
		return nome;
	}
	
	/**
	 * @param nome the nome to set
	 */
	public void setNome(String nome) {
		this.nome = nome;
	}
	
	/**
	 * @return the cnpj
	 */
	public String getCnpj() {
		return cnpj;
	}
	
	/**
	 * @param cnpj the cnpj to set
	 */
	public void setCnpj(String cnpj) {
		this.cnpj = cnpj;
	}

	/**
	 * @return the email
	 */
	public String getEmail() {
		return email;
	}

	/**
	 * @param email the email to set
	 */
	public void setEmail(String email) {
		this.email = email;
	}

	/**
	 * @return the telefoneContato
	 */
	public String getTelefoneContato() {
		return telefoneContato;
	}

	/**
	 * @param telefoneContato the telefoneContato to set
	 */
	public void setTelefoneContato(String telefoneContato) {
		this.telefoneContato = telefoneContato;
	}

	/**
	 * @return the logradouro
	 */
	public String getLogradouro() {
		return logradouro;
	}

	/**
	 * @param logradouro the logradouro to set
	 */
	public void setLogradouro(String logradouro) {
		this.logradouro = logradouro;
	}

	/**
	 * @return the complemento
	 */
	public String getComplemento() {
		return complemento;
	}

	/**
	 * @param complemento the complemento to set
	 */
	public void setComplemento(String complemento) {
		this.complemento = complemento;
	}

	/**
	 * @return the bairro
	 */
	public String getBairro() {
		return bairro;
	}

	/**
	 * @param bairro the bairro to set
	 */
	public void setBairro(String bairro) {
		this.bairro = bairro;
	}

	/**
	 * @return the localidade
	 */
	public String getLocalidade() {
		return localidade;
	}

	/**
	 * @param localidade the localidade to set
	 */
	public void setLocalidade(String localidade) {
		this.localidade = localidade;
	}

	/**
	 * @return the uf
	 */
	public String getUf() {
		return uf;
	}

	/**
	 * @param uf the uf to set
	 */
	public void setUf(String uf) {
		this.uf = uf;
	}

	/**
	 * @return the cep
	 */
	public String getCep() {
		return cep;
	}

	/**
	 * @param cep the cep to set
	 */
	public void setCep(String cep) {
		this.cep = cep;
	}

	/**
	 * @return the valorConsultaIndividual
	 */
	public BigDecimal getValorConsultaIndividual() {
		return valorConsultaIndividual;
	}

	/**
	 * @param valorConsultaIndividual the valorConsultaIndividual to set
	 */
	public void setValorConsultaIndividual(BigDecimal valorConsultaIndividual) {
		this.valorConsultaIndividual = valorConsultaIndividual;
	}

	/**
	 * @return the valorConsultaCasal
	 */
	public BigDecimal getValorConsultaCasal() {
		return valorConsultaCasal;
	}

	/**
	 * @param valorConsultaCasal the valorConsultaCasal to set
	 */
	public void setValorConsultaCasal(BigDecimal valorConsultaCasal) {
		this.valorConsultaCasal = valorConsultaCasal;
	}

	/**
	 * @return the valorConsultaFamilia
	 */
	public BigDecimal getValorConsultaFamilia() {
		return valorConsultaFamilia;
	}

	/**
	 * @param valorConsultaFamilia the valorConsultaFamilia to set
	 */
	public void setValorConsultaFamilia(BigDecimal valorConsultaFamilia) {
		this.valorConsultaFamilia = valorConsultaFamilia;
	}

	/**
	 * @return the ativo
	 */
	public boolean isAtivo() {
		return ativo;
	}

	/**
	 * @param ativo the ativo to set
	 */
	public void setAtivo(boolean ativo) {
		this.ativo = ativo;
	}
	
	public boolean validarCNPJ(String cnpj) throws Exception {
		// considera-se erro CNPJ's formados por uma sequencia de numeros iguais
		if (cnpj.equals("00000000000000") || cnpj.equals("11111111111111") ||
			cnpj.equals("22222222222222") || cnpj.equals("33333333333333") ||
	        cnpj.equals("44444444444444") || cnpj.equals("55555555555555") ||
	        cnpj.equals("66666666666666") || cnpj.equals("77777777777777") ||
	        cnpj.equals("88888888888888") || cnpj.equals("99999999999999") ||
	       (cnpj.length() != 14)) {
			throw new Exception("O CNPJ informado é inválido!");
		}

	    char dig13, dig14;
	    int sm, i, r, num, peso;

	    try {
	    	// Calculo do 1o. Digito Verificador
	    	sm = 0;
	    	peso = 2;
	    	for (i=11; i>=0; i--) {
	    		// converte o i-ésimo caractere do CNPJ em um número:
	    		// por exemplo, transforma o caractere '0' no inteiro 0
	    		// (48 eh a posição de '0' na tabela ASCII)
	    		num = (int)(cnpj.charAt(i) - 48);
	    		sm = sm + (num * peso);
	    		peso = peso + 1;
	    		if (peso == 10) {	    			 
	    			peso = 2;
	    		}
	    	}

	    	r = sm % 11;
	    	if ((r == 0) || (r == 1)) {
	    		dig13 = '0';
	    	} else {
	    		dig13 = (char)((11-r) + 48);
	    	}

	    	// Calculo do 2o. Digito Verificador
	    	sm = 0;
	    	peso = 2;
	    	for (i=12; i>=0; i--) {
	    		num = (int)(cnpj.charAt(i)- 48);
	    		sm = sm + (num * peso);
	    		peso = peso + 1;
	    		if (peso == 10) {
	    			peso = 2;
	    		}
	    	}

	    	r = sm % 11;
	    	if ((r == 0) || (r == 1)) {
	    		dig14 = '0';
	    	} else {
	    		dig14 = (char)((11-r) + 48);
	    	}

	    	// Verifica se os dígitos calculados conferem com os dígitos informados.
	    	if ((dig13 == cnpj.charAt(12)) && (dig14 == cnpj.charAt(13))) {
	    		return(true);
	    	} else {
	    		throw new Exception("O CNPJ informado é inválido!");
	    	}
	    } catch (InputMismatchException erro) {
	    	throw new Exception("O CNPJ informado é inválido!");
	    }
	}
}
