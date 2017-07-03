package br.com.syspsi;

import java.util.Locale;
import java.util.TimeZone;

import javax.annotation.PostConstruct;
import javax.crypto.BadPaddingException;
import javax.crypto.IllegalBlockSizeException;
import javax.sql.DataSource;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.autoconfigure.jdbc.DataSourceBuilder;
import org.springframework.boot.autoconfigure.security.SecurityProperties;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.support.SpringBootServletInitializer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.csrf.CookieCsrfTokenRepository;
import org.springframework.web.servlet.LocaleResolver;
import org.springframework.web.servlet.i18n.FixedLocaleResolver;

import br.com.syspsi.model.Util;

@SpringBootApplication
@EntityScan(basePackages = {
        "br.com.syspsi.model.entity"
})
@EnableJpaRepositories(basePackages = {
        "br.com.syspsi.repository"
})
public class SysPsiApplication extends SpringBootServletInitializer {

	@Value("${spring.datasource.url}")
	private String dbUrl;

	@Value("${spring.datasource.username}")
	private String dbUsername;

	@Value("${spring.datasource.password}")
	private String dbPassword;
	
	private final static Logger logger = Logger.getLogger(SysPsiApplication.class);
	
	@PostConstruct
	void started() {
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	}
	
	@Bean
	public DataSource dataSource() throws Exception {							
		try {
			String plainText = Util.decrypt(this.dbPassword);
			DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
	    	dataSourceBuilder.url(dbUrl);
	       	dataSourceBuilder.username(dbUsername);
	       	dataSourceBuilder.password(plainText);
	        	
	       	return dataSourceBuilder.build();
		} catch (IllegalBlockSizeException ex) {
			logger.error("Erro ao descriptografar password do arquivo application.yml: " + ex.getMessage());
			throw new Exception();
		} catch(BadPaddingException ex) {
			logger.error("Erro no acesso ao BD: " + "password inválido no arquivo application.yml!");
			throw new Exception();
		}		
	}
	
	@Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder application) {
        return application.sources(SysPsiApplication.class);
    }
	
	public static void main(String[] args) {
		SpringApplication.run(SysPsiApplication.class, args);
	}
	
	@Bean
	public LocaleResolver localeResolver() {
		return new FixedLocaleResolver(new Locale("pt", "BR"));
	}
	
	@Configuration
	@Order(SecurityProperties.ACCESS_OVERRIDE_ORDER)
	protected static class SecurityConfiguration extends WebSecurityConfigurerAdapter {
		private static final String USUARIO_POR_LOGIN = "SELECT login, senha, ativo FROM psicologo "
	            + "WHERE login = ?";
		
		private static final String PERMISSAO_POR_USUARIO = "SELECT u.login, p.nome FROM psicologo_tem_permissao up "
	            + "JOIN psicologo u ON u.id = up.idPsicologo "
	            + "JOIN permissao p ON p.id = up.idPermissao "
	            + "WHERE u.login = ?";
		
		@Autowired
		private DataSource dataSource;	
		
		@Override	
		protected void configure(HttpSecurity http) throws Exception {			
			// Para qualquer requisição (anyRequest) é preciso estar 
	        // autenticado (authenticated).
			http							
				.httpBasic().and()
				.authorizeRequests()
					.antMatchers("/lib/**", "/js/**", "/", "/index.html", 
							"/cadastrar_psicologo.html", "/salvarPsicologo").permitAll()
					.anyRequest().authenticated().and()								
				.formLogin().loginPage("/index.html")					
					.usernameParameter("login")
					.passwordParameter("senha").and()				 
				.logout().and()								
				.requiresChannel()
					.anyRequest()
					.requiresSecure().and()				
				.csrf()
		        	.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse());	
				
		}	
		
		@Override
		public void configure(AuthenticationManagerBuilder builder) throws Exception {						
			builder
	        	.jdbcAuthentication()
	        		.dataSource(dataSource)
	        		.passwordEncoder(new BCryptPasswordEncoder())
	        		.usersByUsernameQuery(USUARIO_POR_LOGIN) 
	        		.authoritiesByUsernameQuery(PERMISSAO_POR_USUARIO)
	        	.rolePrefix("ROLE_");
		}
	}
}
