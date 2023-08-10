import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginForm } from 'src/app/interfaces/login-form.interface';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  public loginForm = this.fb.group({
    username: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private userService: UserService
  ) { }

  login() {
    this.userService.login(this.loginForm.value as LoginForm)
      .subscribe(
        {
          next: (resp) => {
            this.router.navigateByUrl('/dashboard');
          },
          error: (e) => console.error(e),
      }
      )
  }

}
