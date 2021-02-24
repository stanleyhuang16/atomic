import React from 'react';
import Line from './Line';

function Lines() {
  return (
    <>
    {/* component to component */}
      <Line defaultStart={[-2, 0, -5]} defaultEnd={[0, 0, -8]} />
      <Line defaultStart={[0, 0, -8]} defaultEnd={[2, 0, -5]} />
      <Line defaultStart={[-2, 0, -5]} defaultEnd={[-4, 0, -2]} />
      <Line defaultStart={[-2, 0, -5]} defaultEnd={[0, 0, -2]} />
      <Line defaultStart={[4, 0, -2]} defaultEnd={[2, 0, -5]} />
      {/* component to atom */}
      <Line defaultStart={[0, 3, -5]} defaultEnd={[-2, 0, -5]} />
      <Line defaultStart={[0, 3, -5]} defaultEnd={[4, 0, -2]} />
    </>
  );
}

export default Lines;
