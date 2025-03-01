import classNames from "classnames";
import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { Icon, Icons } from "@/components/Icon";
import { Spinner } from "@/components/layout/Spinner";

interface Props {
  icon?: Icons;
  onClick?: (
    event: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement, MouseEvent>,
  ) => void;
  children?: ReactNode;
  theme?: "white" | "purple" | "secondary" | "danger";
  padding?: string;
  className?: string;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  download?: string;
}

export function Button(props: Props) {
  const { onClick, href, loading } = props;

  let colorClasses = "bg-white hover:bg-gray-200 text-black";
  if (props.theme === "purple")
    colorClasses = "bg-buttons-purple hover:bg-buttons-purpleHover text-white";
  if (props.theme === "secondary")
    colorClasses =
      "bg-buttons-cancel hover:bg-buttons-cancelHover transition-colors duration-100 text-white";
  if (props.theme === "danger")
    colorClasses = "bg-buttons-danger hover:bg-buttons-dangerHover text-white";

  let classes = classNames(
    "tabbable cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-[transform,background-color] duration-100 active:scale-105 md:px-8",
    props.padding ?? "px-4 py-3",
    props.className,
    colorClasses,
    props.disabled ? "!cursor-not-allowed bg-opacity-60 text-opacity-60" : null,
  );

  if (props.disabled)
    classes = classes
      .split(" ")
      .filter(
        (className) =>
          !className.startsWith("hover:") && !className.startsWith("active:"),
      )
      .join(" ");

  const content = (
    <>
      {props.icon && !props.loading ? (
        <span className="mr-3 hidden md:inline-block">
          <Icon icon={props.icon} />
        </span>
      ) : null}
      {props.loading ? (
        <span className="mr-3 inline-flex justify-center">
          <Spinner className="text-lg" />
        </span>
      ) : null}
      {props.children}
    </>
  );

  if (href?.startsWith("http")) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={classes}
        onClick={onClick}
        download={props.download}
      >
        {content}
      </a>
    );
  }

  if (href) {
    return (
      <Link to={href} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={classes}
      disabled={props.disabled}
    >
      {content}
    </button>
  );
}

// Sometimes you can't use normal button, due to not having access to a useHistory context
// When that happens, use this!
interface ButtonPlainProps {
  onClick?: () => void;
  children?: ReactNode;
  theme?: "white" | "purple" | "secondary";
  className?: string;
}

export function ButtonPlain(props: ButtonPlainProps) {
  let colorClasses = "bg-white hover:bg-gray-200 text-black";
  if (props.theme === "purple")
    colorClasses = "bg-buttons-purple hover:bg-buttons-purpleHover text-white";
  if (props.theme === "secondary")
    colorClasses =
      "bg-buttons-cancel hover:bg-buttons-cancelHover transition-colors duration-100 text-white";

  const classes = classNames(
    "cursor-pointer inline-flex items-center justify-center rounded-lg font-medium transition-[transform,background-color] duration-100 active:scale-105 md:px-8",
    "px-4 py-3",
    props.className,
    colorClasses,
  );

  return (
    <button type="button" onClick={props.onClick} className={classes}>
      {props.children}
    </button>
  );
}
