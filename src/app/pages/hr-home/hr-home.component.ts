import { HolidayService } from './../../../services/holidays.service';
// import { Component, OnInit, OnDestroy } from '@angular/core';

// @Component({
//   selector: 'app-hr-home',
//   standalone: true,
//   imports: [],
//   templateUrl: './hr-home.component.html',
//   styleUrl: './hr-home.component.css'
// })
// export class HrHomeComponent implements OnInit, OnDestroy {

//   timeString: string = '';
//   private intervalId: any;

//   ngOnInit(): void {
//     this.updateTime();
//     this.intervalId = setInterval(() => this.updateTime(), 1000);
//   }

//   ngOnDestroy(): void {
//     clearInterval(this.intervalId);
//   }

//   updateTime(): void {
//     const now = new Date();
//     const hours = String(now.getHours()).padStart(2, '0');
//     const minutes = String(now.getMinutes()).padStart(2, '0');
//     const seconds = String(now.getSeconds()).padStart(2, '0');
//     this.timeString = `${hours} : ${minutes} : ${seconds}`;
//   }
// }



import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-hr-home',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './hr-home.component.html',
  styleUrl: './hr-home.component.css'
})
export class HrHomeComponent implements OnInit, OnDestroy {

  timeString: string = '';
  private intervalId: any;

  holidays: any[] = [];

  constructor(private HolidayService: HolidayService) {}

  ngOnInit(): void {
    this.updateTime();
    this.intervalId = setInterval(() => this.updateTime(), 1000);
    this.loadHolidays();
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  updateTime(): void {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    this.timeString = `${hours} : ${minutes} : ${seconds}`;
  }

  loadHolidays(): void {
    this.HolidayService.getHolidays().subscribe({
      next: (res) => {
        this.holidays = res.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());
      },
      error: () => {
        console.error('Failed to load holidays');
      }
    });
  }

  getDayName(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'long' });
  }

  getDayMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
  }
}
