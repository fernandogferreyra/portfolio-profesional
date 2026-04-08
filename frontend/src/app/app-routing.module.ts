import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContactComponent } from './components/contact/contact.component';
import { ControlCenterComponent } from './components/control-center/control-center.component';
import { CredentialsComponent } from './components/credentials/credentials.component';
import { HomeComponent } from './components/home/home.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'about', redirectTo: '', pathMatch: 'full' },
  { path: 'projects', component: ProjectsComponent },
  { path: 'skills', component: SkillsComponent },
  { path: 'credentials', component: CredentialsComponent },
  { path: 'tech-stack', redirectTo: 'skills', pathMatch: 'full' },
  { path: 'contact', component: ContactComponent },
  { path: 'control-center', component: ControlCenterComponent, canActivate: [authGuard] },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      anchorScrolling: 'enabled',
      scrollPositionRestoration: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
