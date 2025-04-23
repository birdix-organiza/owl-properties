import { xml } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';

export class Select extends BaseRenderer {
  static template = xml`
<select
  class="select pro-property-renderer-content"
  t-att-class="props.className"
  t-att-disabled="props.readonly"
  t-on-change="onChangeSelect"
>
  <option t-if="props.placeholder" value="" selected="!props.value?.()">{{props.placeholder}}</option>
  <t t-foreach="props.extra?.options || []" t-as="option" t-key="option.value">
    <option t-att-value="option.value" t-att-selected="props.value?.() === option.value">
      <t t-esc="option.label" />
    </option>
  </t>
</select>
  `;

  onChangeSelect(ev: Event) {
    const val = (ev.target as HTMLSelectElement).value;
    this.props.onChange?.(val);
    this.fireChange(val);
  }
}
