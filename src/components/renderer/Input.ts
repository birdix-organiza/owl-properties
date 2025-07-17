import { xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Input extends BaseRenderer {
  static template = xml`
<input
  class="input"
  t-att-class="props.className"
  t-att-disabled="readonly"
  type="text"
  t-att-placeholder="props.placeholder"
  t-model="state.value"
  t-on-change="onChangeText"
/>
  `;

  format(value: any) {
    return value ?? '';
  }

  onChangeText(ev: Event) {
    const val = (ev.target as HTMLInputElement).value;
    this.state.value = val;
    this.props.onChange?.(val);
    this.fireChange(val);
  }
}
