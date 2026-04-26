import { Room } from '../../rooms/models/room.models';

/**
 * Alquiler/Hospedaje
 */
export interface Stay {
  id: number;
  room_id: number;
  user_id?: number;
  room_plan_id: number;
  rate_id: number;
  check_in_at?: string;
  check_out_at?: string;
  status: 'pending' | 'active' | 'finished' | 'cancelled';
  payment_status: 'pending' | 'partial' | 'paid';
  total_price: number;
  amount_paid: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  room?: Room;
  services?: any[];
  payments?: any[];
}

/**
 * Request para crear alquiler
 */
export interface StayCreate {
  room_id: number;
  user_id?: number;
  room_plan_id: number;
  rate_id: number;
  check_in_at?: string;
  check_out_at?: string;
  notes?: string;
}

/**
 * Request para actualizar alquiler
 */
export interface StayUpdate {
  user_id?: number;
  check_in_at?: string;
  check_out_at?: string;
  status?: string;
  payment_status?: string;
  total_price?: number;
  amount_paid?: number;
  notes?: string;
}
