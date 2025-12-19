import { useEffect, useRef, xml } from '@odoo/owl';
import { TagInput as TagInputComponent } from 'owl-tiptap';
import { BaseRenderer } from './BaseRenderer';

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
    ref="(r) => this.tagInputRef = r"
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

  tagInputRef = undefined;

  setup(): void {
    super.setup();

    useEffect(
      () => {
        this.tagInputRef?.setContent(this.state.value);
      },
      () => [this.state.value],
    );
  }
}
