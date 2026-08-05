interface StatusCSSProps {
  Active: string;
  Critical: string;
  Recovered: string;
}

export const statusCss: StatusCSSProps = {
  Active: "bg-accent-50 text-accent",
  Critical: "bg-danger/10 text-danger",
  Recovered: "bg-primary-50 text-primary",
};
