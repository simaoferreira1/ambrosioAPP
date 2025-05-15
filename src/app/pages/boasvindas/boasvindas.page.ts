import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-boasvindas',
  templateUrl: './boasvindas.page.html',
  styleUrls: ['./boasvindas.page.scss'],
  standalone:false
})
export class BoasvindasPage implements OnInit {

  constructor(private router: Router) {}

  ngOnInit() {}

  avancar() {
    this.router.navigateByUrl('/tabs/tab1');
  }
}
