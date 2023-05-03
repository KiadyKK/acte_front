import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';
import { DesactivationComponent } from './components/desactivation/desactivation.component';
import { LoginComponent } from './components/login/login.component';
import { ValidationMetierComponent } from './components/validation-metier/validation-metier.component';
import { ValidationTechniqueComponent } from './components/validation-technique/validation-technique.component';
import { ActivationComponent } from './components/activation/activation.component';
import { TakeoverComponent } from './components/takeover/takeover.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
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
    path: 'takeover',
    component: TakeoverComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'metier',
    component: ValidationMetierComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'technique',
    component: ValidationTechniqueComponent,
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'desactivation', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
