import React from 'react';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #F00;
`;

export default function Hello({ name }) {
  return (
    <div >
      <Title> Hello {name}</Title>
    </div>
  );
}
