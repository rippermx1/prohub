import { Injectable, Type, createComponent, ApplicationRef, EnvironmentInjector, Injector } from '@angular/core';
import { SpecialistDetailComponent } from '../components/specialist-detail/specialist-detail.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {
  private modalElement: HTMLDivElement | null = null;
  
  constructor(
    private appRef: ApplicationRef,
    private injector: Injector,
    private environmentInjector: EnvironmentInjector
  ) {
    // Setup once when service is created
    this.setupModal();
  }

  private setupModal(): void {
    // Create simple modal container if it doesn't exist yet
    if (!document.getElementById('fullscreen-modal')) {
      this.modalElement = document.createElement('div');
      this.modalElement.id = 'fullscreen-modal';
      this.modalElement.style.display = 'none';
      this.modalElement.className = 'fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-auto';
      document.body.appendChild(this.modalElement);
    } else {
      this.modalElement = document.getElementById('fullscreen-modal') as HTMLDivElement;
    }
  }

  open(component: Type<any>, data?: any): void {
    if (!this.modalElement) return;
    
    // Show modal
    this.modalElement.style.display = 'block';
    document.body.classList.add('overflow-hidden');
    
    // Clear previous content
    this.modalElement.innerHTML = '';
    
    // Set modal styles for proper positioning
    this.modalElement.className = 'fixed inset-0 z-50 overflow-hidden';
    
    // Properly create and render the Angular component
    const componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
      hostElement: this.modalElement,
      elementInjector: this.injector
    });
    
    // Pass input data to component if provided
    if (data) {
      Object.keys(data).forEach(key => {
        componentRef.instance[key] = data[key];
      });
    }
    
    // Detect changes to render the component
    componentRef.changeDetectorRef.detectChanges();
    
    // Store component reference so we can destroy it later
    (this.modalElement as any)._componentRef = componentRef;
  }

  close(): void {
    if (!this.modalElement) return;
    
    // Destroy Angular component if it exists
    if ((this.modalElement as any)._componentRef) {
      (this.modalElement as any)._componentRef.destroy();
      (this.modalElement as any)._componentRef = null;
    }
    
    // Hide modal
    this.modalElement.style.display = 'none';
    document.body.classList.remove('overflow-hidden');
  }
}
