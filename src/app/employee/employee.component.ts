import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Employee, EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {
  employees: Employee[] = [];
  employeeForm: FormGroup;
  searchForm: FormGroup;
  editingEmployee: Employee | null = null;
  loading = false;
  message = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private employeeService: EmployeeService
  ) {
    this.employeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      position: ['', [Validators.required, Validators.minLength(2)]],
      salary: ['', [Validators.required, Validators.min(0)]]
    });

    this.searchForm = this.fb.group({
      searchName: ['']
    });
  }

  ngOnInit() {
    this.loadAllEmployees();
  }

  // Load all employees
  loadAllEmployees() {
    this.loading = true;
    this.employeeService.getAllEmployees().subscribe({
      next: (response) => {
        this.employees = response.data;
        this.loading = false;
        this.showMessage(response.message, 'success');
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Failed to load employees', 'error');
        console.error(error);
      }
    });
  }

  // Search employees by name
  searchEmployees() {
    const searchName = this.searchForm.get('searchName')?.value?.trim();
    
    if (!searchName) {
      this.loadAllEmployees();
      return;
    }

    this.loading = true;
    this.employeeService.searchEmployeesByName(searchName).subscribe({
      next: (response) => {
        this.employees = response.data;
        this.loading = false;
        this.showMessage(response.message, 'success');
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Failed to search employees', 'error');
        console.error(error);
      }
    });
  }

  // Clear search
  clearSearch() {
    this.searchForm.reset();
    this.loadAllEmployees();
  }

  // Create or update employee
  onSubmit() {
    if (this.employeeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    const employeeData = this.employeeForm.value;
    this.loading = true;

    if (this.editingEmployee) {
      // Update employee
      this.employeeService.updateEmployee(this.editingEmployee.id!, employeeData).subscribe({
        next: (response) => {
          this.loading = false;
          this.showMessage(response.message, 'success');
          this.resetForm();
          this.loadAllEmployees();
        },
        error: (error) => {
          this.loading = false;
          this.showMessage('Failed to update employee', 'error');
          console.error(error);
        }
      });
    } else {
      // Create employee
      this.employeeService.createEmployee(employeeData).subscribe({
        next: (response) => {
          this.loading = false;
          this.showMessage(response.message, 'success');
          this.resetForm();
          this.loadAllEmployees();
        },
        error: (error) => {
          this.loading = false;
          this.showMessage('Failed to create employee', 'error');
          console.error(error);
        }
      });
    }
  }

  // Edit employee
  editEmployee(employee: Employee) {
    this.editingEmployee = employee;
    this.employeeForm.patchValue({
      name: employee.name,
      position: employee.position,
      salary: employee.salary
    });
  }

  // Delete employee
  deleteEmployee(id: number) {
    if (!confirm('Are you sure you want to delete this employee?')) {
      return;
    }

    this.loading = true;
    this.employeeService.deleteEmployee(id).subscribe({
      next: (response) => {
        this.loading = false;
        this.showMessage(response.message, 'success');
        this.loadAllEmployees();
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Failed to delete employee', 'error');
        console.error(error);
      }
    });
  }

  // Delete all employees
  deleteAllEmployees() {
    if (!confirm('Are you sure you want to delete ALL employees? This action cannot be undone.')) {
      return;
    }

    this.loading = true;
    this.employeeService.deleteAllEmployees().subscribe({
      next: (response) => {
        this.loading = false;
        this.showMessage(response.message, 'success');
        this.employees = [];
      },
      error: (error) => {
        this.loading = false;
        this.showMessage('Failed to delete all employees', 'error');
        console.error(error);
      }
    });
  }

  // Reset form
  resetForm() {
    this.employeeForm.reset();
    this.editingEmployee = null;
  }

  // Show message
  private showMessage(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    setTimeout(() => {
      this.message = '';
    }, 5000);
  }

  // Mark form as touched
  private markFormGroupTouched() {
    Object.keys(this.employeeForm.controls).forEach(key => {
      this.employeeForm.get(key)?.markAsTouched();
    });
  }

  // Helper methods for form validation
  isFieldInvalid(fieldName: string): boolean {
    const field = this.employeeForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.employeeForm.get(fieldName);
    if (field?.errors) {
      if (field.errors['required']) return `${fieldName} is required`;
      if (field.errors['minlength']) return `${fieldName} must be at least ${field.errors['minlength'].requiredLength} characters`;
      if (field.errors['min']) return `${fieldName} must be a positive number`;
    }
    return '';
  }
}