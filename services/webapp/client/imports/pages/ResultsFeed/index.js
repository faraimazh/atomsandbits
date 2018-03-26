import React from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import {
  compose,
  branch,
  lifecycle,
  mapProps,
  pure,
  renderComponent,
  withState,
} from 'recompose';

import Fade from 'material-ui/transitions/Fade';
import { LinearProgress } from 'material-ui/Progress';

import { logger } from '/both/imports/logger';
// import Header from '/client/imports/components/Header';
import AppLayout from '/client/imports/components/AppLayout';
import Header from './Header';
import Result from './Result';
import { withData } from './withData';
import { ResultsFeedContainer, ResultsFeedContent } from './styles';

const Loading = props => (
  <AppLayout
    mobileOnlyToolbar
    title="Results Feed"
    appContent={
      <ResultsFeedContainer>
        <LinearProgress />
      </ResultsFeedContainer>
    }
  />
);

const displayLoadingState = branch(
  props => props.loading,
  renderComponent(Loading)
);

const redirectWithNoResults = branch(
  props => props.results.length === 0,
  renderComponent(() => <Redirect to="/new-calculation" />)
);

const ResultsFeedPure = ({ results, ...otherProps }) => (
  <AppLayout
    mobileOnlyToolbar
    title="Results Feed"
    appContent={
      <ResultsFeedContainer>
        <ResultsFeedContent>
          {logger.info('Results', results)}
          {results.map((result, index) => (
            <Result
              result={result}
              index={index}
              key={
                result.calculation ? result.calculation.id : result.project.id
              }
            />
          ))}
        </ResultsFeedContent>
      </ResultsFeedContainer>
    }
  />
);

const SORT_BY = 'createdAt';
const SORT_DIRECTION = -1;
const DEFAULT_TAG = '';
const SEARCH = '';
const LIMIT = 30;

const mapDataProps = mapProps(({ data, ...otherProps }) => {
  return {
    results: data.results,
    loading: data.loading,
    ...otherProps,
  };
});

const ResultsFeed = compose(
  withState('sortBy', 'setSortBy', SORT_BY),
  withState('sortDirection', 'setSortDirection', SORT_DIRECTION),
  withState('tag', 'setTag', DEFAULT_TAG),
  withState('search', 'setSearch', SEARCH),
  withState('limit', 'setLimit', LIMIT),
  withData,
  mapDataProps,
  displayLoadingState,
  withRouter,
  redirectWithNoResults,
  pure
)(ResultsFeedPure);

export { ResultsFeed };
export default ResultsFeed;
