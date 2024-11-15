import { Routes } from '@angular/router';
import {LoginComponent} from "./iam/pages/login/login.component";
import {PageNotFoundComponent} from "./public/pages/page-not-found/page-not-found.component";
import {HomeComponent} from "./public/pages/home/home.component";
import {RegisterComponent} from "./iam/pages/register/register.component";
import {SportSpacesComponent} from "./business/pages/sport-spaces/sport-spaces.component";
import {SubscriptionComponent} from "./business/pages/subscription/subscription.component";
import {RoomsComponent} from "./business/pages/rooms/rooms.component";
import {ProfileComponent} from "./business/pages/profile/profile.component";
import {RoomDetailComponent} from "./business/pages/room-detail/room-detail.component";
import {AuthGuard} from "./shared/services/auth.guard";
import {CorrectPaymentComponent} from "./public/pages/correct-payment/correct-payment.component";
import {ErrorPaymentComponent} from "./public/pages/error-payment/error-payment.component";

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: 'sport-spaces', component: SportSpacesComponent, canActivate: [AuthGuard] },
  { path: 'subscriptions', component: SubscriptionComponent, canActivate: [AuthGuard] },
  { path: 'rooms', component: RoomsComponent, canActivate: [AuthGuard] },
  { path: 'room-detail/:id', component: RoomDetailComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterComponent },
  { path: 'correct-payment', component: CorrectPaymentComponent },
  { path: 'error-payment', component: ErrorPaymentComponent },
  { path: '**', component: PageNotFoundComponent }
];
