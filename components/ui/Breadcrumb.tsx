import type { BreadcrumbList } from "apps/commerce/types.ts";
import { ComponentChildren } from "preact";
import { AnatomyClasses, handleClasses } from "../../sdk/styles.ts";

const anatomy = [
  "breadcrumbStyle",
] as const;

type BreadcrumbStyle = AnatomyClasses<typeof anatomy[number]>;

interface BreadcrumbProps {
  itemListElement: BreadcrumbList["itemListElement"];
  classes?: BreadcrumbStyle;
  children?: ComponentChildren;
}

function Breadcrumb(
  { itemListElement = [], classes, children }: BreadcrumbProps,
) {
  const items = [...itemListElement];
  return (
    <div>
      <ul class={handleClasses(classes?.breadcrumbStyle)}>
        {items
          .filter(({ name, item }) => name && item)
          .map(({ name, item }, i) => (
            <>
              {i > 0 ? children : null}
              <li>
                <a href={item}>{name}</a>
              </li>
            </>
          ))}
      </ul>
    </div>
  );
}

export default Breadcrumb;
