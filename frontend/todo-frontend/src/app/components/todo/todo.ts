import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CategoryDialogComponent } from './category-dialog';
import { EditTodoDialogComponent } from './edit-todo-dialog';
import { CategoryService, Category } from '../../services/category.service';
import { TodoService, Todo } from '../../services/todo.service';
import { Subscription, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    MatTooltipModule,
    MatMenuModule,
    MatDividerModule,
    MatSnackBarModule,
    MatCheckboxModule,
    MatDialogModule
  ],
  templateUrl: './todo.html',
  styleUrls: ['./todo.scss']
})
export class TodoComponent implements OnInit, OnDestroy {
  todos: Todo[] = [];
  categories: Category[] = [];
  private subscription = new Subscription();
  newTodoTitle = '';
  newTodoDescription = '';
  newTodoPriority: 'HIGH' | 'MEDIUM' | 'LOW' = 'MEDIUM';
  newTodoDueDate?: Date;
  newTodoCategoryId?: string;
  searchQuery = '';
  statusFilter: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'ALL';
  priorityFilter: 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'ALL';
  categoryFilter: 'ALL' | string = 'ALL';
  isLoading = false;
  filteredTodos: Todo[] = [];

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private todoService: TodoService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
    this.setupTodoSubscription();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  private setupTodoSubscription() {
    this.subscription.add(
      this.todoService.todos$.subscribe(todos => {
        this.todos = todos;
        this.applyFilters();
      })
    );
  }

  loadCategories() {
    this.isLoading = true;
    this.subscription.add(
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
          this.isLoading = false;
        }
      })
    );
  }

  addTodo() {
    if (!this.newTodoTitle.trim()) {
      return;
    }

    const newTodo = {
      title: this.newTodoTitle,
      description: this.newTodoDescription,
      priority: this.newTodoPriority,
      dueDate: this.newTodoDueDate,
      status: 'PENDING' as const,
      categoryId: this.newTodoCategoryId
    };

    this.subscription.add(
      this.todoService.createTodo(newTodo).subscribe({
        next: () => {
          this.resetForm();
          this.snackBar.open('Todo created successfully', 'Close', { duration: 3000 });
        },
        error: (error) => {
          console.error('Error creating todo:', error);
          this.snackBar.open('Error creating todo', 'Close', { duration: 3000 });
        }
      })
    );
  }

  toggleTodoStatus(todo: Todo) {
    const updatedStatus = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    this.subscription.add(
      this.todoService.updateTodo(todo.id, { status: updatedStatus }).subscribe({
        error: (error) => {
          console.error('Error updating todo status:', error);
          this.snackBar.open('Error updating todo status', 'Close', { duration: 3000 });
        }
      })
    );
  }

  deleteTodo(todo: Todo) {
    this.subscription.add(
      this.todoService.deleteTodo(todo.id).subscribe({
        error: (error) => {
          console.error('Error deleting todo:', error);
          this.snackBar.open('Error deleting todo', 'Close', { duration: 3000 });
        }
      })
    );
  }

  applyFilters() {
    this.filteredTodos = this.todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          todo.description?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || todo.status === this.statusFilter;
      const matchesPriority = this.priorityFilter === 'ALL' || todo.priority === this.priorityFilter;
      const matchesCategory = this.categoryFilter === 'ALL' || todo.categoryId === this.categoryFilter;

      return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
    });
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH': return '#f44336';
      case 'MEDIUM': return '#ff9800';
      case 'LOW': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return '#9e9e9e';
      case 'IN_PROGRESS': return '#2196f3';
      case 'COMPLETED': return '#4caf50';
      default: return '#9e9e9e';
    }
  }

  getCategoryColor(categoryId: string | undefined): string {
    if (!categoryId) return '#9e9e9e';
    const category = this.categories.find(c => c.id === categoryId);
    return category?.color || '#9e9e9e';
  }

  private resetForm() {
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.newTodoPriority = 'MEDIUM';
    this.newTodoDueDate = undefined;
    this.newTodoCategoryId = undefined;
  }

  openCategoryDialog() {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      data: { categories: this.categories }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.loadCategories();
        }
      })
    );
  }

  openEditTodoDialog(todo: Todo) {
    const dialogRef = this.dialog.open(EditTodoDialogComponent, {
      data: { todo, categories: this.categories }
    });

    this.subscription.add(
      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.todoService.loadTodos();
        }
      })
    );
  }
}
