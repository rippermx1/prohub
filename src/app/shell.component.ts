import { Component, OnInit, Renderer2, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TabbarComponent } from './components/tabbar/tabbar.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [CommonModule, RouterModule, TabbarComponent],
  templateUrl: './shell.component.html',
  styleUrl: './shell.component.scss',
})
export class ShellComponent implements OnInit {
  auth = inject(AuthService);

  constructor(private renderer: Renderer2) {}

  ngOnInit() {}
}
