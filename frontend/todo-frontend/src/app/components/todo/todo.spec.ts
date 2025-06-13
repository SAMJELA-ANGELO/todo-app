import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TodoComponent } from './todo';
import { TodoService } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { AuthService } from '../../services/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { of, throwError } from 'rxjs';
import { Todo } from '../../services/todo.service';
import { Category } from '../../services/category.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('TodoComponent', () => {
  let component: TodoComponent;
  let fixture: ComponentFixture<TodoComponent>;
  let todoService: jasmine.SpyObj<TodoService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let authService: jasmine.SpyObj<AuthService>;
  let dialog: jasmine.SpyObj<MatDialog>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

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

  const mockCategory: Category = {
    id: '1',
    name: 'Test Category',
    color: '#000000',
    userId: '1'
  };

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', ['getTodos', 'createTodo', 'updateTodo', 'deleteTodo']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories', 'createCategory']);
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getToken', 'isAuthenticated']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    todoServiceSpy.getTodos.and.returnValue(of([mockTodo]));
    categoryServiceSpy.getCategories.and.returnValue(of([mockCategory]));
    authServiceSpy.isAuthenticated.and.returnValue(true);

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatChipsModule,
        MatMenuModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      declarations: [TodoComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    dialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load todos and categories on init', () => {
    expect(todoService.getTodos).toHaveBeenCalled();
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.todos).toEqual([mockTodo]);
    expect(component.categories).toEqual([mockCategory]);
  });

  it('should open create todo dialog', () => {
    const dialogRef = { afterClosed: () => of(mockTodo) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openCreateTodoDialog();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open edit todo dialog', () => {
    const dialogRef = { afterClosed: () => of(mockTodo) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openEditTodoDialog(mockTodo);
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should open category dialog', () => {
    const dialogRef = { afterClosed: () => of(mockCategory) };
    dialog.open.and.returnValue(dialogRef as any);

    component.openCategoryDialog();
    expect(dialog.open).toHaveBeenCalled();
  });

  it('should delete todo', () => {
    todoService.deleteTodo.and.returnValue(of(void 0));
    component.deleteTodo(mockTodo.id);
    expect(todoService.deleteTodo).toHaveBeenCalledWith(mockTodo.id);
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('should handle error when loading todos', () => {
    todoService.getTodos.and.returnValue(throwError(() => new Error('Failed to load todos')));
    component.loadTodos();
    expect(snackBar.open).toHaveBeenCalled();
  });

  it('should filter todos by status', () => {
    component.todos = [mockTodo];
    component.filterByStatus('PENDING');
    expect(component.filteredTodos).toEqual([mockTodo]);
  });

  it('should filter todos by category', () => {
    component.todos = [mockTodo];
    component.filterByCategory('1');
    expect(component.filteredTodos).toEqual([mockTodo]);
  });

  it('should sort todos by due date', () => {
    const todo1 = { ...mockTodo, id: '1', dueDate: new Date('2024-12-31') };
    const todo2 = { ...mockTodo, id: '2', dueDate: new Date('2024-01-01') };
    component.todos = [todo1, todo2];
    component.sortByDueDate();
    expect(component.filteredTodos[0].id).toBe('2');
    expect(component.filteredTodos[1].id).toBe('1');
  });

  it('should sort todos by priority', () => {
    const todo1 = { ...mockTodo, id: '1', priority: 'LOW' };
    const todo2 = { ...mockTodo, id: '2', priority: 'HIGH' };
    component.todos = [todo1, todo2];
    component.sortByPriority();
    expect(component.filteredTodos[0].id).toBe('2');
    expect(component.filteredTodos[1].id).toBe('1');
  });
});
