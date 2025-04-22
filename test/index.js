import { Component, mount, useState, xml } from '@odoo/owl';
import { PropertiesPanel } from '@/index';

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
    <PropertiesPanel tabs="state.tabs" defaultActive="'tab1'"/>
  </div>
</div>`;

  setup() {
    this.state = useState({
      tabs: [
        {
          label: 'Tab 1',
          key: 'tab1',
          properties: [
            {
              label: 'Group 1',
              key: 'group1',
              type: 'input',
            },
            {
              label: 'Group 2',
              key: 'group2',
              type: 'text',
              extra: {},
            },
            {
              label: 'Group 2',
              key: 'group3',
              type: 'number',
              extra: {
                step: 0.1,
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
