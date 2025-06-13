import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HolidayService {

  private apiUrl = 'http://localhost:8080/api/holidays';

  constructor(private http: HttpClient) {}

  // Get JWT headers
  private getHeaders(contentType: string = ''): HttpHeaders {
    const token = localStorage.getItem('token') || '';
    const headersConfig: any = { Authorization: `Bearer ${token}` };

    if (contentType) {
      headersConfig['Content-Type'] = contentType;
    }

    return new HttpHeaders(headersConfig);
  }

  // Create a new holiday
  createHoliday(holiday: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, holiday, {
      headers: this.getHeaders()
    });
  }

  // Get all holidays
  getHolidays(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders()
    });
  }

  // 🔥 Fix this function with headers
  deleteHoliday(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/id/${id}`, {
      headers: this.getHeaders()
    });
  }
}
