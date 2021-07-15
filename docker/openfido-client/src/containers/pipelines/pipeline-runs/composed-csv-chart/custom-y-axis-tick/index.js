import React from 'react';
import moment from 'moment';

import { Text } from 'recharts';

const CustomYAxisTick = (props) => {
  const {
    fill, x, y, payload, style, fontSize, isTimestamp,
  } = props;

  let tickValue = payload.value;

  if (isTimestamp) {
    tickValue = moment.unix(tickValue);
  }

  return [
    isTimestamp && (
      <Text key="date" textAnchor="middle" width={32} fill={fill} x={x - 32} y={y - 8} style={style} fontSize={fontSize}>{tickValue.format('MMM D')}</Text>
    ),
    isTimestamp && (
      <Text key="time" textAnchor="middle" width={32} fill={fill} x={x - 32} y={y + 8} style={style} fontSize={fontSize}>{tickValue.format('h A')}</Text>
    ),
    !isTimestamp && (
      <Text key="value" textAnchor="middle" fill={fill} x={x - 32} y={y + 3} style={style} fontSize={fontSize}>{tickValue}</Text>
    ),
  ];
};

export default CustomYAxisTick;
