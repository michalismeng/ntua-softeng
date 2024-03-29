import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { LoginComponent } from './login/login.component';
import { CoffeeComponent } from './coffee/coffee.component';
import { RegisterComponent } from './register/register.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotfoundComponent } from './notfound/notfound.component';
import { CrouwdsourcerOnlyGuard } from 'src/guards/crouwdsourcer-only.guard';
import { AdminOnlyGuard } from 'src/guards/admin-only.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'coffee', component: CoffeeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },

  {
    path: 'admin',
    loadChildren: './admin/admin.module#AdminModule',
    canActivate: [AdminOnlyGuard]
  },
  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',
    canActivate: [CrouwdsourcerOnlyGuard]
  },

  { path: 'unauthorized', component: UnauthorizedComponent },
  { path: 'notfound', component: NotfoundComponent },

  { path: '**', redirectTo: 'notfound' }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
