// JellyTriangleSpinner.tsx
import React, { useEffect, useState } from 'react';
import View from './view';

interface JellyTriangleSpinnerProps {
  color?: string;
  gradient?: string;
  speed?: string;
  size?: number;
}

const JellyTriangleSpinner: React.FC<JellyTriangleSpinnerProps> = ({
  color = 'black',
  gradient = '',
  speed = '1.75s',
  size = 48
}) => {
  const [filterId, setFilterId] = useState('');

  useEffect(() => {
    setFilterId(`jelly-triangle-${Math.random().toString(36).substring(2, 9)}`);
  }, []);

  const dotStyle = {
    width: `${size / 3}px`,
    height: `${size / 3}px`,
    background: gradient || color,
    borderRadius: '9999px',
    transition: 'background-color 0.3s ease'
  } as React.CSSProperties;

  return (
    <View className="relative" style={{ height: size, width: size }}>
      <View
        className="relative"
        style={{
          height: size,
          width: size,
          filter: filterId ? `url('#${filterId}')` : undefined,
          ['--uib-color' as any]: color,
          ['--uib-speed' as any]: speed
        }}
      >
        <View
          className="absolute"
          style={{
            ...dotStyle,
            top: '0%',
            left: '33%',
            animation: `grow ${speed} ease infinite`,
            willChange: 'transform'
          }}
        />

        <View
          className="absolute"
          style={{
            ...dotStyle,
            top: '0%',
            left: '33%',
            animation: `triangulate ${speed} ease infinite`
          }}
        />
      </View>

      <svg className="w-0 h-0 absolute">
        <defs>
          <filter id={filterId}>
            <feGaussianBlur in="SourceGraphic" stdDeviation="3.333" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
              result="ooze"
            />
            <feBlend in="SourceGraphic" in2="ooze" />
          </filter>
        </defs>
      </svg>

      <style>{`
        @keyframes triangulate {
          0%, 100% {
            transform: none;
          }
          33.333% {
            transform: translate(100%, 173%);
          }
          66.666% {
            transform: translate(-100%, 173%);
          }
        }

        @keyframes grow {
          0%, 85%, 100% {
            transform: scale(1.5);
          }
          50%, 60% {
            transform: scale(0);
          }
        }
      `}</style>

      <style>{`
        .relative > div:first-child::before,
        .relative > div:first-child::after {
          content: '';
          position: absolute;
          width: ${size / 3}px;
          height: ${size / 3}px;
          background: ${gradient || color};
          border-radius: 9999px;
          will-change: transform;
          transition: background-color 0.3s ease;
        }

        .relative > div:first-child::before {
          bottom: 0%;
          right: 0;
          animation: grow ${speed} ease calc(${speed} * -0.666) infinite;
        }

        .relative > div:first-child::after {
          bottom: 0%;
          left: 0;
          animation: grow ${speed} ease calc(${speed} * -0.333) infinite;
        }
      `}</style>
    </View>
  );
};

export default JellyTriangleSpinner;
