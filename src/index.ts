import { Component, xml, useState } from '@odoo/owl';
import { Tab, tabProps, TabProps } from '@/components/Tab';
import { classNames } from '@/utils/classNames';
import { Empty } from '@/components/Empty';
import './index.scss';

interface PropertiesPanelProps {
  defaultActive: string;
  tabs: Array<TabProps>;
  forceRender?: boolean;
  onChangeTab?: (tab: string) => void;
}

export class PropertiesPanel extends Component<PropertiesPanelProps> {
  static props = {
    defaultActive: {
      type: String,
      optional: true,
    },
    tabs: {
      type: Array,
      optional: true,
      element: tabProps,
    },
    forceRender: {
      type: Boolean,
      optional: true,
    },
    onChangeTab: {
      type: Function,
      optional: true,
    },
  };

  static defaultProps = {
    defaultActive: '',
    tabs: [],
    forceRender: false,
  };

  static components = {
    Tab,
    Empty,
  };

  static template = xml`
    <div class="${classNames('&properties-panel')}">
      <div t-if="props.tabs.length" class="${classNames('&properties-tabs-container')}">
        <Tab tabs="props.tabs" active="state.active" onChange.bind="onChangeTab" className="'${classNames('&properties-tab')}'"/>
        <div class="${classNames('&properties-tab-content-container')}">
          <t t-if="props.forceRender">
            <div t-foreach="props.tabs" t-as="tab" t-key="tab.value" 
               class="${classNames('&properties-tab-content')}"
               t-att-class="{ invisible: state.active !== tab.value, '${classNames('&properties-tab-active')}': state.active === tab.value }">
              <t t-if="tab.component" t-component="tab.component" t-props="tab.props"/>
            </div>
          </t>
          <t t-else="">
            <t t-foreach="props.tabs.filter((tab) => tab.value === state.active)" t-as="tab" t-key="tab.value">
              <div class="${classNames('&properties-tab-content')} ${classNames('&properties-tab-active')}">
                <t t-if="tab.component" t-component="tab.component" t-props="tab.props"/>
              </div>
            </t>
          </t>
        </div>
      </div>
      <div t-else="" class="${classNames('&properties-empty-wrapper')}" style="height: 100%; position: relative;">
        <Empty />
      </div>
    </div>
  `;

  state = useState({
    active: this.props.defaultActive,
  });

  onChangeTab(tab: string) {
    this.state.active = tab;
    this.props.onChangeTab?.(tab);
  }
}
