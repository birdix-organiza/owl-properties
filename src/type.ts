import type { Component } from '@odoo/owl';

export interface PropertyItem {
  label: string;
  key: string;
  type: string;
  readonly?: () => boolean;
  required?: () => boolean;
  invisible?: () => boolean;
  value?: any;
  extra?: Record<string, any>;
  onChange?: (value: any, options?: any) => void;
  span?: number;
}

export interface TabItem {
  label: string;
  key: string;
  properties?: PropertyItem[];
  component?: typeof Component;
  cols?: number;
  props?: Record<string, any>;
}
