import styled from 'styled-components';
import SearchIcon from 'material-ui-icons/Search';

import { colors, breakpoints, fonts } from '/client/imports/theme';

export const GeometrySearchContainer = styled.div`
  display: flex;
`;

export const GeometrySearchContent = styled.div`
  flex-grow: 1;
  text-align: center;
  @media (min-width: ${breakpoints.xl}) {
    margin: 0 30px;
  }
`;

export const SearchDrawerToggle = styled(SearchIcon)`
  padding: 15px;
  cursor: pointer;
  margin: 0 0 0 auto;
  -webkit-tap-highlight-color: transparent;
`;