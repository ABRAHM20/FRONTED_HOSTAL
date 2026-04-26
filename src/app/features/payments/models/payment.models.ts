/**
 * Pago
 */
export interface Payment {
  id: number;
  stay_id: number;
  amount: number;
  type: 'initial' | 'partial' | 'full' | 'extra';
  payment_method: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  reference?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Request para crear pago
 */
export interface PaymentCreate {
  stay_id: number;
  amount: number;
  type: 'initial' | 'partial' | 'full' | 'extra';
  payment_method?: string;
  reference?: string;
  notes?: string;
}

/**
 * Request para actualizar pago
 */
export interface PaymentUpdate {
  amount?: number;
  type?: string;
  payment_method?: string;
  status?: string;
  reference?: string;
  notes?: string;
}
