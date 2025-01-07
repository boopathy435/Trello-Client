import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './auth/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'trello';
  authService = inject(AuthService);
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('res:', res);

        this.authService.setCurrentUser(res);
      },
      error: (err) => {
        console.log('err:', err);

        this.authService.setCurrentUser(null);
      },
    });
  }
}
