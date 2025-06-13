import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CategoryService, Category } from '../../services/category.service';
import { Subscription } from 'rxjs';

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
    MatListModule,
    MatChipsModule,
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
              <input matInput [(ngModel)]="newCategoryName" name="name" placeholder="Enter category name" required>
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
          <h3>Available Categories</h3>
          <mat-list>
            <mat-list-item *ngFor="let category of categories">
              <div class="category-item">
                <mat-chip [style.background-color]="category.color">
                  {{ category.name }}
                </mat-chip>
                <button mat-icon-button color="warn" (click)="deleteCategory(category)">
                  <mat-icon>delete</mat-icon>
                </button>
              </div>
            </mat-list-item>
          </mat-list>
        </div>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button (click)="closeDialog()">Close</button>
      </mat-dialog-actions>
    </div>
  `,
  styles: [`
    .category-dialog {
      padding: 20px;
      min-width: 400px;
    }

    .add-category-form {
      margin-bottom: 24px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: flex-start;

      mat-form-field {
        flex: 1;
      }

      button {
        height: 56px;
      }
    }

    .categories-list {
      h3 {
        margin: 0 0 16px;
        font-size: 16px;
        font-weight: 500;
      }
    }

    .category-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 8px 0;
    }

    mat-chip {
      min-width: 100px;
      justify-content: center;
    }
  `]
})
export class CategoryDialogComponent implements OnDestroy {
  categories: Category[] = [];
  newCategoryName = '';
  newCategoryColor = '#2196F3';
  private subscription = new Subscription();

  constructor(
    public dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { categories: Category[] },
    private categoryService: CategoryService,
    private snackBar: MatSnackBar
  ) {
    this.loadCategories();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCategories() {
    this.subscription.add(
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.snackBar.open('Error loading categories', 'Close', { duration: 3000 });
        }
      })
    );
  }

  addCategory() {
    if (!this.newCategoryName.trim()) return;

    const newCategory: Omit<Category, 'id'> = {
      name: this.newCategoryName,
      color: this.newCategoryColor
    };

    this.subscription.add(
      this.categoryService.createCategory(newCategory).subscribe({
        next: () => {
          this.newCategoryName = '';
          this.newCategoryColor = '#2196F3';
          this.snackBar.open('Category added successfully', 'Close', { duration: 3000 });
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error adding category:', error);
          this.snackBar.open('Error adding category', 'Close', { duration: 3000 });
        }
      })
    );
  }

  deleteCategory(category: Category) {
    this.subscription.add(
      this.categoryService.deleteCategory(category.id).subscribe({
        next: () => {
          this.snackBar.open('Category deleted successfully', 'Close', { duration: 3000 });
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error deleting category:', error);
          this.snackBar.open('Error deleting category', 'Close', { duration: 3000 });
        }
      })
    );
  }

  closeDialog() {
    this.loadCategories();
    this.dialogRef.close(true);
  }
}
