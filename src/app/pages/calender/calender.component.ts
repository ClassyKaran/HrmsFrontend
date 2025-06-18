import { CalendarDay, CalendarService } from './../../../services/calender.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';


import { Component, OnInit } from '@angular/core';
  
@Component({
  selector: 'app-calender',
  standalone: true,
  imports: [BrowserModule, FormsModule, HttpClientModule],
  templateUrl: './calender.component.html',
  styleUrl: './calender.component.css'
})
export class CalenderComponent implements OnInit {
  days: CalendarDay[] = [];
  newDay: CalendarDay = { date: '', workingDay: true, remarks: '' };
  isEditMode = false;

  constructor(private CalendarService: CalendarService) {}

  ngOnInit(): void {
    this.loadDays();
  }

  loadDays(): void {
    this.CalendarService.getAll().subscribe(data => this.days = data);
  }

  edit(day: CalendarDay): void {
    this.newDay = { ...day };
    this.isEditMode = true;
  }

  resetForm(): void {
    this.newDay = { date: '', workingDay: true, remarks: '' };
    this.isEditMode = false;
  }

  submit(): void {
    this.CalendarService.setDay(this.newDay).subscribe(() => {
      this.loadDays();
      this.resetForm();
    });
  }
}



