export interface Menu {
  id: string;
  name: string;
  public_id: string;
  updated_at: number;
  created_at: number;
}

export interface MenuItem {
  id: string;
  name: string;
  updated_at: number;
  created_at: number;
}

export interface MenuRequest {
  name: string;
}

export interface MenuItemRequest {
  name: string;
}

export interface MenuDeleteRequest {
  id: string;
}

export interface MenuUpdateRequest {
  id: string;
  name: string;
}

export interface OrderItem {
  name: string;
}

export interface Order {
  id: string;
  menu_id: string;
  customer_name: string;
  status: string;
  created_at: number;
  updated_at: number;
}

export interface OrderDetails {
  order: Order;
  items: string[];
}

export interface OrdersItems {
  order_id: string;
  customer_name: string;
  item_name: string;
  item_id: string;
  order_status: string;
}
