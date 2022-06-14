import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from "../../shared/services/auth.service";
import { HotToastService } from '@ngneat/hot-toast'
@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public loginValid = true;


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
  });

  constructor(
    public authService: AuthService,
    private router: Router,
    private toast: HotToastService,
  ) { }

  ngOnInit(): void {
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  public onSubmit(): void {
    if (!this.loginForm.valid) return;

    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).pipe(
      this.toast.observe({
        success: 'Logged in successfully',
        loading: 'Logging in...',
        error: ({ message }) => `There was an error: ${message} `
      })
    ).subscribe(() => {
      this.router.navigate(['/dashboard']);
    });
  }
}
