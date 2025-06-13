import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-manager-helpdesk',
  standalone: true,
  imports: [],
  templateUrl: './manager-helpdesk.component.html',
  styleUrl: './manager-helpdesk.component.css'
})
export class ManagerHelpdeskComponent {
  selectedTab = signal<'active' | 'closed'>('active');
   
    setTab(tab: 'active' | 'closed') {
      this.selectedTab.set(tab);
    }
   
    isActiveTab(tab: 'active' | 'closed') {
      return this.selectedTab() === tab;
    }
}

