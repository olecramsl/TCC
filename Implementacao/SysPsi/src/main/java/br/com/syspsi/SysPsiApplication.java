package br.com.syspsi;

import java.util.Locale;
import java.util.TimeZone;

import javax.annotation.PostConstruct;
import javax.sql.DataSource;

import org.springframework.beans.factory.annotation.Autowired;
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

@SpringBootApplication
@EntityScan(basePackages = {
        "br.com.syspsi.model.entity"
})
@EnableJpaRepositories(basePackages = {
        "br.com.syspsi.repository"
})
public class SysPsiApplication extends SpringBootServletInitializer {
	
	@PostConstruct
	void started() {
		TimeZone.setDefault(TimeZone.getTimeZone("America/Sao_Paulo"));
	}
	
	@Bean
	public DataSource dataSource() {
	    DataSourceBuilder dataSourceBuilder = DataSourceBuilder.create();
	        dataSourceBuilder.url("jdbc:mysql://localhost:3306/syspsi");
	        dataSourceBuilder.username("USERSYSPSIAPP");
	        dataSourceBuilder.password("@Rtu3v!xK0l#");
	        return dataSourceBuilder.build();   
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
		private static final String USUARIO_POR_LOGIN = "SELECT login, senha, ativo, nome FROM psicologo "
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
		        	.antMatchers("/lib/**", "/js/**", "/", "/index.html", "/templates/login.html", "/webjars/**").permitAll()
		        	.anyRequest().authenticated().and()
		        .logout().and()
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
