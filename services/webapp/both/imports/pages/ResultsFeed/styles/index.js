import styled from 'styled-components';
// import { Link } from 'react-router-dom';
// import CircularProgress from '@material-ui/core/CircularProgress';
// import _EmpiricalFormula from '/both/imports/components/EmpiricalFormula';

import { breakpoints } from '/both/imports/theme';

export const ResultsFeedContainer = styled.div`
  display: flex;
`;

export const ResultsFeedContent = styled.div`
  flex-grow: 1;
  text-align: center;
  @media (min-width: ${breakpoints.xl}) {
    margin: 0 30px;
  }
`;
