/**
 * This component renders the filter and selectors for skus.
 * TODO: Figure out a better name for this component.
 */

interface Props {
  variant?: "active" | "disabled" | "default";
  content: string;
}

const variants = {
  active: "text-base-200 bg-primary ring-1 ring-primary rounded-full",
  disabled:
    `text-base-content ring-1 ring-base-300 relative rounded-full after:absolute after:top-1/2 after:h-[2px] after:-left-[5%] after:bg-primary after:w-[110%] after:block after:rotate-[20deg] after:content-[""]`,
  default: "text-base-content bg-base-200 ring-1 ring-base-300 rounded-full",
};

function Avatar({ content, variant = "default" }: Props) {
  return (
    <div class="placeholder text-sm font-light max-h-6 min-w-9">
      <div
        class={`${variants[variant]} px-5 py-1 hover:ring-base-content`}
      >
        <span class="uppercase ">
          {content.substring(0, 3)}
        </span>
      </div>
    </div>
  );
}

export default Avatar;
