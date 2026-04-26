import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HotelService, HotelServiceCreate } from '../../models/service.models';
import { HotelServiceService } from '../../services/service.service';

@Component({
  selector: 'app-services-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './services-list.component.html',
  styleUrls: ['./services-list.component.scss']
})
export class ServicesListComponent implements OnInit {
  services: HotelService[] = [];
  loading = false;
  successMsg: string | null = null;
  showModal = false;
  editingService: HotelService | null = null;
  submitting = false;

  serviceForm!: FormGroup;

  categories = ['Alimentos', 'Bebidas', 'Spa', 'Lavandería', 'Transporte', 'Entretenimiento', 'Otros'];

  constructor(private serviceService: HotelServiceService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.serviceForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      category: [''],
      active: [1],
    });
    this.loadServices();
  }

  loadServices(): void {
    this.loading = true;
    this.serviceService.getServices(0, 100, false).subscribe({
      next: r => { this.services = r; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openCreate(): void { this.serviceForm.reset({ active: 1, price: 0 }); this.editingService = null; this.showModal = true; }
  openEdit(s: HotelService): void {
    this.editingService = s;
    this.serviceForm.patchValue({ name: s.name, description: s.description, price: s.price, category: s.category, active: s.active });
    this.showModal = true;
  }
  closeModal(): void { this.showModal = false; this.editingService = null; }

  submit(): void {
    if (this.serviceForm.invalid) return;
    this.submitting = true;
    const data: HotelServiceCreate = this.serviceForm.value;
    const obs = this.editingService
      ? this.serviceService.updateService(this.editingService.id, data)
      : this.serviceService.createService(data);
    obs.subscribe({
      next: () => { this.closeModal(); this.loadServices(); this.showSuccess(this.editingService ? 'Servicio actualizado' : 'Servicio creado'); this.submitting = false; },
      error: () => this.submitting = false
    });
  }

  toggleActive(s: HotelService): void {
    this.serviceService.updateService(s.id, { active: s.active ? 0 : 1 }).subscribe({ next: () => this.loadServices() });
  }

  deleteService(s: HotelService): void {
    if (!confirm(`¿Eliminar servicio "${s.name}"?`)) return;
    this.serviceService.deleteService(s.id).subscribe({ next: () => { this.loadServices(); this.showSuccess('Servicio eliminado'); } });
  }

  showSuccess(msg: string): void { this.successMsg = msg; setTimeout(() => this.successMsg = null, 3000); }

  get activeCount() { return this.services.filter(s => s.active).length; }
  get totalValue() { return this.services.reduce((acc, s) => acc + s.price, 0); }
}
