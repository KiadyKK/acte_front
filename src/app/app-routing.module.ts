import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DesactivationComponent } from './components/desactivation/desactivation.component';
import { LoginComponent } from './components/login/login.component';
import { ValidationMetierComponent } from './components/validation-metier/validation-metier.component';
import { ValidationTechniqueComponent } from './components/validation-technique/validation-technique.component';
import { ActivationComponent } from './components/activation/activation.component';
import { TakeoverComponent } from './components/takeover/takeover.component';
import { ModifyFieldsComponent } from './components/modify-fields/modify-fields.component';
import { WidgetComponent } from './components/widget/widget.component';
import { ReengagementComponent } from './components/reengagement/reengagement.component';
import { LimitConsoComponent } from './components/limit-conso/limit-conso.component';
import { SuspensionComponent } from './components/suspension/suspension.component';
import { RevokeComponent } from './components/revoke/revoke.component';
import { ForfaitComponent } from './components/forfait/forfait.component';
import { AjoutServiceComponent } from './components/ajout-service/ajout-service.component';
import { ModifStatusServiceComponent } from './components/modif-status-service/modif-status-service.component';
import { PlanTarifaireComponent } from './components/plan-tarifaire/plan-tarifaire.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: 'board',
    component: WidgetComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'activation',
    component: ActivationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'desactivation',
    component: DesactivationComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'modify-fields',
    component: ModifyFieldsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'takeover',
    component: TakeoverComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'metier/:id',
    component: ValidationMetierComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'technique',
    component: ValidationTechniqueComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reengagement',
    component: ReengagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'limit-conso',
    component: LimitConsoComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'suspension',
    component: SuspensionComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'revoke',
    component: RevokeComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'forfait',
    component: ForfaitComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'ajout-service',
    component: AjoutServiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'modification-status-service',
    component: ModifStatusServiceComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'plan-tarifaire',
    component: PlanTarifaireComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'board', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
