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
import { Subscription } from 'rxjs';

interface Todo {
  id: number;
  title: string;
  description?: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  dueDate?: Date;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  category?: string;
}

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
  newTodoCategory?: string;
  searchQuery = '';
  statusFilter: 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' = 'ALL';
  priorityFilter: 'ALL' | 'HIGH' | 'MEDIUM' | 'LOW' = 'ALL';
  categoryFilter: 'ALL' | string = 'ALL';
  isLoading = false;
  filteredTodos: Todo[] = [];

  constructor(
    private dialog: MatDialog,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCategories() {
    this.isLoading = true;
    this.subscription.add(
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
          this.isLoading = false;
          this.applyFilters();
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
    if (!this.newTodoTitle.trim()) return;

    const newTodo: Todo = {
      id: this.todos.length + 1,
      title: this.newTodoTitle,
      description: this.newTodoDescription,
      priority: this.newTodoPriority,
      dueDate: this.newTodoDueDate,
      status: 'PENDING',
      category: this.newTodoCategory
    };

    this.todos.unshift(newTodo);
    this.applyFilters();
    this.resetForm();
  }

  toggleTodoStatus(todo: Todo) {
    todo.status = todo.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    this.applyFilters();
  }

  deleteTodo(todo: Todo) {
    this.todos = this.todos.filter(t => t.id !== todo.id);
    this.applyFilters();
  }

  applyFilters() {
    this.filteredTodos = this.todos.filter(todo => {
      const matchesSearch = todo.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                          todo.description?.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesStatus = this.statusFilter === 'ALL' || todo.status === this.statusFilter;
      const matchesPriority = this.priorityFilter === 'ALL' || todo.priority === this.priorityFilter;
      const matchesCategory = this.categoryFilter === 'ALL' || todo.category === this.categoryFilter;

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

  getCategoryColor(categoryName: string): string {
    const category = this.categories.find(c => c.name === categoryName);
    return category?.color || '#9e9e9e';
  }

  private resetForm() {
    this.newTodoTitle = '';
    this.newTodoDescription = '';
    this.newTodoPriority = 'MEDIUM';
    this.newTodoDueDate = undefined;
    this.newTodoCategory = undefined;
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

  editTodo(todo: Todo) {
    const dialogRef = this.dialog.open(EditTodoDialogComponent, {
      data: { todo, categories: this.categories }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const index = this.todos.findIndex(t => t.id === result.id);
        if (index !== -1) {
          this.todos[index] = result;
          this.applyFilters();
        }
      }
    });
  }
}
