export interface TaxDataRecord {
  id: string;
  timestamp: Date;
  type: 'income' | 'car-benefit' | 'comparison';
  data: Record<string, any>;
  userId?: string;
  name?: string;
}
