import { Component, xml } from '@odoo/owl';
import { PropertyRenderer, PropertyRendererProps, BasePropertyShape } from './PropertyRenderer';
import { classNames } from '../../utils/classNames';
import './PropertiesWrapper.scss';

export type BaseProperty = PropertyRendererProps['property'] & {
  hidden?: () => boolean;
};

export interface PropertiesWrapperProps {
  properties: Array<BaseProperty>;
  cols?: number;
}

/**
 * 属性验证器 - 带隐藏属性
 */
export const PropertyWithHiddenShape = {
  ...BasePropertyShape,
  hidden: {
    type: Function,
    optional: true,
  },
};

/**
 * 属性包装器的Props验证器
 */
export const PropertiesWrapperPropsValidator = {
  properties: {
    type: Array,
    optional: true,
    element: {
      type: Object,
      shape: PropertyWithHiddenShape,
    },
  },
  cols: {
    type: Number,
    optional: true,
  },
};

export class PropertiesWrapper extends Component<PropertiesWrapperProps> {
  static props = PropertiesWrapperPropsValidator;

  static defaultProps = {
    properties: [],
    cols: 2,
  };

  static components = {
    PropertyRenderer,
  };

  omitProps(property: any) {
    const { hidden, ...rest } = property;
    return rest;
  }

  static template = xml`
    <div class="${classNames('&properties-wrapper')}" t-attf-style="grid-template-columns: repeat({{props.cols}}, 1fr);">
      <t t-foreach="props.properties" t-as="property" t-key="property.key">
        <div class="${classNames('&property-item')}" t-if="!property.hidden?.()" t-att-data-type="property.type">
            <label class="${classNames('&property-label')}" t-att-class="property.required ? 'required' : ''">
                <t t-esc="property.label"/>
            </label>
            <PropertyRenderer property="omitProps(property)"/>
        </div>
      </t>
    </div>
  `;
}
