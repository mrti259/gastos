import { Filter } from "../Database";
import { PageProperty, Property } from "./Property";

export class NumberProperty extends Property<number> {
  protected _filter(value: number): Filter {
    return {
      property: this.name,
      number: value ? { equals: value } : { is_empty: true },
    };
  }

  mapValue(value: number): PageProperty {
    return { number: value };
  }

  mapPageProperty(pageProperty: PageProperty): number {
    return pageProperty.number;
  }
}
