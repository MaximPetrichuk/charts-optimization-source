import React from 'react';

const ParamElement = ({ title, value }) => (
  <div>
    <div>
{title}:</div>
    <div>{value}</div>
  </div>
);

const ParamsLegend = ({ params }) => (
  <div>
    <p>
      <strong>Parameters: </strong>
    </p>
    {params.map(({ key, title, value }) => (
      <ParamElement key={`extraParam_${key}`} title={title} value={value} />
    ))}
  </div>
);

export default ParamsLegend;
