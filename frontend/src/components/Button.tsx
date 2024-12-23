import { cva, VariantProps } from "class-variance-authority";
import { cn } from "../utils/cn";

const buttonStyles = cva(
  "inline-flex items-center justify-center rounded-md bg-primary text-white text-sm font-medium px-4 py-2 transition-colors hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary",
  {
    variants: {
      size: {
        default: "h-10",
        small: "h-8 text-sm",
        large: "h-12 text-lg",
      },
    },
    defaultVariants: {
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonStyles> {}

export const Button: React.FC<ButtonProps> = ({ className, size, ...props }) => {
  return (
    <button className={cn(buttonStyles({ size, className }))} {...props}>
      {props.children}
    </button>
  );
};
