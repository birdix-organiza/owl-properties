import { xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Input extends BaseRenderer {
  static template = xml`
<input
  class="input"
  t-att-class="props.className"
  t-att-disabled="props.readonly"
  type="text"
  t-att-placeholder="props.placeholder"
  t-att-value="props.value?.()"
  t-on-change="onChangeText"
/>
  `;

  onChangeText(ev: Event) {
    const val = (ev.target as HTMLInputElement).value;
    this.props.onChange?.(val);
    this.fireChange(val);
  }
}
