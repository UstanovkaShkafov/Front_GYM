import { Component, OnInit } from '@angular/core'; 
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-training-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './training-details.component.html',
  styleUrls: ['./training-details.component.css']
})
export class TrainingDetailsComponent implements OnInit {
  training: any = null; // Информация о тренировке
  isLoggedIn: boolean = false; // Статус авторизации пользователя
  isLoading: boolean = true; // Статус загрузки данных
  isJoining: boolean = false; // Статус процесса записи
  isLeaving: boolean = false; // Статус процесса отказа
  isJoined: boolean = false; // Пользователь записан на тренировку

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.checkLoginStatus();
    const trainingId = this.route.snapshot.params['id'];

    // Загружаем данные о тренировке
    this.loadTraining(trainingId);
  }

  // Проверяем авторизацию
  checkLoginStatus() {
    this.isLoggedIn = !!localStorage.getItem('authToken'); // Проверка токена
  }

  // Загружаем данные о тренировке
  loadTraining(trainingId: number) {
    this.isLoading = true;
    this.http.get(`https://localhost:7242/api/Training/${trainingId}`).subscribe({
      next: (data: any) => {
        this.training = data;
        this.checkIfJoined(); // Проверяем, записан ли пользователь
        this.isLoading = false; // Завершаем загрузку
      },
      error: (err) => {
        console.error('Ошибка при загрузке данных тренировки:', err);
        this.isLoading = false; // Завершаем загрузку даже в случае ошибки
        alert('Ошибка при загрузке данных тренировки.');
      }
    });
  }

  // Проверяем, записан ли пользователь на тренировку
  checkIfJoined() {
    const currentUserId = localStorage.getItem('userId'); // Получаем ID текущего пользователя
    if (currentUserId) {
      this.isJoined = this.training?.participants?.some((p: any) => p.id === +currentUserId) || false;
    } else {
      this.isJoined = false;
    }
  }
  
  

  // Запись на тренировку
  joinTraining() {
    if (!this.isLoggedIn) {
      alert('Вы должны быть авторизованы, чтобы записаться на тренировку.');
      return;
    }

    if (this.isJoining) {
      return; // Предотвращаем повторный клик
    }

    this.isJoining = true; // Устанавливаем статус "процесс записи"
    this.http.post(`https://localhost:7242/api/Training/${this.training.id}/enroll`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).subscribe({
      next: () => {
        alert('Вы успешно записались на тренировку!');
        this.training.participantsCount++; // Обновляем количество участников
        this.isJoined = true; // Устанавливаем статус, что пользователь записан
        this.isJoining = false; // Сбрасываем статус
      },
      error: (err) => {
        console.error('Ошибка записи на тренировку:', err);
        alert('Не удалось записаться на тренировку.');
        this.isJoining = false; // Сбрасываем статус
      }
    });
  }

  // Отказ от тренировки
  leaveTraining() {
    if (!this.isLoggedIn) {
      alert('Вы должны быть авторизованы, чтобы отказаться от тренировки.');
      return;
    }
  
    this.isLeaving = true;
    this.http.post(`https://localhost:7242/api/Training/${this.training.id}/leave`, {}, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` }
    }).subscribe({
      next: () => {
        // Успешный отказ
        alert('Вы отказались от тренировки.');
        this.training.participantsCount--; // Обновляем количество участников
        this.isJoined = false; // Обновляем статус
        this.isLeaving = false; // Сбрасываем флаг загрузки
      },
      error: (err) => {
        // Обработка ошибки
        console.error('Ошибка при отказе от тренировки:', err);
        alert(err.error?.message || 'Не удалось отказаться от тренировки.');
        this.isLeaving = false; // Сбрасываем флаг загрузки
      }
    });
  }
  
  
  
  
  
  
  
}
