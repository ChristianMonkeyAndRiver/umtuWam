import { Component, OnInit } from '@angular/core';
import { AuthService } from "../../shared/services/auth.service";

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public loginValid = true;
  public email = '';
  public password = '';
  constructor(
    public authService: AuthService
  ) { }

  ngOnInit(): void {
  }

  public onSubmit(): void {
    try {
      this.authService.SignIn(this.email,this.password);
    } catch (error) {
      this.loginValid = false
    }
  }
}
