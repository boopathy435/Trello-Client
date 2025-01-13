import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from './auth/services/auth.service';
import { SocketService } from './shared/services/socket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'trello';
  authService = inject(AuthService);
  socketService = inject(SocketService);
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe({
      next: (res) => {
        console.log('res:', res);
        this.socketService.setSocketConnection(res);
        this.authService.setCurrentUser(res);
      },
      error: (err) => {
        console.log('err:', err);

        this.authService.setCurrentUser(null);
      },
    });
  }
}
