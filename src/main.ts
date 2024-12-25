import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // Для HttpClient
import { AppComponent } from './app/app.component';
import { LoginComponent } from './app/login/login.component';
import { TrainingsComponent } from './app/trainings/trainings.component';
import { HomeComponent } from './app/home/home.component';
import { TrainingDetailsComponent } from './app/training-details/training-details.component';
import { AdminPanelComponent } from './app/admin-panel/admin-panel.component'; // Импортируем компонент для админов
import { AuthGuard } from './app/auth.guard'; // Импортируем Guard

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(
      [
        { path: '', component: HomeComponent },
        { path: 'login', component: LoginComponent },
        { path: 'trainings', component: TrainingsComponent },
        { path: 'training/:id', component: TrainingDetailsComponent },
        {
          path: 'admin',
          component: AdminPanelComponent,
          canActivate: [AuthGuard], 
        },
      ],
      withComponentInputBinding()
    ),
    provideHttpClient(),
  ],
}).catch((err) => console.error(err));
