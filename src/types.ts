import { LucideIcon } from 'lucide-react';

export interface Character {
  name: string;
  role: string;
  description: string;
  color: string;
  imageSrc?: string;
  icon?: LucideIcon;
}

export interface Shortcut {
  action: string;
  buttons: string[];
}

export enum Tab {
  GAME = 'GAME',
  PRODUCTS = 'PRODUCTS',
  PARTNERS = 'PARTNERS'
}
