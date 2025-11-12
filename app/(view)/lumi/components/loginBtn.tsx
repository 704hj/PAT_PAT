type Props = {
  onClickEvent: () => void;
  title: string;
  icon?: string;
  style?: string;
};
export default function LoginButton({
  onClickEvent,
  title,
  icon,
  style,
}: Props) {
  return (
    <button
      onClick={onClickEvent}
      className={[
        "flex items-center gap-2 w-full text-[16px] justify-center py-4 rounded-2xl",
        style,
      ].join(" ")}
    >
      {icon && <img src={icon} alt="icon" className="" />} {title}
    </button>
  );
}
