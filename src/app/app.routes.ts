import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './login/register/register.component';
import { RegistrationConfirmationComponent } from './login/register/registration-confirmation/registration-confirmation.component';
import { VideoSiteComponent } from './video-site/video-site.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'registration_confirmation', component: RegistrationConfirmationComponent },
    { path: 'video_site', component: VideoSiteComponent },
];