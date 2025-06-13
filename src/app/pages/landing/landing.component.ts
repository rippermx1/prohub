import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent implements OnInit {
  
  constructor(
    private router: Router,
    private titleService: Title,
    private metaService: Meta
  ) {}

  ngOnInit(): void {
    // Set page title and meta description for SEO
    this.titleService.setTitle('ProHub - Conectando profesionales con clientes');
    this.metaService.updateTag({ 
      name: 'description', 
      content: 'ProHub es la plataforma que conecta profesionales con clientes. Encuentra servicios profesionales de calidad o ofrece tus servicios como especialista.' 
    });
  }
  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
