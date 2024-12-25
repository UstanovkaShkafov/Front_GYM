import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate():
    | boolean
    | UrlTree
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree> {
    // Получаем токен из localStorage
    const token = localStorage.getItem('authToken');
    const userRole = localStorage.getItem('userRole'); // Получаем роль из localStorage

    if (token && userRole === 'admin') {
      return true; // Разрешаем доступ только администратору
    }

    // Если не администратор, перенаправляем на страницу входа или отказа в доступе
    alert('Доступ запрещён! Эта страница доступна только администраторам.');
    return this.router.createUrlTree(['/login']); // Перенаправляем на страницу входа
  }
}
