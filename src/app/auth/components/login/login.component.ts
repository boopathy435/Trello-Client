import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CurrentUserInterface } from '../../types/currentUser.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  form!: FormGroup;
  errorMessage: string | null = null;
  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {
    this.form = this.fb.group({
      email: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
    });
  }
  onSubmit() {
    this.auth.login(this.form.value).subscribe({
      next: (response: CurrentUserInterface) => {
        this.auth.setToken(response.token);
        this.auth.setCurrentUser(response);
        this.errorMessage = null;
        this.router.navigateByUrl('/');
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error:', err.error);
        this.errorMessage = err.error.emailOrPassword;
      },
    });
  }
}
