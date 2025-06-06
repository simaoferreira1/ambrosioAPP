import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastController } from '@ionic/angular';
import { AuthService, User } from '../../services/auth.service';

@Component({
  selector: 'app-registo',
  templateUrl: './registo.page.html',
  styleUrls: ['./registo.page.scss'],
  standalone: false,
})
export class RegistoPage implements OnInit {
  registerForm!: FormGroup;
  submitted = false;
  showPassword = false; // 👈 Para o olho

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router,
    private toast: ToastController
  ) {}

  ngOnInit() {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  // Getter para facilitar acesso no HTML
  get f() {
    return this.registerForm.controls;
  }

  // Alternar visibilidade da password
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  // Submissão do formulário
  async onSubmit() {
    this.submitted = true;

    if (this.registerForm.invalid) {
      const t = await this.toast.create({
        message: 'Please correct the errors before continuing.',
        duration: 2000,
        color: 'danger'
      });
      return t.present();
    }

    const { name, email, password } = this.registerForm.value;

    try {
      const user: User = await this.auth.register(name, email, password);
      await this.toast.create({
        message: `Account created for ${user.name}!`,
        duration: 1500,
        color: 'success'
      }).then(toast => toast.present());

      this.router.navigateByUrl('/login', { replaceUrl: true });
    } catch (err: any) {
      await this.toast.create({
        message: err.message || 'Error signing up',
        duration: 2000,
        color: 'danger'
      }).then(toast => toast.present());
    }
  }

  goToLogin() {
    this.router.navigateByUrl('/login');
  }
}
