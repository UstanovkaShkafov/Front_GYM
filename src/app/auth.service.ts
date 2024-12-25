import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Сервис будет доступен в любом месте приложения
})
export class AuthService {
  private isLoggedIn = false; // Переменная для отслеживания авторизации

  constructor() {
    this.checkLoginStatus(); // Проверяем токен при загрузке
  }

  // Проверяем, авторизован ли пользователь
  checkLoginStatus() {
    const token = localStorage.getItem('authToken'); // Получаем токен из localStorage
    this.isLoggedIn = !!token; // Если токен существует, пользователь авторизован
  }

  // Получить текущий статус авторизации
  getAuthStatus(): boolean {
    return this.isLoggedIn;
  }

  // Вход в аккаунт
  login(token: string) {
    localStorage.setItem('authToken', token); // Сохраняем токен в localStorage
    this.isLoggedIn = true; // Обновляем статус авторизации
  }

  // Выход из аккаунта
  logout() {
    localStorage.removeItem('authToken'); // Удаляем токен из localStorage
    this.isLoggedIn = false; // Обновляем статус авторизации
  }
}
