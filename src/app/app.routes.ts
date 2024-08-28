import { Routes } from '@angular/router';
import { LoginComponent } from './landingpage/login/login.component';
import { RegisterComponent } from './landingpage/login/register/register.component';
import { RegistrationConfirmationComponent } from './landingpage/login/register/registration-confirmation/registration-confirmation.component';
import { VideoSiteComponent } from './landingpage/video-site/video-site.component';
import { LandingpageComponent } from './landingpage/landingpage.component';
import { ImprintComponent } from './landingpage/imprint/imprint/imprint.component';
import { PrivacyPolicyComponent } from './landingpage/imprint/privacy-policy/privacy-policy.component';
import { EmailExistsComponent } from './landingpage/login/register/email-exists/email-exists.component';

import { PasswordResetComponent } from './landingpage/login/password-reset/password-reset.component';
import { EmailSendComponent } from './landingpage/login/email-sent/email-send.component';
import { ProfileDetailsComponent } from './landingpage/video-site/profile-details/profile-details.component';
import { VideoCategoryComponent } from './landingpage/video-site/video-category/video-category.component';
import { FavoritesComponent } from './landingpage/video-site/favorites/favorites.component';



export const routes: Routes = [
    { path: '', component: LandingpageComponent },
    { path: 'landingpage', component: LandingpageComponent },
    { path: 'login', component: LoginComponent },
    { path: 'password_reset/:uid/:token', component: PasswordResetComponent },
    { path: 'email-send', component: EmailSendComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'registration_confirmation', component: RegistrationConfirmationComponent },
    { path: 'video_site', component: VideoSiteComponent },
    { path: 'imprint', component: ImprintComponent },
    { path: 'privacy_policy', component: PrivacyPolicyComponent },
    { path: 'email_exists', component: EmailExistsComponent },
    { path: 'profile_details', component: ProfileDetailsComponent },
    { path: 'video_categorys/:category', component: VideoCategoryComponent },
    { path: 'favorites', component: FavoritesComponent },
];

// @NgModule({
//     imports: [RouterModule.forRoot(routes)],
//     exports: [RouterModule]
//   })
//   export class AppRoutingModule {}

// { path: 'video_site', component: VideoSiteComponent, children: [
//     { path: 'video_categorys/:category', component: VideoCategoryComponent, outlet: 'videoContent' },
//     { path: 'profile_details', component: ProfileDetailsComponent }
// ]},