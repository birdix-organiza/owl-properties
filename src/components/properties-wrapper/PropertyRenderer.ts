import { Component, xml } from '@odoo/owl';
import { classNames } from '../../utils/classNames';
import './PropertyRenderer.scss';

export interface PropertyRendererProps {
  property: {
    span?: number;
    label: string;
    key: string;
    placeholder?: string;
    value?: () => any;
    extra?: Record<string, any>;
    type?: String;
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
  span: {
    type: Number,
    optional: true,
  },
  placeholder: {
    type: String,
    optional: true,
  },
  extra: {
    type: Object,
    optional: true,
  },
  type: String, // 注册字段的类型值
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
<t t-set="renderer" t-value="getComponent(this.props.property.type)"/>
<t t-if="renderer">
  <div class="${classNames('&property-renderer')}">
    <t t-component="renderer" t-props="props.property" className="'${classNames('&property-renderer-content')}'"/>
  </div>
</t>
<t t-else="">
  <div>no registry renderer finded</div>  
</t>
  `;

  getComponent(type: string): typeof Component {
    return (this.env.registry as Map<string, typeof Component>).get(type);
  }
}
