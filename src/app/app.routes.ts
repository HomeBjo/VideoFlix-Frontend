import { Routes } from '@angular/router';
import { LoginComponent } from './landingpage/login/login.component';
import { RegisterComponent } from './landingpage/login/register/register.component';
import { RegistrationConfirmationComponent } from './landingpage/login/register/registration-confirmation/registration-confirmation.component';
import { VideoSiteComponent } from './landingpage/video-site/video-site.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ImprintComponent } from './landingpage/imprint/imprint/imprint.component';
import { PrivacyPolicyComponent } from './landingpage/imprint/privacy-policy/privacy-policy.component';


export const routes: Routes = [
    { path: '', component: LandingpageComponent },
    { path: 'landingpage', component: LandingpageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'registration_confirmation', component: RegistrationConfirmationComponent },
    { path: 'video_site', component: VideoSiteComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy_policy', component: PrivacyPolicyComponent },
];