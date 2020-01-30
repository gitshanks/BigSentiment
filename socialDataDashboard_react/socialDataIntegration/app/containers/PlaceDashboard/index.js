/**
 *
 * PlaceDashboard
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import SentimentChart from '../../components/SentimentChart';
import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import makeSelectPlaceDashboard from './selectors';
import makeSelectTopicAggregate from './selectors';
import reducer from './reducer';
import saga from './saga';
import PersonCard from '../../components/PersonCard';
import PhotoGrid from '../../components/PhotoGrid';
import TweetList from '../../components/TweetList';
import Trends from '../../components/Trends';
import PlaceCard from '../../components/PlaceCard';
import GooglePhotos from '../../components/GooglePhotos';
import TweetListWithSentiment from '../../components/TweetListWithSentiment';

/* eslint-disable react/prefer-stateless-function */
export class PlaceDashboard extends React.PureComponent {
  render() {
    console.log("TOPIC AGG:")
    console.log(this.props.topicAggregate)
    return (
      <article>

        <div className="container-fluid" style={{ marginTop: '2em' }}>

          <div className="row">

            <div className="col">
              <br></br><br></br>
              <PlaceCard topicInfo={this.props.topicInfo} twitterInfo={this.props.twitterInfo} imageSearch={this.props.imageSearch} />
              <br></br><br></br>
            </div>
            
            <div className="col">
              <GooglePhotos imageSearch={this.props.imageSearch} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <TweetListWithSentiment topicTweet={this.props.topicTweet} />
            </div>
            <div className="col">
              {/* <SentimentChart sentimentInfo={this.props.sentimentInfo} />  */}
              {/* TO DO: Needs data  */}
              <SentimentChart sentimentInfo={this.props.sentimentInfo} />
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Trends topicAggregate={this.props.topicAggregate} />
              {/* <GoogleMaps /> */}
            </div>

          </div>

          <div className="row" >
            <div className="col-12" >


            </div>
          </div>


          <div className="row">
            <br /> <br /><br /><br />
          </div>
        </div >
      </article>
    );
  }
}

PlaceDashboard.propTypes = {
  dispatch: PropTypes.func.isRequired,
  topicInfo: PropTypes.object,
  topicTweet: PropTypes.array,
  topicImage: PropTypes.array,
  twitterInfo: PropTypes.object,
  topicAggregate: PropTypes.array,
  sentimentInfo: PropTypes.array,
  fetchTopicInfo: PropTypes.func.isRequired,
  imageSearch: PropTypes.array,
  googleSearch: PropTypes.array,

};

const mapStateToProps = createStructuredSelector({
  placeDashboard: makeSelectPlaceDashboard(),
  // topicAggregate: makeSelectTopicAggregate(),
});

function mapDispatchToProps(dispatch) {
  return {
    fetchTopicInfo: name => dispatch(getTopicInfo(name)),
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'placeDashboard', reducer });
const withSaga = injectSaga({ key: 'placeDashboard', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(PlaceDashboard);
