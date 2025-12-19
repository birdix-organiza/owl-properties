import { xml, useRef, useEffect } from '@odoo/owl';
import { BaseRenderer } from './BaseRenderer';
import { TagInput as TagInputComponent } from 'owl-tiptap';

export class TagInput extends BaseRenderer {
  static components = {
    TagInputComponent,
  };

  static template = xml`
<div
  t-ref="refer"
  class="tag-input"
  t-att-class="props.className"
>
  <TagInputComponent 
    placeholder="props.placeholder" 
    char="props.extra?.char" 
    items="props.extra?.items" 
    onChange.bind="onChange" 
    readonly="props.readonly"
    onSuggestionSelect="props.extra?.onSuggestionSelect"
    onTagClick="props.extra?.onTagClick"
    slots="props.extra?.slots"/>
</div>
  `;

  refer = useRef('refer');

  setup(): void {
    super.setup();

    useEffect(
      () => {
        return () => {};
      },
      () => [],
    );
  }
}
