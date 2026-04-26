import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room, RoomPlan, RoomType, RoomRateCreate, RoomCreate, RoomTypeCreate, RoomPlanCreate } from '../../models/room.models';
import { RoomService } from '../../services/room.service';

type ModalMode = 'none' | 'createRoom' | 'editRoom' | 'createType' | 'createPlan';

@Component({
  selector: 'app-rooms-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rooms-list.component.html',
  styleUrls: ['./rooms-list.component.scss']
})
export class RoomsListComponent implements OnInit {
  rooms: Room[] = [];
  roomPlans: RoomPlan[] = [];
  roomTypes: RoomType[] = [];
  loading = false;
  error: string | null = null;
  successMsg: string | null = null;
  modalMode: ModalMode = 'none';
  editingRoom: Room | null = null;
  submitting = false;
  activeTab: 'rooms' | 'types' | 'plans' = 'rooms';

  roomForm!: FormGroup;
  typeForm!: FormGroup;
  planForm!: FormGroup;

  statusOptions = [
    { value: 'available', label: 'Disponible', class: 'status-available' },
    { value: 'occupied', label: 'Ocupada', class: 'status-occupied' },
    { value: 'cleaning', label: 'Limpieza', class: 'status-cleaning' },
    { value: 'maintenance', label: 'Mantenimiento', class: 'status-maintenance' },
    { value: 'blocked', label: 'Bloqueada', class: 'status-blocked' },
  ];

  constructor(private roomService: RoomService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.buildForms();
    this.loadAll();
  }

  buildForms(): void {
    this.roomForm = this.fb.group({
      room_number: ['', [Validators.required]],
      room_plan_id: ['', [Validators.required]],
      floor: [null],
      notes: [''],
    });
    this.typeForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
    });
    this.planForm = this.fb.group({
      room_type_id: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: [''],
    });
  }

  loadAll(): void {
    this.loading = true;
    this.roomService.getRooms(0, 100).subscribe({ next: r => { this.rooms = r; this.loading = false; }, error: () => { this.error = 'Error cargando habitaciones'; this.loading = false; } });
    this.roomService.getRoomPlans(0, 100).subscribe({ next: r => this.roomPlans = r });
    this.roomService.getRoomTypes(0, 100).subscribe({ next: r => this.roomTypes = r });
  }

  openCreateRoom(): void { this.roomForm.reset(); this.editingRoom = null; this.modalMode = 'createRoom'; }
  openEditRoom(room: Room): void {
    this.editingRoom = room;
    this.roomForm.patchValue({ room_number: room.room_number, room_plan_id: room.room_plan_id, floor: room.floor, notes: room.notes });
    this.modalMode = 'editRoom';
  }
  openCreateType(): void { this.typeForm.reset(); this.modalMode = 'createType'; }
  openCreatePlan(): void { this.planForm.reset(); this.modalMode = 'createPlan'; }
  closeModal(): void { this.modalMode = 'none'; this.editingRoom = null; }

  submitRoom(): void {
    if (this.roomForm.invalid) return;
    this.submitting = true;
    const data: RoomCreate = this.roomForm.value;
    const obs = this.editingRoom
      ? this.roomService.updateRoom(this.editingRoom.id, data)
      : this.roomService.createRoom(data);
    obs.subscribe({
      next: () => { this.closeModal(); this.loadAll(); this.showSuccess(this.editingRoom ? 'Habitación actualizada' : 'Habitación creada'); this.submitting = false; },
      error: () => { this.submitting = false; }
    });
  }

  submitType(): void {
    if (this.typeForm.invalid) return;
    this.submitting = true;
    const data: RoomTypeCreate = this.typeForm.value;
    this.roomService.createRoomType(data).subscribe({
      next: () => { this.closeModal(); this.loadAll(); this.showSuccess('Tipo de habitación creado'); this.submitting = false; },
      error: () => { this.submitting = false; }
    });
  }

  submitPlan(): void {
    if (this.planForm.invalid) return;
    this.submitting = true;
    const data: RoomPlanCreate = this.planForm.value;
    this.roomService.createRoomPlan(data).subscribe({
      next: () => { this.closeModal(); this.loadAll(); this.showSuccess('Plan de habitación creado'); this.submitting = false; },
      error: () => { this.submitting = false; }
    });
  }

  changeStatus(room: Room, status: string): void {
    this.roomService.changeRoomStatus(room.id, status).subscribe({ next: () => this.loadAll() });
  }

  deleteRoom(room: Room): void {
    if (!confirm(`¿Eliminar habitación ${room.room_number}?`)) return;
    this.roomService.deleteRoom(room.id).subscribe({ next: () => { this.loadAll(); this.showSuccess('Habitación eliminada'); } });
  }

  getStatusLabel(status: string): string {
    return this.statusOptions.find(s => s.value === status)?.label ?? status;
  }

  getPlanName(id: number): string {
    return this.roomPlans.find(p => p.id === id)?.name ?? '-';
  }

  getTypeName(id: number): string {
    return this.roomTypes.find(t => t.id === id)?.name ?? '-';
  }

  showSuccess(msg: string): void {
    this.successMsg = msg;
    setTimeout(() => this.successMsg = null, 3000);
  }

  get filteredRoomsAvailable() { return this.rooms.filter(r => r.status === 'available').length; }
  get filteredRoomsOccupied() { return this.rooms.filter(r => r.status === 'occupied').length; }
}
