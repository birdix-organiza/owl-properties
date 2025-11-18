import { Component, xml, useSubEnv, useEffect } from '@odoo/owl';
import { classNames } from '../../utils/classNames';
import './PropertiesWrapper.scss';

interface PropertiesWrapperProps {
  tab: TabItem;
}

export class PropertiesWrapper extends Component<PropertiesWrapperProps> {
  static props = {
    tab: {
      type: Object,
    },
  };

  static template = xml`
    <div class="${classNames('&properties-wrapper')}" t-attf-style="grid-template-columns: repeat({{cols}}, minmax(0, 1fr));">
      <t t-foreach="properties" t-as="property" t-key="property.key">
        <t t-set="propertyProps" t-value="convertProps(property)"/>
        <div class="${classNames('&property-item')}" t-if="!property.invisible?.()" t-att-data-type="property.type" t-attf-style="grid-column: span {{this.computeSpan(property) ?? 1}};">
            <div class="${classNames('&property-label')}" t-att-class="propertyProps.required ? 'required' : ''">
                <t t-esc="property.label"/>
            </div>
            <t t-set="renderer" t-value="getComponent(property)"/>
            <t t-if="renderer">
              <div class="${classNames('&property-renderer')}">
                <t t-component="renderer" t-props="propertyProps" className="'${classNames('&property-renderer-content')}'"/>
              </div>
            </t>
            <t t-else="">
              <div>no registry renderer finded</div>  
            </t>
        </div>
      </t>
    </div>
    `;

  get cols() {
    return this.props.tab.cols || 1;
  }

  get properties() {
    return this.props.tab.properties || [];
  }

  computeSpan(property: PropertyItem) {
    const col = property.span || 1;
    return col > this.cols ? this.cols : col;
  }

  getComponent(property: PropertyItem) {
    return (this.env.registry as Map<string, typeof Component>).get(property.type);
  }

  convertProps(property: PropertyItem) {
    const { readonly, required, invisible, ...rest } = property;
    return {
      ...rest,
      readonly: readonly?.() ?? false,
      required: required?.() ?? false,
    };
  }

  setup(): void {
    useSubEnv({
      cols: this.cols,
    });
  }
}
