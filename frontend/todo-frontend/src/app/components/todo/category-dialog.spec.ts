import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryDialogComponent } from './category-dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';

describe('CategoryDialogComponent', () => {
  let component: CategoryDialogComponent;
  let fixture: ComponentFixture<CategoryDialogComponent>;
  let categoryService: jasmine.SpyObj<CategoryService>;
  let dialogRef: jasmine.SpyObj<MatDialogRef<CategoryDialogComponent>>;

  const mockCategory = {
    id: '1',
    name: 'Test Category',
    color: '#000000',
    userId: '1'
  };

  beforeEach(async () => {
    const categoryServiceSpy = jasmine.createSpyObj('CategoryService', ['createCategory']);
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    categoryServiceSpy.createCategory.and.returnValue(of(mockCategory));

    await TestBed.configureTestingModule({
      imports: [
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatButtonModule
      ],
      declarations: [CategoryDialogComponent],
      providers: [
        { provide: CategoryService, useValue: categoryServiceSpy },
        { provide: MatDialogRef, useValue: dialogRefSpy }
      ]
    }).compileComponents();

    categoryService = TestBed.inject(CategoryService) as jasmine.SpyObj<CategoryService>;
    dialogRef = TestBed.inject(MatDialogRef) as jasmine.SpyObj<MatDialogRef<CategoryDialogComponent>>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty form', () => {
    expect(component.categoryForm.get('name')?.value).toBe('');
    expect(component.categoryForm.get('color')?.value).toBe('#000000');
  });

  it('should create category when form is valid', () => {
    const newCategory = {
      name: 'New Category',
      color: '#FF0000'
    };

    component.categoryForm.patchValue(newCategory);
    component.onSubmit();

    expect(categoryService.createCategory).toHaveBeenCalledWith(newCategory);
    expect(dialogRef.close).toHaveBeenCalledWith(mockCategory);
  });

  it('should not submit if form is invalid', () => {
    component.categoryForm.patchValue({
      name: ''
    });

    component.onSubmit();

    expect(categoryService.createCategory).not.toHaveBeenCalled();
    expect(dialogRef.close).not.toHaveBeenCalled();
  });

  it('should close dialog on cancel', () => {
    component.onCancel();
    expect(dialogRef.close).toHaveBeenCalled();
  });

  it('should validate required fields', () => {
    const nameControl = component.categoryForm.get('name');
    nameControl?.setValue('');
    expect(nameControl?.valid).toBeFalse();
    expect(nameControl?.errors?.['required']).toBeTruthy();
  });

  it('should validate color format', () => {
    const colorControl = component.categoryForm.get('color');
    colorControl?.setValue('invalid-color');
    expect(colorControl?.valid).toBeFalse();
  });

  it('should validate minimum name length', () => {
    const nameControl = component.categoryForm.get('name');
    nameControl?.setValue('a');
    expect(nameControl?.valid).toBeFalse();
    expect(nameControl?.errors?.['minlength']).toBeTruthy();
  });

  it('should validate maximum name length', () => {
    const nameControl = component.categoryForm.get('name');
    nameControl?.setValue('a'.repeat(51));
    expect(nameControl?.valid).toBeFalse();
    expect(nameControl?.errors?.['maxlength']).toBeTruthy();
  });

  it('should handle service error', () => {
    categoryService.createCategory.and.returnValue(throwError(() => new Error('Service error')));

    component.categoryForm.patchValue({
      name: 'Test Category',
      color: '#000000'
    });

    component.onSubmit();
    expect(component.error).toBeTruthy();
  });
});
