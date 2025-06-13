import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Todo } from '../../services/todo.service';
import { Category } from '../../services/category.service';

@Component({
  selector: 'app-edit-todo-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  template: `
    <div class="edit-todo-dialog">
      <h2 mat-dialog-title>Edit Todo</h2>

      <mat-dialog-content>
        <form (ngSubmit)="saveTodo()" class="edit-todo-form">
          <div class="form-row">
            <mat-form-field class="title-field">
              <mat-label>Title</mat-label>
              <input matInput [(ngModel)]="editedTodo.title" name="title" required>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field class="description-field">
              <mat-label>Description</mat-label>
              <textarea matInput [(ngModel)]="editedTodo.description" name="description"></textarea>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field>
              <mat-label>Priority</mat-label>
              <mat-select [(ngModel)]="editedTodo.priority" name="priority">
                <mat-option value="HIGH">High</mat-option>
                <mat-option value="MEDIUM">Medium</mat-option>
                <mat-option value="LOW">Low</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Status</mat-label>
              <mat-select [(ngModel)]="editedTodo.status" name="status">
                <mat-option value="PENDING">Pending</mat-option>
                <mat-option value="IN_PROGRESS">In Progress</mat-option>
                <mat-option value="COMPLETED">Completed</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field class="date-field">
              <mat-label>Due Date</mat-label>
              <input matInput [matDatepicker]="picker" [(ngModel)]="editedTodo.dueDate" name="dueDate" placeholder="Choose a date">
              <mat-datepicker-toggle matSuffix [for]="picker">
                <mat-icon matDatepickerToggleIcon>calendar_today</mat-icon>
              </mat-datepicker-toggle>
              <mat-datepicker #picker>
                <mat-datepicker-actions>
                  <button mat-button matDatepickerCancel>Cancel</button>
                  <button mat-raised-button color="primary" matDatepickerApply>Apply</button>
                </mat-datepicker-actions>
              </mat-datepicker>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Category</mat-label>
              <mat-select [(ngModel)]="editedTodo.categoryId" name="category">
                <mat-option value="">None</mat-option>
                <mat-option *ngFor="let category of categories" [value]="category.id">
                  {{ category.name }}
                </mat-option>
              </mat-select>
            </mat-form-field>
          </div>
        </form>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">Cancel</button>
        <button mat-raised-button color="primary" (click)="saveTodo()">Save Changes</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .edit-todo-dialog {
      padding: 20px;
      min-width: 500px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      flex-wrap: wrap;
      margin-bottom: 16px;

      &:last-child {
        margin-bottom: 0;
      }

      .title-field {
        flex: 1 1 100%;
      }

      .description-field {
        flex: 1 1 100%;
      }

      .date-field {
        flex: 1;
        min-width: 200px;

        ::ng-deep {
          .mat-datepicker-toggle {
            color: rgba(0, 0, 0, 0.54);
          }

          .mat-form-field-suffix {
            top: 0;
          }
        }
      }

      mat-form-field {
        flex: 1;
        min-width: 200px;
      }
    }

    ::ng-deep {
      .mat-calendar-body-cell:not(.mat-calendar-body-disabled):hover > .mat-calendar-body-cell-content:not(.mat-calendar-body-selected):not(.mat-calendar-body-comparison-identical) {
        background-color: rgba(0, 0, 0, 0.04);
      }

      .mat-calendar-body-selected {
        background-color: #3f51b5;
        color: white;
      }
    }
  `]
})
export class EditTodoDialogComponent {
  editedTodo: Partial<Todo>;
  categories: Category[];

  constructor(
    public dialogRef: MatDialogRef<EditTodoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { todo: Todo; categories: Category[] }
  ) {
    this.editedTodo = { ...data.todo };
    this.categories = data.categories;
  }

  saveTodo() {
    this.dialogRef.close(this.editedTodo);
  }
}
