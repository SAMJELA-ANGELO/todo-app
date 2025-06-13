import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  dueDate?: Date;
  categoryId?: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  category?: {
    id: string;
    name: string;
    color: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private apiUrl = `${environment.apiUrl}/todos`;
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {
    this.loadTodos();
  }

  private getHeaders() {
    const token = this.authService.getToken();
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }

  loadTodos() {
    this.http.get<Todo[]>(this.apiUrl, { headers: this.getHeaders() })
      .subscribe(todos => this.todosSubject.next(todos));
  }

  getTodos(): Observable<Todo[]> {
    return this.todos$;
  }

  getTodo(id: string): Observable<Todo> {
    return this.http.get<Todo>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }

  createTodo(todo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Observable<Todo> {
    return this.http.post<Todo>(this.apiUrl, todo, { headers: this.getHeaders() })
      .pipe(
        tap(newTodo => {
          const currentTodos = this.todosSubject.value;
          this.todosSubject.next([newTodo, ...currentTodos]);
        })
      );
  }

  updateTodo(id: string, todo: Partial<Todo>): Observable<Todo> {
    return this.http.put<Todo>(`${this.apiUrl}/${id}`, todo, { headers: this.getHeaders() })
      .pipe(
        tap(updatedTodo => {
          const currentTodos = this.todosSubject.value;
          const index = currentTodos.findIndex(t => t.id === id);
          if (index !== -1) {
            currentTodos[index] = updatedTodo;
            this.todosSubject.next([...currentTodos]);
          }
        })
      );
  }

  deleteTodo(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() })
      .pipe(
        tap(() => {
          const currentTodos = this.todosSubject.value;
          this.todosSubject.next(currentTodos.filter(todo => todo.id !== id));
        })
      );
  }
}
