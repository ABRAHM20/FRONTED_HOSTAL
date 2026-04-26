/**
 * Tipos de habitación
 */
export interface RoomType {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

/**
 * Planes de habitación
 */
export interface RoomPlan {
  id: number;
  room_type_id: number;
  name: string;
  description?: string;
  created_at: string;
  updated_at: string;
  rates?: RoomRate[];
}

/**
 * Tarifas de habitación
 */
export interface RoomRate {
  id: number;
  room_plan_id: number;
  name: string;
  duration_hours: number;
  price: number;
  order: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Habitación individual
 */
export interface Room {
  id: number;
  room_number: string;
  room_plan_id: number;
  status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'blocked';
  floor?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
  room_plan?: RoomPlan;
}

/**
 * Request para crear tipo de habitación
 */
export interface RoomTypeCreate {
  name: string;
  description?: string;
}

/**
 * Request para crear plan de habitación
 */
export interface RoomPlanCreate {
  room_type_id: number;
  name: string;
  description?: string;
}

/**
 * Request para crear tarifa
 */
export interface RoomRateCreate {
  room_plan_id: number;
  name: string;
  duration_hours: number;
  price: number;
  order?: number;
  active?: boolean;
}

/**
 * Request para crear habitación
 */
export interface RoomCreate {
  room_number: string;
  room_plan_id: number;
  floor?: number;
  notes?: string;
}
