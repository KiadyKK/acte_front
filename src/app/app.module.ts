import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { BodyComponent } from './components/body/body.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { DesactivationComponent } from './components/desactivation/desactivation.component';
import { HomeComponent } from './components/home/home.component';
import { SidenavComponent } from './components/sidenav/sidenav.component';
import { ValidationMetierComponent } from './components/validation-metier/validation-metier.component';
import { authInterceptorProviders } from './helpers/auth.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntlModule } from '@progress/kendo-angular-intl';
import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { LabelModule } from '@progress/kendo-angular-label';
import { ButtonsModule } from '@progress/kendo-angular-buttons';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { spinnerInterceptorProviders } from './helpers/spinner.interceptor';
import { WidgetComponent } from './components/widget/widget.component';
import { ValidationTechniqueComponent } from './components/validation-technique/validation-technique.component';
import { ActivationComponent } from './components/activation/activation.component';
import { NgbAccordionModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalListeServicesComponent } from './components/activation/modal-liste-services/modal-liste-services.component';
import { ModalChecklisteServicesComponent } from './components/activation/modal-checkliste-services/modal-checkliste-services.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    DesactivationComponent,
    BodyComponent,
    SidenavComponent,
    DashboardComponent,
    ValidationMetierComponent,
    SpinnerComponent,
    WidgetComponent,
    ValidationTechniqueComponent,
    ActivationComponent,
    ModalListeServicesComponent,
    ModalChecklisteServicesComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    IntlModule,
    DateInputsModule,
    LabelModule,
    ButtonsModule,
    MatProgressSpinnerModule,
    NgbAccordionModule
  ],
  providers: [authInterceptorProviders, spinnerInterceptorProviders],
  bootstrap: [AppComponent],
})
export class AppModule {}
