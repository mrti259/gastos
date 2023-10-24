import { Filter } from "../Database";
import { PageProperty, Property } from "./Property";

export class CheckboxProperty extends Property<boolean> {
  protected _filter(value: boolean): Filter {
    return {
      property: this.name,
      checkbox: { equals: value },
    };
  }

  mapValue(value: boolean): PageProperty {
    return { checkbox: value };
  }

  mapPageProperty(pageProperty: PageProperty): boolean {
    return pageProperty.checkbox;
  }
}
