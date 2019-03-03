import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { CoffeeComponent } from './coffee/coffee.component';
import { SERVICE_PROVIDERS } from 'src/services/service.export';
import { LogoutComponent } from './logout/logout.component';
import { SharedModule } from './shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './register/register.component';
import { TokenInterceptor } from 'src/infrastructure/token.interceptor';

@NgModule({
	declarations: [
		AppComponent,
		HomeComponent,
		AboutComponent,
		LoginComponent,
		CoffeeComponent,
		LogoutComponent,
		RegisterComponent,
	],
	imports: [
		BrowserModule,
		AppRoutingModule,
		HttpClientModule,
		SharedModule,
		ReactiveFormsModule,
		FormsModule
	],
	providers: [
		SERVICE_PROVIDERS,
		{
			provide: HTTP_INTERCEPTORS,
			useClass: TokenInterceptor,
			multi: true
		},
	],
	bootstrap: [AppComponent]
})
export class AppModule { }
