import { xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Select extends BaseRenderer {
  static template = xml`
<select
  class="select pro-property-renderer-content"
  t-att-class="props.className"
  t-att-disabled="readonly"
  t-model="state.value"
  t-on-change="onChangeSelect"
>
  <option t-if="props.placeholder" value="" selected="!state.value">{{props.placeholder}}</option>
  <t t-foreach="props.extra?.options || []" t-as="option" t-key="option.value">
    <option t-att-value="option.value">
      <t t-esc="option.label" />
    </option>
  </t>
</select>
  `;

  format(value: any) {
    return value ?? '';
  }

  onChangeSelect(ev: Event) {
    const val = (ev.target as HTMLSelectElement).value;
    this.state.value = val;
    this.props.onChange?.(val);
    this.fireChange(val);
  }
}
