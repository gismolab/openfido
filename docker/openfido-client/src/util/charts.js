import moment from 'moment';
import { parse } from '@fast-csv/parse';

import {
  DATA_TYPES,
  DATA_SCALES,
  TOTAL_GRAPH_POINTS,
} from 'config/charts';

export const getGraphInterval = (totalPoints) => {
  const numberOfPoints = parseInt(totalPoints, 10);

  return numberOfPoints > 8 ? Math.ceil(numberOfPoints / 8.0) : 'preserveStartEnd'; // good for 1-8 ticks - 836px cartesian grid
};

const DATE_FORMATS = [
  'YYYY-MM-DDTHH:mm:ssZ',
];

export const toUnixTime = (str) => moment(str, DATE_FORMATS).unix();
export const validDateString = (str) => moment(str, DATE_FORMATS).isValid();

export const getLimitedDataPointsForGraph = ({
  data,
  minIndex,
  maxIndex,
  totalGraphPoints = TOTAL_GRAPH_POINTS,
}) => {
  if (!data || !data.length) {
    return [];
  }

  let timeSubsetData = [...data];

  if (minIndex !== undefined && maxIndex !== undefined) {
    timeSubsetData = timeSubsetData.slice(minIndex, maxIndex);

    if (timeSubsetData.length <= totalGraphPoints) {
      return timeSubsetData;
    }
  }

  // get first item, because in the for loop, we dont start getting the data until index === 1
  const limitedDataSet = [timeSubsetData[0]];

  timeSubsetData.forEach((point, index) => {
    const nth = Math.ceil((index * totalGraphPoints) / timeSubsetData.length);

    if (limitedDataSet.length + 1 <= nth) {
      limitedDataSet.push(timeSubsetData[index]);
    }
  });

  // get last item, similar to first item above
  limitedDataSet.push(timeSubsetData[timeSubsetData.length - 1]);

  return limitedDataSet;
};

export const axesFormatter = (value, isTimestamp) => {
  const valueString = value.toString();

  if (isTimestamp && valueString.length === 10) {
    const dataValue = moment.unix(value);
    if (dataValue.isValid()) {
      return moment.unix(value).format('M/D/YYYY h:mm:ss A');
    }
  }

  if (valueString.match(/^-?[0-9]+([,.][0-9]+)?$/)) {
    return parseFloat(value).toFixed(4);
  }

  return value;
};

export const parseCsvData = (data) => {
  const chartData = [];
  const chartTypes = {};
  const chartScales = {};

  return new Promise((resolve, reject) => {
    const csvDataStream = parse({ headers: true })
      .on('error', reject)
      .on('data', (row) => {
        const rowData = { ...row };

        Object.keys(rowData).forEach((column) => {
          if (rowData[column].match(/^[+-]?\d+([,.]\d+)?(e[+-]\d+)?$/)) {
            rowData[column] = parseFloat(rowData[column]);
            if (!(column in chartTypes)) chartTypes[column] = DATA_TYPES.NUMBER; // interpolate type and scale from first row
            if (!(column in chartScales)) chartScales[column] = DATA_SCALES.LINEAR;
          } else if (validDateString(rowData[column])) { // datetime type
            rowData[column] = toUnixTime(rowData[column]);
            if (!(column in chartTypes)) chartTypes[column] = DATA_TYPES.TIME;
            if (!(column in chartScales)) chartScales[column] = DATA_SCALES.TIME;
          } else {
            if (!(column in chartTypes)) chartTypes[column] = DATA_TYPES.CATEGORY;
            if (!(column in chartScales)) chartScales[column] = DATA_SCALES.LINEAR;
          }
        });

        chartData.push(rowData);
      })
      .on('end', () => {
        resolve({
          chartData,
          chartTypes,
          chartScales,
        });
      });

    csvDataStream.write(data);
    csvDataStream.end();
  });
};
