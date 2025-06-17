import { FormsModule } from '@angular/forms';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';

// 👇 Toastr import
import { ToastrModule } from 'ngx-toastr';

bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    provideHttpClient(withFetch()),
    provideRouter(routes),
    importProvidersFrom(
    FormsModule,
    HttpClientModule,

    ToastrModule.forRoot({
        positionClass: 'toast-bottom-right', // optional: bottom-right toast
        timeOut: 3000,                       // optional: 3 sec duration
        closeButton: true,
        preventDuplicates: true
    })
    )
  ]
});
