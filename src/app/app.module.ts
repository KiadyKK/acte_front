import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { SpinnerComponent } from './shared/spinner/spinner.component';
import { BodyComponent } from './components/body/body.component';
import { DesactivationComponent } from './components/desactivation/desactivation.component';
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
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ModalListeServicesComponent } from './components/activation/modal-liste-services/modal-liste-services.component';
import { ModalChecklisteServicesComponent } from './components/activation/modal-checkliste-services/modal-checkliste-services.component';
import { TakeoverComponent } from './components/takeover/takeover.component';
import { ModifyFieldsComponent } from './components/modify-fields/modify-fields.component';
import { ModalResultComponent } from './components/activation/modal-result/modal-result.component';
import { ModalResumeComponent } from './shared/modal-resume/modal-resume.component';
import { ModalLogComponent } from './components/validation-metier/modal-log/modal-log.component';
import { ModalRetourCxComponent } from './components/validation-metier/modal-retour-cx/modal-retour-cx.component';
import { ModalSavingComponent } from './shared/modal-saving/modal-saving.component';
import { ModalValidationComponent } from './components/validation-metier/modal-validation/modal-validation.component';
import { ModalRejectComponent } from './components/validation-metier/modal-reject/modal-reject.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { ModalAlertComponent } from './shared/modal-alert/modal-alert.component';
import { ReengagementComponent } from './components/reengagement/reengagement.component';
import { LimitConsoComponent } from './components/limit-conso/limit-conso.component';
import { SuspensionComponent } from './components/suspension/suspension.component';
import { RevokeComponent } from './components/revoke/revoke.component';
import { ForfaitComponent } from './components/forfait/forfait.component';
import { AjoutServiceComponent } from './components/ajout-service/ajout-service.component';
import { ModalResumeAjoutComponent } from './components/ajout-service/modal-resume-ajout/modal-resume-ajout.component';
import { ChgmtServiceComponent } from './components/chgmt-service/chgmt-service.component';
import { ModalResumeChgmtComponent } from './components/chgmt-service/modal-resume-chgmt/modal-resume-chgmt.component';
import { ModifStatusServiceComponent } from './components/modif-status-service/modif-status-service.component';
import { ModalResumeStatusComponent } from './components/modif-status-service/modal-resume-status/modal-resume-status.component';
import { ModalResumeTakeoverComponent } from './components/takeover/modal-resume-takeover/modal-resume-takeover.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DesactivationComponent,
    BodyComponent,
    SidenavComponent,
    ValidationMetierComponent,
    SpinnerComponent,
    WidgetComponent,
    ValidationTechniqueComponent,
    ActivationComponent,
    ModalListeServicesComponent,
    ModalChecklisteServicesComponent,
    TakeoverComponent,
    ModifyFieldsComponent,
    ModalResultComponent,
    ModalResumeComponent,
    ModalLogComponent,
    ModalRetourCxComponent,
    ModalSavingComponent,
    ModalValidationComponent,
    ModalRejectComponent,
    ModalAlertComponent,
    ReengagementComponent,
    LimitConsoComponent,
    SuspensionComponent,
    RevokeComponent,
    ForfaitComponent,
    AjoutServiceComponent,
    ModalResumeAjoutComponent,
    ChgmtServiceComponent,
    ModalResumeChgmtComponent,
    ModifStatusServiceComponent,
    ModalResumeStatusComponent,
    ModalResumeTakeoverComponent,
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
    NgbModule
  ],
  providers: [authInterceptorProviders, spinnerInterceptorProviders, BnNgIdleService],
  bootstrap: [AppComponent],
})
export class AppModule {}
