import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';



export interface CalendarDay {
  date: string;
  workingDay: boolean;
  remarks: string;
}

@Injectable({
  providedIn: 'root'
})





export class CalendarService {
  private apiUrl = 'http://localhost:8080/api/calendar-days';

  constructor(private http: HttpClient) {}

  getAll(): Observable<CalendarDay[]> {
    return this.http.get<CalendarDay[]>(this.apiUrl);
  }

  getDay(date: string): Observable<CalendarDay> {
    return this.http.get<CalendarDay>(`${this.apiUrl}/${date}`);
  }

  getByMonth(year: number, month: number): Observable<CalendarDay[]> {
    let params = new HttpParams().set('year', year).set('month', month);
    return this.http.get<CalendarDay[]>(`${this.apiUrl}/month`, { params });
  }

  setDay(day: CalendarDay): Observable<CalendarDay> {
    let params = new HttpParams()
      .set('date', day.date)
      .set('isWorkingDay', day.workingDay)
      .set('remarks', day.remarks || '');
    return this.http.post<CalendarDay>(`${this.apiUrl}/set`, {}, { params });
  }
}
