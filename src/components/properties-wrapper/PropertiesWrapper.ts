import { Component, xml } from '@odoo/owl';
import { PropertyRenderer } from './PropertyRenderer';
import { classNames } from '@/utils/classNames';

interface PropertiesWrapperProps {
  properties: Array<{
    label: string;
    key: string;
    value?: () => any;
    decimals?: number;
    type?: String | Component;
    hidden?: () => boolean;
    required?: boolean;
    readonly?: () => boolean;
    onChange?: (value: any) => void;
  }>;
}

export class PropertiesWrapper extends Component<PropertiesWrapperProps> {
  static props = {
    properties: {
      type: Array,
      optional: true,
      element: {
        type: Object,
        shape: {
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
          type: [String, Function], // 值类型，可以是字符串或Componet组件
          hidden: {
            type: Function,
            optional: true,
          },
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
        },
      },
    },
  };

  static defaultProps = {
    properties: [],
  };

  static components = {
    PropertyRenderer,
  };

  omitProps(property: any) {
    const { hidden, ...rest } = property;
    return rest;
  }

  static template = xml`
    <div class="${classNames('&properties-wrapper')}">
      <t t-foreach="props.properties" t-as="property" t-key="property.key">
        <div class="${classNames('&property-item')}" t-if="!property.hidden?.()">
            <label class="${classNames('&property-label')}" t-att-class="property.required ? 'required' : ''">
                <t t-esc="property.label"/>
            </label>
            <PropertyRenderer property="omitProps(property)"/>
        </div>
      </t>
    </div>
  `;
}
