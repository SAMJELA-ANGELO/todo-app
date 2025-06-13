import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService, Category } from '../../services/category.service';

@Component({
  selector: 'app-category-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatSnackBarModule
  ],
  template: `
    <div class="category-dialog">
      <h2 mat-dialog-title>Manage Categories</h2>

      <mat-dialog-content>
        <!-- Add Category Form -->
        <form (ngSubmit)="addCategory()" class="add-category-form">
          <div class="form-row">
            <mat-form-field>
              <mat-label>Category Name</mat-label>
              <input matInput [(ngModel)]="newCategoryName" name="name" required>
            </mat-form-field>

            <mat-form-field>
              <mat-label>Color</mat-label>
              <input matInput [(ngModel)]="newCategoryColor" name="color" type="color" required>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit">
              <mat-icon>add</mat-icon>
              Add Category
            </button>
          </div>
        </form>

        <!-- Categories List -->
        <div class="categories-list">
          <div *ngFor="let category of categories" class="category-item">
            <div class="category-info">
              <div class="color-preview" [style.background-color]="category.color"></div>
              <span>{{ category.name }}</span>
            </div>
            <div class="category-actions">
              <button mat-icon-button color="primary" (click)="editCategory(category)">
                <mat-icon>edit</mat-icon>
              </button>
              <button mat-icon-button color="warn" (click)="deleteCategory(category)">
                <mat-icon>delete</mat-icon>
              </button>
            </div>
          </div>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="dialogRef.close()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .category-dialog {
      padding: 20px;
      min-width: 500px;
    }

    .add-category-form {
      margin-bottom: 20px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: center;

      mat-form-field {
        flex: 1;
      }

      button {
        height: 56px;
      }
    }

    .categories-list {
      max-height: 400px;
      overflow-y: auto;
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #eee;

      &:last-child {
        border-bottom: none;
      }
    }

    .category-info {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .color-preview {
      width: 24px;
      height: 24px;
      border-radius: 4px;
      border: 1px solid #ddd;
    }

    .category-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class CategoryDialogComponent {
  categories: Category[];
  newCategoryName = '';
  newCategoryColor = '#000000';

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] },
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.categories = [...data.categories];
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    const newCategory = {
      name: this.newCategoryName,
      color: this.newCategoryColor
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: (category) => {
        this.categories.push(category);
        this.resetForm();
        this.snackBar.open('Category created successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.snackBar.open('Error creating category', 'Close', { duration: 3000 });
      }
    });
  }

  editCategory(category: Category) {
    const newName = prompt('Enter new category name:', category.name);
    if (!newName || newName === category.name) return;

    this.categoryService.updateCategory(category.id, { name: newName }).subscribe({
      next: (updatedCategory) => {
        const index = this.categories.findIndex(c => c.id === category.id);
        if (index !== -1) {
          this.categories[index] = updatedCategory;
          this.snackBar.open('Category updated successfully', 'Close', { duration: 3000 });
        }
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.snackBar.open('Error updating category', 'Close', { duration: 3000 });
      }
    });
  }

  deleteCategory(category: Category) {
    if (!confirm(`Are you sure you want to delete "${category.name}"?`)) return;

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories = this.categories.filter(c => c.id !== category.id);
        this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error deleting category:', error);
        this.snackBar.open('Error deleting category', 'Close', { duration: 3000 });
      }
    });
  }

  private resetForm() {
    this.newCategoryName = '';
    this.newCategoryColor = '#000000';
  }
}
