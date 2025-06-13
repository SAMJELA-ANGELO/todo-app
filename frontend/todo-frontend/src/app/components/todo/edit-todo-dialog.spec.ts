import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditTodoDialogComponent } from './edit-todo-dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TodoService } from '../../services/todo.service';
import { CategoryService } from '../../services/category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('EditTodoDialogComponent', () => {
  let component: EditTodoDialogComponent;
  let fixture: ComponentFixture<EditTodoDialogComponent>;
  let todoService: jasmine.SpyObj<TodoService>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<EditTodoDialogComponent>>;

  const mockTodo = {
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

  const mockCategories = [
    {
      id: '1',
      name: 'Test Category',
      color: '#000000',
      userId: '1'
    }
  ];

  beforeEach(async () => {
    const todoServiceSpy = jasmine.createSpyObj('TodoService', ['updateTodo']);
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['getCategories']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    todoServiceSpy.updateTodo.and.returnValue(of(mockTodo));
    categoryServiceSpy.getCategories.and.returnValue(of(mockCategories));

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatButtonModule,
        MatDatepickerModule,
        MatNativeDateModule
      ],
      declarations: [EditTodoDialogComponent],
      providers: [
        { provide: TodoService, useValue: todoServiceSpy },
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { todo: mockTodo } }
      ]
    }).compileComponents();

    todoService = TestBed.inject(TodoService) as jasmine.SpyObj<TodoService>;
    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<EditTodoDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditTodoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with todo data', () => {
    expect(component.todoForm.get('title')?.value).toBe(mockTodo.title);
    expect(component.todoForm.get('description')?.value).toBe(mockTodo.description);
    expect(component.todoForm.get('priority')?.value).toBe(mockTodo.priority);
    expect(component.todoForm.get('status')?.value).toBe(mockTodo.status);
    expect(component.todoForm.get('categoryId')?.value).toBe(mockTodo.categoryId);
  });

  it('should load categories on init', () => {
    expect(categoryService.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCategories);
  });

  it('should update todo when form is valid', () => {
    const updatedTodo = {
      ...mockTodo,
      title: 'Updated Todo',
      description: 'Updated Description'
    };

    component.todoForm.patchValue({
      title: 'Updated Todo',
      description: 'Updated Description'
    });

    component.onSubmit();

    expect(todoService.updateTodo).toHaveBeenCalledWith(mockTodo.id, {
      title: 'Updated Todo',
      description: 'Updated Description'
    });
    expect(dialogRef.close).toHaveBeenCalledWith(updatedTodo);
  });

  it('should not submit if form is invalid', () => {
    component.todoForm.patchValue({
      title: ''
    });

    component.onSubmit();

    expect(todoService.updateTodo).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const titleControl = component.todoForm.get('title');
    titleControl?.setValue('');
    expect(titleControl?.valid).toBeFalse();
    expect(titleControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate priority values', () => {
    const priorityControl = component.todoForm.get('priority');
    priorityControl?.setValue('INVALID');
    expect(priorityControl?.valid).toBeFalse();
  });

  it('should validate status values', () => {
    const statusControl = component.todoForm.get('status');
    statusControl?.setValue('INVALID');
    expect(statusControl?.valid).toBeFalse();
  });
});
