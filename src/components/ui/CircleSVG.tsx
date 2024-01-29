import React from "react";

type CircleSVGProps = {
  width: string;
  height: string;
  viewBox: string;
  circleCx: string;
  circleCy: string;
  circleR: string;
  fill: string;
  filterId: string;
  stdDeviation: string;
  className?: HTMLElement["className"];
};

const CircleSVG: React.FC<CircleSVGProps> = ({
  width,
  height,
  viewBox,
  circleCx,
  circleCy,
  circleR,
  fill,
  filterId,
  stdDeviation,
  className,
}) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox={viewBox}
      fill="none"
      className={className} // Apply the className prop for custom styling
    >
      <g filter={`url(#${filterId})`}>
        <circle cx={circleCx} cy={circleCy} r={circleR} fill={fill} />
      </g>
      <defs>
        <filter
          id={filterId}
          x="-100"
          y="0"
          width="615"
          height="615"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation={stdDeviation}
            result={`effect1_foregroundBlur_${filterId}`}
          />
        </filter>
      </defs>
    </svg>
  );
};

export default CircleSVG;
