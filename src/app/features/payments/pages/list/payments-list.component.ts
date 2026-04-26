import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payment, PaymentCreate } from '../../models/payment.models';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-payments-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payments-list.component.html',
  styleUrls: ['./payments-list.component.scss']
})
export class PaymentsListComponent implements OnInit {
  payments: Payment[] = [];
  loading = false;
  successMsg: string | null = null;
  showModal = false;
  submitting = false;

  paymentForm!: FormGroup;

  typeOptions = [
    { value: 'initial', label: 'Inicial' },
    { value: 'partial', label: 'Parcial' },
    { value: 'full', label: 'Total' },
    { value: 'extra', label: 'Extra' },
  ];

  methodOptions = ['Efectivo', 'Tarjeta Débito', 'Tarjeta Crédito', 'Transferencia', 'QR/Billetera Digital'];

  statusMap: Record<string, string> = {
    pending: 'Pendiente', completed: 'Completado', failed: 'Fallido', cancelled: 'Cancelado'
  };
  typeMap: Record<string, string> = {
    initial: 'Inicial', partial: 'Parcial', full: 'Total', extra: 'Extra'
  };

  constructor(private paymentService: PaymentService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.paymentForm = this.fb.group({
      stay_id: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      type: ['partial', Validators.required],
      payment_method: ['Efectivo'],
      reference: [''],
      notes: [''],
    });
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.paymentService.getPayments(0, 100).subscribe({
      next: r => { this.payments = r; this.loading = false; },
      error: () => this.loading = false
    });
  }

  openCreate(): void { this.paymentForm.reset({ type: 'partial', payment_method: 'Efectivo', amount: 0 }); this.showModal = true; }
  closeModal(): void { this.showModal = false; }

  submit(): void {
    if (this.paymentForm.invalid) return;
    this.submitting = true;
    const data: PaymentCreate = this.paymentForm.value;
    this.paymentService.createPayment(data).subscribe({
      next: () => { this.closeModal(); this.loadPayments(); this.showSuccess('Pago registrado'); this.submitting = false; },
      error: () => this.submitting = false
    });
  }

  deletePayment(p: Payment): void {
    if (!confirm(`¿Eliminar pago #${p.id}?`)) return;
    this.paymentService.deletePayment(p.id).subscribe({ next: () => { this.loadPayments(); this.showSuccess('Pago eliminado'); } });
  }

  showSuccess(msg: string): void { this.successMsg = msg; setTimeout(() => this.successMsg = null, 3000); }

  get totalCompleted() { return this.payments.filter(p => p.status === 'completed').reduce((acc, p) => acc + p.amount, 0); }
  get completedCount() { return this.payments.filter(p => p.status === 'completed').length; }
}
