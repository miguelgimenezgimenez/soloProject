import React, {Component} from 'react';
import {connect} from 'react-redux';
import inside from 'point-in-polygon';
import GoogleMapDrawFilter from 'react-google-map-draw-filter';
import {fetchActivities} from '../redux/actions';
import '../Styles/MainStyle.css';

const path=[];
const polygon=[];
const google=window.google;
let poly;
let tempArea;

class AllActivities extends Component {
  constructor () {
    super();
    this.state = {
      draw:false,
      activeMarkers:[],
    };
  }
  toggleDraw () {
    this.setState(
      {draw:!this.state.draw}
    )
  }

  componentDidMount() {
    let path;
    if (this.props.params.type==='meetup') {
      path = 'https://api.foursquare.com/v2/venues/search?ll=41.3918, 2.1454&client_id=AHTZ33XG1YZJD5UVCRNTVVIZRXIL4RGJUXJCQELSCFP3GRER&client_secret=NDEUMPC0BOUGR3A0SIHOYHQKQSABPSAAH1SWFOCUWX4EIYYX&v=20160117&m=foursquare'
    } else {
      path= `/fetchActivities/${this.props.params.type}`
    }
    this.props.fetchActivities(path);
  }
  componentDidUpdate(prevProps, prevState){
    let path;
    if (this.props.params.type==='meetup') {
      path = 'https://api.foursquare.com/v2/venues/search?ll=41.3918, 2.1454&client_id=AHTZ33XG1YZJD5UVCRNTVVIZRXIL4RGJUXJCQELSCFP3GRER&client_secret=NDEUMPC0BOUGR3A0SIHOYHQKQSABPSAAH1SWFOCUWX4EIYYX&v=20160117&m=foursquare'
    } else {
      path= `/fetchActivities/${this.props.params.type}`
    }
    if (this.props.params.type!==prevProps.params.type) {
      this.props.fetchActivities(path);
    }
  }

  handleReturnedMarkers(markers) {
    this.setState({
      activeMarkers: markers
    });
  }
  onMarkerClick(marker){
    this.setState({
      activeMarkers: [marker]
    });
  }
  renderMarkerInfo() {
    if (this.state.activeMarkers) {
      return this.state.activeMarkers.map((marker,i)=>(
        <div key={`marker${i}`}>
          <h2>
            {marker.info}
          </h2>
        </div>)
      )
    }
  }


  render() {

    return (
      <div className='activities-body'>
        <button style={{marginTop:30}}onClick={this.toggleDraw.bind(this)}>Draw Area</button>

        <div className='mapcontainer'>
          <GoogleMapDrawFilter
            mapStyle={{height:400,width:800}}
            onMarkerClick={this.onMarkerClick.bind(this)}
            markers={this.props.activities}
            drawMode={this.state.draw}
            handleReturnedMarkers={this.handleReturnedMarkers.bind(this)}
            apiKey='AIzaSyADYWSlC4yEedJ-5lvQb9UFOVaMMux54Zc'

            >
            </GoogleMapDrawFilter>
          </div>
          <div className='marker-info'>
            {this.renderMarkerInfo.bind(this)()}
          </div>
        </div>

      );
    }
  }
  const mapStateToProps = (state) => {
    if (Array.isArray(state.activities)) {
      return {
        activities: state.activities,
      }
    }
    const MappedActivities = state.activities.response.venues.map(event=>{
      return {
        info:event.name,
        latLng:{lat:event.location.lat ,lng:event.location.lng}}
      })
      return {
        activities: MappedActivities,
      }
    };
    const mapDispatchToProps = (dispatch) => ({
      fetchActivities: (path) => dispatch(fetchActivities(path)),
    });

    export default connect(mapStateToProps, mapDispatchToProps)(AllActivities);
