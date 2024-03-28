interface Props {
  variant?: "active" | "disabled" | "default";
  image: string;
  onClick: (e: MouseEvent) => void;
  size?: string;
}

function AvatarColor(
  { variant = "default", image, onClick, size = "25px" }: Props,
) {
  return (
    <div
      class={`cursor-pointer avatar placeholder flex justify-center items-center`}
      onClick={onClick}
    >
      <div
        class={`flex justify-center p-[1px] items-center w-full rounded-2xl overflow-hidden h-full border ${
          variant == "active" ? "border-black" : "hover:border-gray-700"
        }   `}
      >
        <img
          class={`rounded-2xl w-full h-full`}
          style={{ maxWidth: size }}
          src={image}
          loading="lazy"
          alt="color-thumbnail"
        />
      </div>
    </div>
  );
}

export default AvatarColor;
