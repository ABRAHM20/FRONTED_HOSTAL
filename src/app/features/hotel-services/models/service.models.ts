/**
 * Servicio disponible
 */
export interface HotelService {
  id: number;
  name: string;
  description?: string;
  price: number;
  active: number;
  category?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Servicio consumido en alquiler
 */
export interface StayService {
  id: number;
  stay_id: number;
  service_id: number;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Request para crear servicio
 */
export interface HotelServiceCreate {
  name: string;
  description?: string;
  price: number;
  active?: number;
  category?: string;
}

/**
 * Request para agregar servicio a alquiler
 */
export interface StayServiceCreate {
  stay_id: number;
  service_id: number;
  quantity?: number;
  price?: number;
  notes?: string;
}
