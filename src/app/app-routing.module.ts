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
  { path: '', redirectTo: 'board', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
