/**
 * Gets the repositories of the user from Github
 */

import { call, put, select, takeLatest } from 'redux-saga/effects';
import { SEARCH_TOPIC, SEARCH_TWITTER, CHANGE_TOPIC, GET_GLOBE_TAGS } from './constants';
import { reposLoaded, repoLoadingError, putFuzzyResults, putGlobeTags } from './actions';

import request from 'utils/request';
import { makeSelectTopic } from './selectors';

/**
 * Google EmotionAPI request/response handler
 */
export function* getRepos() {
  // Select topic
  const username = yield select(makeSelectTopic());
  const requestURL = `https://kgsearch.googleapis.com/v1/entities:search?query=${username}&key=AIzaSyBmPgLJOQ3MmR0HWS8XbbNndlU_PooeAF8&limit=1&indent=True`;
  try {
    // Call our request helper (see 'utils/request')
    const repos = yield call(request, requestURL);
    // console.log(repos.itemListElement[0].result);
    yield put(reposLoaded(repos.itemListElement[0].result));
  } catch (err) {
    yield put(repoLoadingError(err));
  }
}

export function* getFuzzySearchResults(action) {
  const topic = action.name;
  // console.log(topic);
  const requestURL = `http://34.73.60.209:9200/trending_suggestion/_search?pretty`;
  let requestBody = {
    "suggest": {
      "hashtag": {
        "regex": `.*${topic.replace(' ', '.*')}.*`,
        "completion": {
          "field": "suggest",
          "size": 10,
          "skip_duplicates": true
        }
      }
    }
  };
  let requestHeader = {
    'Content-Type': 'application/json',
  }
  try {
    // Call our request helper (see 'utils/request')
    const response = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: requestHeader
    });
    // console.log(response.suggest.hashtag[0].options);
    if (response.suggest.hashtag[0].options.length > 0) {
      let fuzzyResults = response.suggest.hashtag[0].options;
      fuzzyResults = fuzzyResults.map((item) => item.text);
      // console.log(fuzzyResults);
      yield put(putFuzzyResults(fuzzyResults));
    }
  } catch (err) {
    console.error(err);
    //yield put(repoLoadingError(err));
  }
}

export function* getGlobeTags(action) {
  // const topic = action.name;
  // console.log(topic);
  const requestURL = `http://34.73.60.209:9200/trending_locations/_search?pretty=true`;
  let requestBody ={
    "size": 0,
      "aggs": {
          "top_tags": {
              "terms": {
                  "field": "country._content.keyword",
                  "size": 10
              },
              "aggs": {
                  "by_top_hits": {
                      "top_hits": {
                          "sort": [
                              {
                                  "timestamp": {
                                      "order": "desc"
                                  }
                              }
                          ],
                          "_source": {
                              "includes": [ "trends", "woeid","country" ]
                          },
                          "size" : 1
                      }
                  }
              }
          }
      }
  };
  let requestHeader = {
    'Content-Type': 'application/json',
  }
  try {
    // Call our request helper (see 'utils/request')
    const tags = yield call(request, requestURL, {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: requestHeader
    });
    console.log(tags);
    yield put(putGlobeTags(tags['aggregations'] ? tags['aggregations']['top_tags']['buckets']: []));

  } catch (err) {
    console.error(err);
    //yield put(repoLoadingError(err));
  }
}

/**
 * Root saga manages watcher lifecycle
 */
export default function* homePageSaga() {
  // Watches for LOAD_REPOS actions and calls getRepos when one comes in.
  // By using `takeLatest` only the result of the latest API call is applied.
  // It returns task descriptor (just like fork) so we can continue execution
  // It will be cancelled automatically on component unmount
  yield takeLatest(SEARCH_TOPIC, getRepos);
  yield takeLatest(CHANGE_TOPIC, getFuzzySearchResults);
  yield takeLatest(GET_GLOBE_TAGS, getGlobeTags);
}
