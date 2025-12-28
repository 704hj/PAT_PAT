type Props = {
  onClickEvent: () => void;
  title: string;
  icon?: string;
  style?: string;
  disable?: boolean;
};
export default function LoginButton({
  onClickEvent,
  title,
  icon,
  style,
  disable,
}: Props) {
  return (
    <button
      type="button"
      onClick={disable ? undefined : onClickEvent}
      disabled={disable}
      className={[
        "flex items-center gap-2 w-full text-[16px] justify-center py-4 rounded-2xl",
        disable ? "opacity-50 cursor-not-allowed" : "",
        style,
      ].join(" ")}
    >
      {icon && <img src={icon} alt="icon" className="" />} {title}
    </button>
  );
}
