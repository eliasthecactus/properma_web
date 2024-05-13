import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { ErrorComponent } from './pages/error/error.component';
import { CockpitComponent } from './pages/cockpit/cockpit.component';
import { UsermgtComponent } from './pages/usermgt/usermgt.component';
import { ProjectmgtComponent } from './pages/projectmgt/projectmgt.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { ContactComponent } from './pages/contact/contact.component';
import { SkillsmgtComponent } from './pages/skillsmgt/skillsmgt.component';
import { RegisterComponent } from './pages/register/register.component';
import { PlanerComponent } from './pages/planer/planer.component';


export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'login', component: LoginComponent },
    { path: 'cockpit', component: CockpitComponent, children: [
        {path: '', redirectTo: 'dashboard', pathMatch: 'full'},
        {path: 'dashboard', component: DashboardComponent},
        {path: 'planer', component: PlanerComponent},
        {path: 'usermgt', component: UsermgtComponent },
        {path: 'projectmgt', component: ProjectmgtComponent},
        {path: 'skillsmgt', component: SkillsmgtComponent},
        {path: 'settings', component: SettingsComponent},
        {path: 'contact', component: ContactComponent},
        {path: '**', redirectTo: 'dashboard', pathMatch: 'full'}
    ]},
    { path: 'register', component: RegisterComponent },
    { path: "**", component: ErrorComponent },
];
