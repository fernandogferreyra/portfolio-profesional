import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AboutComponent } from './components/about/about.component';
import { AdminLoginModalComponent } from './components/admin-login-modal/admin-login-modal.component';
import { ContactComponent } from './components/contact/contact.component';
import { ControlCenterComponent } from './components/control-center/control-center.component';
import { ControlCenterBudgetBuilderComponent } from './components/control-center-budget-builder/control-center-budget-builder.component';
import { ControlCenterEstimatorComponent } from './components/control-center-estimator/control-center-estimator.component';
import { ControlCenterMessagesComponent } from './components/control-center-messages/control-center-messages.component';
import { ControlCenterUpdateComponent } from './components/control-center-update/control-center-update.component';
import { ControlCenterQuoteComponent } from './components/control-center-quote/control-center-quote.component';
import { ControlCenterQuoteMetricsComponent } from './components/control-center-quote-metrics/control-center-quote-metrics.component';
import { ControlCenterSiteActivityComponent } from './components/control-center-site-activity/control-center-site-activity.component';
import { CredentialsComponent } from './components/credentials/credentials.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { HomeComponent } from './components/home/home.component';
import { HomeProjectShowcaseComponent } from './components/home-project-showcase/home-project-showcase.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { SkillsComponent } from './components/skills/skills.component';
import { RevealOnScrollDirective } from './directives/reveal-on-scroll.directive';
import { AuthInterceptor } from './interceptors/auth.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    AdminLoginModalComponent,
    HeaderComponent,
    FooterComponent,
    HomeComponent,
    HomeProjectShowcaseComponent,
    AboutComponent,
    ProjectsComponent,
    SkillsComponent,
    ContactComponent,
    CredentialsComponent,
    ControlCenterComponent,
    ControlCenterBudgetBuilderComponent,
    ControlCenterMessagesComponent,
    ControlCenterUpdateComponent,
    ControlCenterQuoteComponent,
    ControlCenterEstimatorComponent,
    ControlCenterQuoteMetricsComponent,
    ControlCenterSiteActivityComponent,
    RevealOnScrollDirective,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
