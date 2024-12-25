import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Для работы с формами
import { CommonModule } from '@angular/common'; // Для *ngIf и других директив

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = ''; // Для отображения ошибки

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    // Убираем сообщение об ошибке при новом запросе
    this.errorMessage = '';

    // Отправляем POST-запрос для авторизации
    this.http.post('https://localhost:7242/api/auth/login', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (response: any) => {
        console.log('Успешный вход', response);

        // Проверяем наличие токена и обязательных полей в ответе
        if (response.token && response.role && response.username && response.email) {
          // Сохраняем данные в localStorage
          localStorage.setItem('authToken', response.token);
          localStorage.setItem('authRole', response.role);
          localStorage.setItem('authUsername', response.username);
          localStorage.setItem('authEmail', response.email);

          // Перенаправляем в зависимости от роли
          if (response.role === 'admin') {
            this.router.navigate(['/admin']); // Админов отправляем на панель админа
          } else {
            this.router.navigate(['/trainings']); // Пользователей отправляем на страницу тренировок
          }
        } else {
          console.error('Некорректный формат данных авторизации:', response);
          this.errorMessage = 'Ошибка авторизации. Попробуйте снова.';
        }
      },
      error: (err) => {
        console.error('Ошибка авторизации:', err);
        // Сообщение об ошибке
        if (err.status === 401) {
          this.errorMessage = 'Неверный логин или пароль';
        } else {
          this.errorMessage = 'Произошла ошибка на сервере. Попробуйте позже.';
        }
      }
    });
  }
}
