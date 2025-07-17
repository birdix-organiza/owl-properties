import { PropertiesPanel } from '../src/index';
import { Component, mount, useState, xml, useEffect } from '@odoo/owl';

class TabContent extends Component {
  static props = {
    label: {
      type: String,
      optional: true,
    },
  };

  static template = xml`
    <div>
      <t t-esc="props.label"/>
    </div>
  `;

  setup() {
    console.log(11);
  }
}

class App extends Component {
  static components = {
    PropertiesPanel,
  };

  static template = xml`
<div style="width: 100%; height: 100%;padding: 10px;box-sizing: border-box;">
  <div style="width: 300px; height: 100%;background-color: white;">
    <PropertiesPanel tabs="state.tabs" active="state.active" onChangeTab.bind="onChangeTab" />
  </div>
</div>`;

  testValue = 'test';

  setup() {
    useEffect(
      () => {
        setTimeout(() => {
          this.testValue = 'text2';
          this.state.tabs[0].properties[1].value = this.testValue;
        }, 2000);
      },
      () => [],
    );

    this.state = useState({
      active: 'tab1',
      tabs: [
        {
          label: 'Tab 1',
          key: 'tab1',
          properties: [
            {
              label: '属性',
              key: 'group1',
              type: 'input',
            },
            {
              label: '样式',
              key: 'group2',
              type: 'text',
              extra: {},
              value: this.testValue,
            },
            {
              span: 2,
              label: '事件',
              key: 'group3',
              type: 'number',
              extra: {
                step: 0.1,
              },
            },
            {
              label: '选择器',
              key: 'group4',
              type: 'select',
              extra: {
                options: [
                  { label: '选项1', value: 'option1' },
                  { label: '选项2', value: 'option2' },
                ],
              },
            },
            {
              label: '布尔选择器',
              key: 'group5',
              type: 'switch',
            },
            {
              label: '滑块选择器',
              key: 'group6',
              type: 'slider',
              extra: {
                max: 5,
                step: 0.1,
                decimals: 1,
              },
            },
          ],
        },
        {
          label: 'Tab 2',
          key: 'tab2',
          component: TabContent,
          props: {
            label: 'Tab 2',
          },
        },
        {
          label: 'Tab 3',
          key: 'tab3',
          component: TabContent,
          props: {
            label: 'Tab 3',
          },
        },
        {
          label: 'Tab 4',
          key: 'tab4',
          component: TabContent,
          props: {
            label: 'Tab 4',
          },
        },
        {
          label: 'Tab 5',
          key: 'tab5',
          component: TabContent,
          props: {
            label: 'Tab 5',
          },
        },
        {
          label: 'Tab 6',
          key: 'tab6',
          component: TabContent,
          props: {
            label: 'Tab 6',
          },
        },
        {
          label: 'Tab 7',
          key: 'tab7',
          component: TabContent,
          props: {
            label: 'Tab 7',
          },
        },
      ],
    });
  }

  onChangeTab(key) {
    this.state.active = key;
  }
}

/**
 * Render the Root component in the given element
 * @param el {HTMLElement}
 */
const render = async (el) => {
  return await mount(App, el, {
    dev: true,
  });
};

render(document.getElementById('app'));
