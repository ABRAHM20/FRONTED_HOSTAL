import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Stay, StayCreate, StayUpdate } from '../../models/stay.models';
import { StayService } from '../../services/stay.service';
import { RoomService } from '../../../rooms/services/room.service';
import { Room, RoomRate } from '../../../rooms/models/room.models';

@Component({
  selector: 'app-stays-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './stays-list.component.html',
  styleUrls: ['./stays-list.component.scss']
})
export class StaysListComponent implements OnInit {
  stays: Stay[] = [];
  rooms: Room[] = [];
  rates: RoomRate[] = [];
  loading = false;
  error: string | null = null;
  successMsg: string | null = null;
  showModal = false;
  showEditModal = false;
  editingStay: Stay | null = null;
  submitting = false;
  filterStatus = '';

  stayForm!: FormGroup;
  editForm!: FormGroup;

  statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'active', label: 'Activo' },
    { value: 'finished', label: 'Finalizado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  paymentStatusMap: Record<string, string> = {
    pending: 'Pendiente', partial: 'Parcial', paid: 'Pagado'
  };
  statusMap: Record<string, string> = {
    pending: 'Pendiente', active: 'Activo', finished: 'Finalizado', cancelled: 'Cancelado'
  };

  constructor(
    private stayService: StayService,
    private roomService: RoomService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.buildForms();
    this.loadData();
  }

  buildForms(): void {
    this.stayForm = this.fb.group({
      room_id: ['', Validators.required],
      room_plan_id: ['', Validators.required],
      rate_id: ['', Validators.required],
      check_in_at: [''],
      notes: [''],
    });
    this.editForm = this.fb.group({
      status: [''],
      payment_status: [''],
      notes: [''],
      check_out_at: [''],
    });
  }

  loadData(): void {
    this.loading = true;
    const statusParam = this.filterStatus || undefined;
    this.stayService.getStays(0, 100, statusParam).subscribe({
      next: r => { this.stays = r; this.loading = false; },
      error: () => { this.error = 'Error cargando hospedajes'; this.loading = false; }
    });
    this.roomService.getRooms(0, 100, 'available').subscribe({ next: r => this.rooms = r });
    this.roomService.getRoomRates(0, 100).subscribe({ next: r => this.rates = r });
  }

  openCreate(): void { this.stayForm.reset(); this.showModal = true; }
  closeCreate(): void { this.showModal = false; }

  openEdit(stay: Stay): void {
    this.editingStay = stay;
    this.editForm.patchValue({ status: stay.status, payment_status: stay.payment_status, notes: stay.notes, check_out_at: stay.check_out_at });
    this.showEditModal = true;
  }
  closeEdit(): void { this.showEditModal = false; this.editingStay = null; }

  submitCreate(): void {
    if (this.stayForm.invalid) return;
    this.submitting = true;
    const data: StayCreate = this.stayForm.value;
    this.stayService.createStay(data).subscribe({
      next: () => { this.closeCreate(); this.loadData(); this.showSuccess('Hospedaje creado'); this.submitting = false; },
      error: () => this.submitting = false
    });
  }

  submitEdit(): void {
    if (!this.editingStay) return;
    this.submitting = true;
    const data: StayUpdate = this.editForm.value;
    this.stayService.updateStay(this.editingStay.id, data).subscribe({
      next: () => { this.closeEdit(); this.loadData(); this.showSuccess('Hospedaje actualizado'); this.submitting = false; },
      error: () => this.submitting = false
    });
  }

  checkIn(stay: Stay): void {
    this.stayService.checkIn(stay.id).subscribe({ next: () => { this.loadData(); this.showSuccess('Check-in registrado'); } });
  }

  checkOut(stay: Stay): void {
    if (!confirm('¿Realizar check-out?')) return;
    this.stayService.checkOut(stay.id).subscribe({ next: () => { this.loadData(); this.showSuccess('Check-out registrado'); } });
  }

  deleteStay(stay: Stay): void {
    if (!confirm(`¿Cancelar hospedaje #${stay.id}?`)) return;
    this.stayService.deleteStay(stay.id).subscribe({ next: () => { this.loadData(); this.showSuccess('Hospedaje cancelado'); } });
  }

  applyFilter(): void { this.loadData(); }

  getRoomNumber(id: number): string { return this.rooms.find(r => r.id === id)?.room_number ?? `#${id}`; }
  getRateName(id: number): string { return this.rates.find(r => r.id === id)?.name ?? `#${id}`; }

  showSuccess(msg: string): void { this.successMsg = msg; setTimeout(() => this.successMsg = null, 3000); }

  get activeCount() { return this.stays.filter(s => s.status === 'active').length; }
  get pendingCount() { return this.stays.filter(s => s.status === 'pending').length; }
  get totalRevenue() { return this.stays.reduce((acc, s) => acc + (s.amount_paid || 0), 0); }
}
