import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  participantForm = {
    name: '',
    username: '',
    email: '',
    password: '',
    phone: '',
    role: 'user', // По умолчанию "user"
    trainingId: 0
  };

  trainingForm = {
    name: '',
    description: '',
    startDate: '',
    startTime: '', // Время начала
    endDate: '',
    endTime: '', // Время окончания
    maxParticipants: 0
  };

  trainings: any[] = []; // Массив для хранения списка тренировок
  isLoadingTrainings = false; // Индикатор загрузки списка тренировок
  selectedTraining: any = null; // Хранение данных выбранной тренировки
  isLoadingDetails = false; // Индикатор загрузки данных выбранной тренировки

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTrainings(); // Загружаем тренировки при инициализации
  }

  // Загрузка списка тренировок
  loadTrainings() {
    this.isLoadingTrainings = true;
    this.http.get('https://localhost:7242/api/Training/TrainingsWithParticipants', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }).subscribe({
      next: (data: any) => {
        this.trainings = data;
        this.isLoadingTrainings = false;
      },
      error: (err) => {
        console.error(err);
        alert('Ошибка при загрузке тренировок.');
        this.isLoadingTrainings = false;
      }
    });
  }

  // Загрузка деталей выбранной тренировки
  viewTrainingDetails(trainingId: number) {
    this.isLoadingDetails = true; // Устанавливаем индикатор загрузки
    this.http.get(`https://localhost:7242/api/Training/${trainingId}/Details`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }).subscribe({
      next: (data: any) => {
        this.selectedTraining = data; // Сохраняем данные о тренировке
        this.isLoadingDetails = false;
      },
      error: (err) => {
        console.error(err);
        alert('Ошибка при загрузке деталей тренировки.');
        this.isLoadingDetails = false;
      }
    });
  }

  // Создание участника
  createParticipant() {
    if (this.participantForm.trainingId <= 0) {
      alert('Пожалуйста, выберите тренировку.');
      return;
    }

    const payload = {
      ...this.participantForm,
      trainings: [this.participantForm.trainingId] // Преобразуем ID в массив
    };

    this.http.post('https://localhost:7242/api/Participant', payload, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }).subscribe({
      next: () => {
        alert('Участник успешно создан!');
        this.clearParticipantForm();
        this.loadTrainings(); // Перезагружаем список тренировок
      },
      error: (err) => {
        console.error(err);
        alert('Ошибка при создании участника.');
      }
    });
  }

  // Очистка формы участника
  clearParticipantForm() {
    this.participantForm = {
      name: '',
      username: '',
      email: '',
      password: '',
      phone: '',
      role: 'user', // Сбрасываем на "user"
      trainingId: 0
    };
  }

  // Создание тренировки
  createTraining() {
    if (!this.trainingForm.startDate || !this.trainingForm.startTime || !this.trainingForm.endDate || !this.trainingForm.endTime) {
      alert('Пожалуйста, заполните все поля даты и времени.');
      return;
    }

    // Объединяем дату и время в один объект
    const startDateTime = `${this.trainingForm.startDate}T${this.trainingForm.startTime}`;
    const endDateTime = `${this.trainingForm.endDate}T${this.trainingForm.endTime}`;

    // Подготовка данных для отправки на сервер
    const trainingData = {
      ...this.trainingForm,
      startDate: startDateTime,
      endDate: endDateTime
    };

    this.http.post('https://localhost:7242/api/Training', trainingData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }).subscribe({
      next: () => {
        alert('Тренировка успешно создана!');
        this.clearTrainingForm();
        this.loadTrainings(); // Перезагружаем список тренировок
      },
      error: (err) => {
        console.error(err);
        alert('Ошибка при создании тренировки.');
      }
    });
  }

  // Очистка формы тренировки
  clearTrainingForm() {
    this.trainingForm = {
      name: '',
      description: '',
      startDate: '',
      startTime: '', // Время начала
      endDate: '',
      endTime: '', // Время окончания
      maxParticipants: 0
    };
  }

  // Удаление тренировки
  deleteTraining(trainingId: number) {
    if (!confirm('Вы уверены, что хотите удалить эту тренировку?')) {
      return;
    }

    this.http.delete(`https://localhost:7242/api/Training/${trainingId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`
      }
    }).subscribe({
      next: () => {
        alert('Тренировка успешно удалена.');
        this.loadTrainings(); // Перезагружаем список тренировок
      },
      error: (err) => {
        console.error(err);
        alert('Ошибка при удалении тренировки.');
      }
    });
  }
}
