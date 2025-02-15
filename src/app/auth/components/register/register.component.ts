import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { CurrentUserInterface } from '../../types/currentUser.interface';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  form!: FormGroup;
  error: string | null = null;
  constructor(private fb: FormBuilder, private auth: AuthService) {
    this.form = this.fb.group({
      email: this.fb.control('', Validators.required),
      username: this.fb.control('', Validators.required),
      password: this.fb.control('', Validators.required),
    });
  }
  onSubmit() {
    this.auth.register(this.form.value).subscribe({
      next: (response: CurrentUserInterface) => {
        this.auth.setToken(response.token);
        this.auth.setCurrentUser(response);
        this.error=null;
      },
      error: (err: HttpErrorResponse) => {
        console.log('Error:', err.error);
        this.error = err.error;
      },
    });
  }
}
