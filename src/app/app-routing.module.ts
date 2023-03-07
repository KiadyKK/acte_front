import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DesactivationComponent } from './components/desactivation/desactivation.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'desactivation', component: DesactivationComponent, canActivate: [AuthGuard] },
  { path: '', redirectTo: 'desactivation', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
