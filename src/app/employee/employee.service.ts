import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Employee {
  id?: number;
  name: string;
  position: string;
  salary: number;
}

export interface ApiResponse<T> {
  statusCode: number;
  data: T;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmployeeService {
  private baseUrl = 'http://localhost:8000/api/v1';

  constructor(private http: HttpClient) { }

  // Create employee
  createEmployee(employee: Employee): Observable<ApiResponse<Employee>> {
    return this.http.post<ApiResponse<Employee>>(`${this.baseUrl}/create`, employee);
  }

  // Get all employees
  getAllEmployees(): Observable<ApiResponse<Employee[]>> {
    return this.http.get<ApiResponse<Employee[]>>(`${this.baseUrl}/employees`);
  }

  // Search employees by name
  searchEmployeesByName(name: string): Observable<ApiResponse<Employee[]>> {
    const params = new HttpParams().set('name', name);
    return this.http.get<ApiResponse<Employee[]>>(`${this.baseUrl}/employees`, { params });
  }

  // Get employee by ID
  getEmployeeById(id: number): Observable<ApiResponse<Employee>> {
    return this.http.get<ApiResponse<Employee>>(`${this.baseUrl}/employees/${id}`);
  }

  // Update employee
  updateEmployee(id: number, employee: Partial<Employee>): Observable<ApiResponse<Employee>> {
    return this.http.put<ApiResponse<Employee>>(`${this.baseUrl}/employees/${id}`, employee);
  }

  // Delete employee by ID
  deleteEmployee(id: number): Observable<ApiResponse<null>> {
    return this.http.delete<ApiResponse<null>>(`${this.baseUrl}/employees/${id}`);
  }

  // Delete all employees
  deleteAllEmployees(): Observable<ApiResponse<{ deletedCount: number }>> {
    return this.http.delete<ApiResponse<{ deletedCount: number }>>(`${this.baseUrl}/employees`);
  }
}