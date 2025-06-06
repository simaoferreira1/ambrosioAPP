import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;
  submitted = false;
  showPassword: boolean = false; 

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    this.submitted = true;
    if (this.loginForm.invalid) {
      const toast = await this.toast.create({
        message: 'Please correct the errors before continuing.',
        duration: 2000,
        color: 'danger'
      });
      await toast.present();
      return;
    }

    const { email, password } = this.loginForm.value;
    try {
      const user: User = await this.auth.login(email, password);
      await this.toast.create({
        message: `Welcome, ${user.name}!`,
        duration: 1500
      }).then(t => t.present());
      this.router.navigateByUrl('/boasvindas', { replaceUrl: true });
    } catch (err: any) {
      await this.toast.create({
        message: err.message || 'Login failed',
        duration: 2000,
        color: 'danger'
      }).then(t => t.present());
    }
  }

  // Getter para facilitar o acesso no HTML
  get f() {
    return this.loginForm.controls;
  }
}
