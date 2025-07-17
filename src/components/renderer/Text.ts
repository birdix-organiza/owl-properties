import { xml } from '@odoo/owl';
import { Input } from './Input';

export class Text extends Input {
  static template: string = xml`
<textarea 
  type="text"
  class="textarea"
  t-att-class="props.className"
  t-att-disabled="props.readonly"
  t-att-value="state.value"
  t-on-change="onChangeText"
  t-att-placeholder="props.placeholder"
  t-att-rows="props.extra?.rows || 1"
  style="resize: vertical;"
/>
  `;
}
