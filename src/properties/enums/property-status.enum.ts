export enum BuildingStatus {
    WORKING = 'working',
    REQUIRES_MAINTENANCE = 'requires maintenance',
    UNDERGOING_MAINTENANCE = 'undergoing maintenance',
    DELAPIDATED = 'delapidated',
  }
  
  export enum ShopStatus {
    OCCUPIED = 'occupied',
    VACANT = 'vacant',
  }

  /** Whether the rent for a shop's current tenancy has been paid. */
  export enum PaymentStatus {
    PAID = 'paid',
    PENDING = 'pending',
    OVERDUE = 'overdue',
  }