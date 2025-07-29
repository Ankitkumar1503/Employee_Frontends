import { Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';

export const routes: Routes = [
  { path: '', component: EmployeeComponent },
  { path: 'employees', component: EmployeeComponent },
  { path: '**', redirectTo: '' }
];