import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TodoService, Todo } from './todo.service';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

describe('TodoService', () => {
  let service: TodoService;
  let httpMock: HttpTestingController;
  let authService: jasmine.SpyObj<AuthService>;

  const mockTodo: Todo = {
    id: '1',
    title: 'Test Todo',
    description: 'Test Description',
    priority: 'HIGH',
    status: 'PENDING',
    dueDate: new Date(),
    categoryId: '1',
    userId: '1',
    createdAt: new Date(),
    updatedAt: new Date(),
    category: {
      id: '1',
      name: 'Test Category',
      color: '#000000'
    }
  };

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken']);
    authServiceSpy.getToken.and.returnValue('test-token');

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TodoService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });

    service = TestBed.inject(TodoService);
    httpMock = TestBed.inject(HttpTestingController);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all todos', () => {
    const mockTodos: Todo[] = [mockTodo];

    service.getTodos().subscribe(todos => {
      expect(todos).toEqual(mockTodos);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todos`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockTodos);
  });

  it('should get a single todo by id', () => {
    service.getTodo('1').subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todos/1`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(mockTodo);
  });

  it('should create a new todo', () => {
    const newTodo: Omit<Todo, 'id' | 'userId' | 'createdAt' | 'updatedAt'> = {
      title: 'New Todo',
      description: 'New Description',
      priority: 'MEDIUM',
      status: 'PENDING',
      categoryId: '1'
    };

    service.createTodo(newTodo).subscribe(todo => {
      expect(todo).toEqual(mockTodo);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todos`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.body).toEqual(newTodo);
    req.flush(mockTodo);
  });

  it('should update a todo', () => {
    const updateData: Partial<Todo> = {
      title: 'Updated Todo',
      status: 'COMPLETED'
    };

    service.updateTodo('1', updateData).subscribe(todo => {
      expect(todo).toEqual({ ...mockTodo, ...updateData });
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todos/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    expect(req.request.body).toEqual(updateData);
    req.flush({ ...mockTodo, ...updateData });
  });

  it('should delete a todo', () => {
    service.deleteTodo('1').subscribe(response => {
      expect(response).toBeUndefined();
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todos/1`);
    expect(req.request.method).toBe('DELETE');
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    req.flush(null);
  });

  it('should handle error responses', () => {
    service.getTodos().subscribe({
      error: (error) => {
        expect(error.status).toBe(500);
      }
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/todos`);
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' });
  });
});
