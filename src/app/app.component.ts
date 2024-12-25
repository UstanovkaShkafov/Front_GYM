import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Для работы с *ngIf
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'Training App';
  isLoggedIn = false; // Следит за статусом авторизации
  isAdmin = false; // Проверка роли admin


  constructor(private router: Router) {}

  ngOnInit() {
    this.checkLoginStatus(); // Проверяем статус авторизации при загрузке
  }

  // Проверка статуса авторизации
  checkLoginStatus() {
    const token = localStorage.getItem('authToken'); // Проверяем токен
    const role = localStorage.getItem('authRole'); // Проверяем роль
    this.isLoggedIn = !!token; // Пользователь авторизован, если токен существует
    this.isAdmin = role === 'admin'; // Проверяем, является ли пользователь администратором
  }

  // Выход из аккаунта
  logout() {
    localStorage.removeItem('authToken');
    localStorage.removeItem('authRole');
    this.isLoggedIn = false;
    this.isAdmin = false;
    this.router.navigate(['/']); // Возвращаемся на главную страницу
  }

    // Переход в панель администратора
    goToAdminPanel() {
      if (this.isAdmin) {
        this.router.navigate(['/admin']); // Переход на страницу админа
      }
    }
}
