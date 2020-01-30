/**
 * Homepage selectors
 */

import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectHome = state => state.get('home', initialState);

const makeSelectTopic = () =>
  createSelector(selectHome, homeState => homeState.get('topic'));

const makeSelectLoading = () =>
  createSelector(selectHome, homeState => homeState.get('loading'));

const makeSelectError = () =>
  createSelector(selectHome, homeState => homeState.get('error'));

const makeSelectTopicInfo = () =>
  createSelector(selectHome, homeState => homeState.get('topicInfo'));

const makeSelectglobeTags = () =>
  createSelector(selectHome, homeState => homeState.get('globeTags'));
  
const makeSelectFuzzyResults = () =>
  createSelector(selectHome, homeState => homeState.get('fuzzySearchResults'));
export {
  selectHome, makeSelectTopic, makeSelectLoading,
  makeSelectError,
  makeSelectTopicInfo,
  makeSelectFuzzyResults,
  makeSelectglobeTags,
};
