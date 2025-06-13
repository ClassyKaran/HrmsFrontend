import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AddEmployeeService {

  private apiUrl = 'http://localhost:8080/api/employees';
  private apiUrl2 = 'http://localhost:8080/Employee/register';
  private apiUrl3 = 'http://localhost:8080/api/salary/upload';

  constructor(private http: HttpClient) {}




  private getHeaders(contentType: string = ''): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headersConfig: any = { Authorization: `Bearer ${token}` };

    if (contentType) {
      headersConfig['Content-Type'] = contentType;
    }

    return new HttpHeaders(headersConfig);
  }

  //! ✅ Get all employees
  getEmployees(): Observable<any[]> {
  return this.http.get<any[]>(this.apiUrl, {
    headers: this.getHeaders(), // no problem with extra headers
    responseType: 'json' as const
  });
}

  //! ✅ Add new employee
  addEmployeeWithImage(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl, formData, {
      headers: this.getHeaders(''), // 👈 No Content-Type
    });
  }

  //! ✅ Update employee
  updateEmployeeWithImage(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, formData, {
      headers: this.getHeaders(''), // 👈 No Content-Type
    });
  }

//   updateEmployeeWithImage(id: number, formData: FormData): Observable<any> {
//   return this.http.put<any>(
//     `http://localhost:8080/api/employees/${id}`,
//     formData
//   );
// }

  // ✅ Delete employee
  deleteEmployee(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      headers: this.getHeaders(),
    });
  }

  // ✅ Register employee
  registerEmployee(employee: any): Observable<any> {
    return this.http.post<any>(this.apiUrl2, employee, {
      headers: this.getHeaders(),
    });
  }
}
