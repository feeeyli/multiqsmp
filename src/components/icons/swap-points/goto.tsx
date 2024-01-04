import { IconProps } from '..';

const iconVariants = [
  ({ className, size }: IconProps) => (
    <svg
      className={className}
      width={size}
      height={size}
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key="swap-1"
    >
      <path
        d="M2 8V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H14"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M6 14L9 12V20"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  ({ className, size }: IconProps) => (
    <svg
      className={className}
      width={size}
      height={size}
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key="swap-2"
    >
      <path
        d="M2 8V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H14"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M9 20H5C5 16 9 17 9 14C9 12.5 7 11.5 5 13"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  ({ className, size }: IconProps) => (
    <svg
      className={className}
      width={size}
      height={size}
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key="swap-3"
    >
      <path
        d="M2 8V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H14"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5.5 12.5C7.2 11.5 9 12.5 9 14C9 14.5304 8.78929 15.0391 8.41421 15.4142C8.03914 15.7893 7.53043 16 7 16"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M5 19.5C7 21 9 19.8 9 18C9 17.4696 8.78929 16.9609 8.41421 16.5858C8.03914 16.2107 7.53043 16 7 16"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  ),
  ({ className, size }: IconProps) => (
    <svg
      className={className}
      width={size}
      height={size}
      stroke="currentColor"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      key="swap-4"
    >
      <path
        d="M2 8V6C2 5.46957 2.21071 4.96086 2.58579 4.58579C2.96086 4.21071 3.46957 4 4 4H20C20.5304 4 21.0391 4.21071 21.4142 4.58579C21.7893 4.96086 22 5.46957 22 6V18C22 18.5304 21.7893 19.0391 21.4142 19.4142C21.0391 19.7893 20.5304 20 20 20H14"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 12V16H9"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9 12V20"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
];

type GoToSwapPointProps = IconProps & { variant: number };

export const GoToSwapPoint = ({ variant, ...props }: GoToSwapPointProps) => {
  const Icon = iconVariants[variant];

  return <Icon {...props} />;
};
