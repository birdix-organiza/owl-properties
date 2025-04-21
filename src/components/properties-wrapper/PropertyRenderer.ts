import { Component, xml } from '@odoo/owl';
import { classNames } from '@/utils/classNames';

export interface PropertyRendererProps {
  property: {
    label: string;
    key: string;
    value?: () => any;
    decimals?: number;
    step?: number;
    min?: number;
    max?: number;
    type?: String | Component;
    required?: boolean;
    readonly?: () => boolean;
    onChange?: (value: any) => void;
  };
}

/**
 * 基础属性验证器
 * 定义了共用的属性验证规则
 */
export const BasePropertyShape = {
  label: String,
  key: String,
  value: {
    type: Function,
    optional: true,
  },
  decimals: {
    type: Number,
    optional: true,
  },
  step: {
    type: Number,
    optional: true,
  },
  min: {
    type: Number,
    optional: true,
  },
  max: {
    type: Number,
    optional: true,
  },
  type: [String, Function], // 值类型，可以是字符串或Componet组件
  required: {
    type: Boolean,
    optional: true,
  },
  readonly: {
    type: Function,
    optional: true,
  },
  onChange: {
    type: Function,
    optional: true,
  },
};

/**
 * 属性渲染器的Props验证器
 */
export const PropertyRendererPropsValidator = {
  property: {
    type: Object,
    shape: BasePropertyShape,
  },
};

export class PropertyRenderer extends Component<PropertyRendererProps> {
  static props = PropertyRendererPropsValidator;

  static template = xml`
    <div class="${classNames('&property-renderer')}" t-attf-class="props.property.type">
      <t t-if="props.property.type === 'input'">
            <input 
                t-att-disabled="props.property.readonly" 
                type="text" 
                class="form-control" 
                t-att-value="props.property.value?.()" 
                t-on-change="onChangeText"
            />
        </t>
        <t t-elif="props.property.type === 'text'">
            <textarea type="text" class="form-control"
                t-att-disabled="props.property.readonly" 
                t-att-value="props.property.value?.()" 
                t-on-change="onChangeText"
                t-att-rows="props.property.rows"
            />
        </t>
        <t t-elif="props.property.type === 'boolean'">
            <CheckBox value="props.property.value?.()" disabled="props.property.readonly" onChange.bind="onChangeBoolean">
                Enable
            </CheckBox>
            <span class="border-bottom"/>
        </t>
        <t t-elif="props.property.type === 'select'">
        </t>
        <t t-elif="props.property.type === 'number'">
            <input
                t-att-disabled="props.property.readonly"
                t-att-value="this.numberFormatter(props.property.value?.())"
                type="number"
                t-att-step="props.property.step"
                t-att-min="props.property.min"
                t-att-max="props.property.max"
                class="form-control"
                t-on-change="onChangeFloat"
            />
        </t>
        <t t-else="">
            <!-- Custom component logic -->
            <t t-component="props.property.type" t-props="props.property.props" onChange.bind="fireChange"/>
        </t>
    </div>
  `;

  getDecimals() {
    return this.props.property.decimals ?? 1;
  }

  numberFormatter(value?: number) {
    if (value === undefined) {
      return '';
    }
    return value.toFixed(this.getDecimals());
  }

  fireChange() {}

  onChangeFloat(ev: Event) {
    let val = parseFloat((ev.target as HTMLInputElement).value);
    if (isNaN(val)) {
      val = 0;
    }
    const decimals = this.getDecimals();
    const factor = Math.pow(10, decimals);
    // 根据指定的小数位数进行四舍五入
    val = Math.round(val * factor) / factor;
    (ev.target as HTMLInputElement).value = val.toString();
    this.props.property.onChange?.(val);
  }

  onChangeText(ev: Event) {
    this.props.property.onChange?.((ev.target as HTMLInputElement).value);
  }

  onChangeBoolean(isChecked: boolean) {
    this.props.property.onChange?.(isChecked);
  }
}
