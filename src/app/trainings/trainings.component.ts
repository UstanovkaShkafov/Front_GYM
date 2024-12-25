import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-trainings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './trainings.component.html',
  styleUrls: ['./trainings.component.css']
})
export class TrainingsComponent implements OnInit {
  trainings: any[] = []; // Список всех тренировок
  isLoggedIn: boolean = false; // Статус авторизации пользователя
  currentUserId: number | null = null; // ID текущего пользователя, если авторизован
  isTableView: boolean = true; // Переключение между видом таблицы и карточек

  searchTerm: string = ''; // Фильтрация по названию
  sortBy: string = ''; // Поле для сортировки
  sortDirection: 'asc' | 'desc' = 'asc'; // Направление сортировки

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadTrainings();
    this.checkLoginStatus();
  }

  // Загружаем тренировки с сервера
  loadTrainings() {
    this.http.get('https://localhost:7242/api/Training').subscribe({
      next: (data: any) => {
        this.trainings = data; // Сохраняем данные в массив
      },
      error: (err) => {
        console.error('Ошибка при загрузке тренировок:', err);
        alert('Не удалось загрузить тренировки. Проверьте подключение к серверу.');
      }
    });
  }

  // Проверяем, авторизован ли пользователь
  checkLoginStatus() {
    const token = localStorage.getItem('authToken');
    if (token) {
      this.isLoggedIn = true;
      this.currentUserId = 1; // Пример: задаём ID текущего пользователя вручную
    }
  }

  // Переход на страницу деталей тренировки
  goToTrainingDetails(trainingId: number) {
    this.router.navigate(['/training', trainingId]); // Переход на страницу по маршруту
  }

  // Переход на страницу "Мои тренировки"
  goToMyTrainings() {
    if (!this.isLoggedIn) {
      alert('Вы должны быть авторизованы, чтобы просматривать свои тренировки.');
      return;
    }

    this.router.navigate(['/my-trainings']);
  }

  // Отфильтрованные и отсортированные тренировки
  get filteredAndSortedTrainings() {
    // Фильтрация по названию
    let result = this.trainings.filter(training =>
      training.name.toLowerCase().includes(this.searchTerm.toLowerCase())
    );

    // Сортировка
    if (this.sortBy) {
      result = result.sort((a, b) => {
        const fieldA = a[this.sortBy];
        const fieldB = b[this.sortBy];

        if (fieldA < fieldB) return this.sortDirection === 'asc' ? -1 : 1;
        if (fieldA > fieldB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }

  // Установка сортировки
  onSort(field: string) {
    if (this.sortBy === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortDirection = 'asc';
    }
  }

  calculateProgress(participantsCount: number, maxParticipants: number): number {
    if (maxParticipants > 0) {
      return Math.round((participantsCount / maxParticipants) * 100);
    }
    return 0;
  }

  joinTraining(trainingId: number) {
    if (!this.isLoggedIn) {
      alert('Вы должны быть авторизованы, чтобы записаться на тренировку.');
      return;
    }
  
    this.http.post(`https://localhost:7242/api/Training/${trainingId}/enroll`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).subscribe({
      next: (updatedTraining: any) => {
        alert('Вы успешно записались на тренировку!');
        // Обновляем данные конкретной тренировки
        const trainingIndex = this.trainings.findIndex(t => t.id === updatedTraining.id);
        if (trainingIndex !== -1) {
          this.trainings[trainingIndex] = updatedTraining; // Обновляем данные
        }
      },
      error: (err) => {
        console.error('Ошибка записи на тренировку:', err);
        alert(err.error?.message || 'Не удалось записаться на тренировку.');
      }
    });
  }

  leaveTraining(trainingId: number) {
    if (!this.isLoggedIn) {
      alert('Вы должны быть авторизованы, чтобы отказаться от тренировки.');
      return;
    }
  
    this.http.post(`https://localhost:7242/api/Training/${trainingId}/leave`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).subscribe({
      next: () => {
        alert('Вы успешно отказались от тренировки!');
        this.loadTrainings(); // Обновляем список тренировок
      },
      error: (err) => {
        console.error('Ошибка при отказе от тренировки:', err);
        alert(err.error?.message || 'Не удалось отказаться от тренировки.');
      }
    });
  }
  
  
  
  
  
  
  
}
