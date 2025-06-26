import { useState, xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Boolean extends BaseRenderer {
  static template = xml`
    <div class="boolean" t-att-class="props.className">
      <div class="pro-switch" t-att-class="state.value ? 'on' : 'off' + (readonly ? ' pro-switch-disabled' : '')" t-on-click="onToggle">
      <span class="pro-switch-inner">
        <span class="pro-switch-inner-checked"><t t-esc="props.extra?.trueLabel || '开启'" /></span>
        <span class="pro-switch-inner-unchecked"><t t-esc="props.extra?.falseLabel || '关闭'" /></span>
      </span>
      <span class="pro-switch-handle"></span>
    </div>
    </div>
  `;

  state = useState({
    value: this.props.value?.() ?? false,
  });

  onToggle() {
    if (this.readonly) return;
    const newValue = !this.state.value;
    this.state.value = newValue;
    this.props.onChange?.(newValue);
    this.fireChange(newValue);
  }
}
