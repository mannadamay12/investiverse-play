import React from "react";

export interface ChartContainerProps {
  children: React.ReactNode;
  data: Array<{
    date: string;
    value: number;
  }>;
  config: {
    value: {
      label: string;
      theme: {
        light: string;
        dark: string;
      };
    };
  };
}

export const ChartContainer: React.FC<ChartContainerProps> = ({
  children,
  data,
  config
}) => {
  return (
    <div className="w-full h-full p-4 rounded-lg border bg-background">
      {children}
    </div>
  );
};