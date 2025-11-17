import { Component, xml, useState } from '@odoo/owl';
import { classNames } from './utils/classNames';
import { Empty } from './components/empty/Empty';
import './index.scss';

interface PropertyItem {
  label: string;
  key: string;
  type: string;
  readonly?: () => boolean;
  value?: any;
  extra?: Record<string, any>;
  onChange?: (value: any, options?: any) => void;
  span?: number;
}

interface TabItem {
  label: string;
  key: string;
  properties?: PropertyItem[];
  component?: typeof Component;
  props?: Record<string, any>;
}

interface PropertiesPanelProps {
  tabs: TabItem[];
  active: string;
  onChangeTab: (key: string) => void;
}

export class PropertiesPanel extends Component<PropertiesPanelProps> {
  static props = {
    tabs: {
      type: Array,
      optional: true,
    },
    active: {
      type: String,
      optional: true,
    },
    onChangeTab: {
      type: Function,
      optional: true,
    },
  };

  static defaultProps = {
    tabs: [],
  };

  static components = {
    Empty,
  };

  state = useState({
    activeTab: this.props.active || this.props.tabs[0].key,
  });

  setup() {}

  get currentTab() {
    return this.props.tabs.find((tab) => tab.key === this.state.activeTab) || this.props.tabs[0];
  }

  switchTab(key: string) {
    this.state.activeTab = key;
    this.props.onChangeTab(key);
  }

  static template = xml`
<div class="${classNames('&properties-panel')}">
  <div class="${classNames('&properties-tabs-container')}">
    <div class="${classNames('&properties-tabs-container-inner')}">
      <t t-foreach="props.tabs" t-as="tab" t-key="tab.key">
        <div
          class="${classNames('&properties-tab')}"
          t-att-class="{'active': this.state.activeTab === tab.key}"
          t-on-click="() => this.switchTab(tab.key)"
        >
          <t t-esc="tab.label"/>
        </div>
      </t>
    </div>
  </div>
  
  <div class="${classNames('&properties-panel__content')}">
    <t t-if="currentTab.properties">
      <div class="${classNames('&properties-panel__properties')}">
        <t t-foreach="currentTab.properties" t-as="property" t-key="property.key">
          
        </t>
      </div>
    </t>
    
    <t t-elif="currentTab.component">
      <t t-component="currentTab.component" t-props="currentTab.props || {}" />
    </t>
    
    <div t-else="" class="${classNames('&properties-empty-wrapper')}">
      <Empty />
    </div>
  </div>
</div>
  `;
}
