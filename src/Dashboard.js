/* eslint-disable jsx-a11y/alt-text */
import React, { Component,} from 'react';
import axios from 'axios';
import { Grid, Row, Col } from 'react-flexbox-grid';
import {gsap, Power4}  from 'gsap';
import _ from 'lodash';
import './Dashboard.scss';

export class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.timedSync = null;
    this.minuteCheck = null;
    this.getLineData = this.getLineData.bind(this);
    this.timeSyncData = this.timeSyncData.bind(this);
    this.syncData = this.syncData.bind(this);
    this.syncDataSleep = this.syncDataSleep.bind(this);
    this.wakeUp = this.wakeUp.bind(this);
    this.refreshBrowser = this.refreshBrowser.bind(this);
    this.refreshTime = this.refreshTime.bind(this);
    // Code redundancy - need to solve this.
    this.refreshDate = 'Senast synkad: '+ String(new Date().getDate()).padStart(2, '0') +'/' + String(new Date().getMonth() + 1).padStart(2, '0') + ' kl. ' + new Date().getHours() + ':' + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();
    this.refreshTl = gsap.timeline({paused:true});
    this.sleepIconTl = null;
  }

  state = {
    contents: [],
    isLoading: false,
    errors: null,
    sleepCheck: false
  }

  syncData(){
    this.refreshIcon = document.getElementById('ttable-refresh');
    this.refreshTl
      .to(this.refreshIcon, 1, {rotation:360, ease:Power4.easeInOut })
      .to(this.refreshIcon, 0.3, {scale:0.8}, "-=0.70")
      .to(this.refreshIcon, 0.2, {scale:1}, "-=0.3");
    this.refreshTl.restart();
    this.refreshTime();
    this.getLineData();
  }

  syncDataSleep(){
    this.refreshTime();
    this.getLineData();
  }

  refreshTime(){
    var refreshDate = 'Senast synkad: '+ String(new Date().getDate()).padStart(2, '0') +'/' + String(new Date().getMonth() + 1).padStart(2, '0') + ' kl. ' + (new Date().getHours()<10?'0':'') + new Date().getHours() + ':' + (new Date().getMinutes()<10?'0':'') + new Date().getMinutes();
    document.getElementById('ttable-refresh-info').innerHTML = refreshDate;

    this.idleCount = 0;
  }

  getLineData(){

    //console.log('fetching from API');

    this.refreshTime();

    let metApi = "https://api.sl.se/api2/realtimedeparturesV4.json?key="+ process.env.REACT_APP_API_KEY + "&siteid=9104&timewindow=60&bus=false&tram=false&EnablePrediction=false";
    let warnApi = "https://api.sl.se/api2/deviations.json?key="+ process.env.REACT_APP_API_KEY_2 +"&transportMode=metro&siteId=9104";

    const req1 = axios.get(metApi);
    const req2 = axios.get(warnApi);

    Promise.all([req1, req2])
    
    .then(
      axios.spread((resp1, resp2) => {
        //console.log(resp1, resp2);
        //console.log(resp2.data);
         return [...resp1.data.ResponseData.Metros, ...resp2.data.ResponseData ].map(
          content => ({
            direction: `${content.JourneyDirection}`,
            destination: `${content.Destination}` ,
            arrival: `${content.DisplayTime}`,
            header: `${content.Header}`,
            details: `${content.Details}`
          })
        );
      })
    )
    .then(contents => {
      this.setState({
        contents,
        isLoading: false
      });
    })
    .catch(errors => this.setState({ errors, isLoading: false }));
  }

  minuteCheck;

  componentDidMount() {
   this.getLineData();
   this.minuteCheck = setInterval(this.timeSyncData.bind(this), 60000);
   this.sleepIval = setInterval(this.sleepClock.bind(this), 60000);
  }

  idleCount = 0;
  runSleep = false;
  sleepReady = false;

  sleepClock(){
    this.idleCount++;

    const today = new Date();

    // Is it no auto sync-hour? If yes, then be ready to go to bed
    if(today.getDay() >= 1 && today.getDay() < 6){
      if (today.getHours() >= 7 && today.getHours() < 10){
        this.wakeUp();
       } else if(today.getHours() >= 10 && today.getHours() < 17){
        this.sleepReady = true;
      } else if(today.getHours() >= 17 && today.getHours() < 19){
        this.wakeUp();
      }
      else if (today.getHours() >= 19){
        this.sleepReady = true;
      }
    } else if (today.getDay() === 0) {
      this.sleepReady = true;
    } else  {
      this.sleepReady = true;
    }

    // Start the klock, After 30 minutes show sleep-modal with zzz-animation
    if (this.idleCount === 30 && this.runSleep === false && this.sleepReady ===true){
      this.setState({sleepCheck: true});

      this.sleepIconTl = gsap.timeline({paused:true,repeat:-1, repeatDelay:1});

      this.sleepIconTl
      .from('#zzz-1', 0.7, {opacity:0, scale:0.5, x:-10, y:10})
      .from('#zzz-2', 0.7, {opacity:0, scale:0.5, x:-10, y:10}, "+=0.2")
      .from('#zzz-3', 0.7, {opacity:0, scale:0.5, x:-10, y:10}, "+=0.2");
  
      this.sleepIconTl.restart();

      this.runSleep = true;

    }
  }

  timeSyncData(){

    const ttoday = new Date();

    /* So basically: Auto sync from 7:00 AM - 10:00 AM and then again 17:00 PM - 20:00 PN
    from Monday to Friday and then no auto sync on Weekends. I don't want use up all of my calls. :) */

    if(ttoday.getDay() >= 1 && ttoday.getDay() < 6){
      if (ttoday.getHours() >= 7 && ttoday.getHours() < 10){
        this.getLineData();
        this.refreshTime();
      } else if(ttoday.getHours() >= 10 && ttoday.getHours() < 17){
        // No sync
      } else if(ttoday.getHours() >= 17 && ttoday.getHours() < 19){
        this.getLineData();
        this.refreshTime();
      } else if (ttoday.getHours() >= 19){
        // No sync
      }

    } else if (ttoday.getDay() === 0) {
      // Sunday 
    } else  {
      // Saturday 
    }

  }

  wakeUp(){
    this.setState({sleepCheck: this.prevState})
    this.syncDataSleep();
    this.runSleep = false;
  }

  refreshBrowser(){
    // I know reload() is deprecated but I am using it now until I come up with a better solution.
    window.location.reload(false);
  }

  componentWillUnmount(){
    clearInterval(this.minuteCheck);
    clearInterval(this.sleepIval);
  }

  render() {
    const { contents, isLoading, sleepCheck} = this.state;
    
    // decalre the refreshdate shown in the dashboard every time the app updates
    const refreshDate = this.refreshDate;

    // declare warning check variable for any ongoing warnings from the API
    let warnCheck = false;
    contents.filter(direction => (warnCheck = direction.direction === 'undefined'));
    

    return(
        <div className="ttable-dashboard-wrapper">
        { /* Sleep Modal */
          sleepCheck ? (
            <div className="ttable-error-modal-wrapper" id="sleep-modal-wrapper" onClick={this.wakeUp}>
              <div className="ttable-error-modal-box sleep-mode-modal">
                <div className="ttable-error-inner">
                  <div className="zzz" id="zzz-3"></div>
                  <div className="zzz" id="zzz-2"></div>
                  <div className="zzz" id="zzz-1"></div>
                  <div className="ttable-error-icon sleep-mode-icon"></div>
                  <h2 className="ttable-error-heading">Sovläge</h2>
                  <p className="ttable-error-log">Tidtabellen har inte uppdaterats på ett tag, peta på skärmen för att uppdatera!</p>
                </div>
              </div>
              <div className="ttable-error-black-overlay"></div>
            </div>
          ) : null }
          { /* Error Modal */
          _.isEmpty(contents) ? (
            <div className="ttable-error-modal-wrapper" onClick={this.refreshBrowser}>
              <div className="ttable-error-modal-box">
                <div className="ttable-error-inner">
                  <div className="ttable-error-icon"></div>
                  <h2 className="ttable-error-heading">Choo-Choo! Något gick fel i hämtningen av data!</h2>
                  <p className="ttable-error-log">SL API Error</p>
                </div>
              </div>
              <div className="ttable-error-black-overlay"></div>
            </div>
          ) : null }
              <div id="ttable-refresh" className="ttable-refresh-icon" onClick={this.syncData}></div>
            {!isLoading ? (
            <Grid className="ttable-dashboard-grid" fluid >
            {
            contents.slice(0,2).map(content => {
              const {destination, arrival, direction, index} = content;

              if (direction > 1)
              return (
                    <Row className="ttable-dashboard-row ttable-incoming" key={index}>
                      <Col className="ttable-dashboard-col" xs={8} md={8} lg={8}>
                        <div className="ttable-destination-icon dest-left"></div><h3 className="ttable-direction">Tåg mot T-centralen</h3>
                          <h1 className="ttable-destination" >{destination}</h1>
                      </Col>
                      <Col className="ttable-dashboard-col ttable-right-info" xs={4} md={4} lg={4}>
                        {/*<div id="ttable-warn-first" className="ttable-dashboard-no-warn"> </div>
                        *warnCheck && 
                        <div id="ttable-warn-first" className="ttable-dashboard-warn"> </div>
              */}
                      <h1 className="ttable-incoming-time">{arrival}</h1>
                      </Col>
                  </Row>
                    )
                  })
                }
                            {
              contents.slice(0,2).map(content => {
                const {destination, arrival, direction, index} = content;

                if (direction < 2)
                return (
                <Row className="ttable-dashboard-row ttable-incoming" key={index}>
                  <Col className="ttable-dashboard-col" xs={8} md={8} lg={8}>
                  <h3 className="ttable-direction">Tåg från T-centralen</h3><div className="ttable-destination-icon dest-right"></div>
                    <h1 className="ttable-destination">{destination}</h1>
                  </Col>
                  <Col className="ttable-dashboard-col ttable-right-info" xs={4} md={4} lg={4}>
                  {/*}
                    <div id="ttable-warn-first" className="ttable-dashboard-no-warn"> </div>
                  {warnCheck && 
                    <div id="ttable-warn-first" className="ttable-dashboard-warn"> </div>
                  */}
                    <h1 className="ttable-incoming-time">{arrival}</h1>
                  </Col>
                </Row>
                  )
                })
              }
              <Row className="ttable-dashboard-row ttable-upcoming">
                <Col className="ttable-dashboard-col ttable-upcoming-line line-1" xs={4} md={4} lg={4}>
                  <div className="ttable-dashboard-upcoming-heading-row">
                    <div className="ttable-destination-icon dest-left"></div><h4 className="ttable-direction">Tåg mot T-centralen</h4>
                  </div>
                  <div className="ttable-dashboard-upcoming-body">
                  {
                    contents.map(content => {
                      const {destination, arrival, direction, index} = content;

                      if (direction > 1)
                      return (
                        <div className="ttable-dashboard-upcoming-row" key={index}>
                          <div className="ttable-dashboard-upcoming-col"> <h2>{destination}</h2></div>
                          <div className="ttable-dashboard-upcoming-col"><h2>{arrival}</h2></div>
                        </div>
                      )
                    })
                  }
                  </div>
                </Col>
                <Col className="ttable-dashboard-col ttable-upcoming-line line-2" xs={4} md={4} lg={4}>
                  <div className="ttable-dashboard-upcoming-heading-row">
                      <h4 className="ttable-direction">Tåg från T-centralen</h4><div className="ttable-destination-icon dest-right"></div>
                  </div>
                  <div className="ttable-dashboard-upcoming-body">
                  { contents.map(content => {
                      const {destination, arrival, direction, index} = content;
                      if (direction < 2)
                      return (
                          <div className="ttable-dashboard-upcoming-row" key={index} >
                            <div className="ttable-dashboard-upcoming-col"> <h2>{destination}</h2></div>
                            <div className="ttable-dashboard-upcoming-col"><h2>{arrival}</h2></div>
                          </div>
                      )
                    })
                  }
                  </div>                 
                </Col>
                <Col className="ttable-dashboard-col ttable-warnings" xs md lg>
                <div className="ttable-dashboard-warning-heading-row">
                    <h4 className="ttable-warning-heading">Aktuella störningar</h4>
                </div>
                <div id="ttable-warning-display-wrapper">
                <div className="ttable-warning-display" id="no-warn">
                  <div className="ttable-warn-displ-text">
                    <p className="ttable-warn-displ-h">Inga störningar just nu.</p>
                    <p className="ttable-warn-displ-sh">Allt går som på räls...</p>
                   </div>
                </div>
                {warnCheck && 
                <div className="ttable-warning-display" id="ongoing-warn">
                  <div className="ttable-warn-displ-text">
                  { contents.slice(-1).map(content => {
                      const {details,index} = content;
                      return (
                    <div className="ttable-warn-text-module" key={index}>
                      <div className="ttable-warn-ongoing-icon"></div>
                      <p className="ttable-warn-ongoing-text">{details}</p>
                    </div>
                      )
                    })
                  }
                  </div>
                </div>
                }
                </div>
                <div id="ttable-refresh-info" className="ttable-refresh-info" >{refreshDate}</div>
                </Col>
              </Row>
            </Grid>
            ) : (
              <div className="ttable-loading-wrapper"><p className="ttable-loading-p">Hämtar data...</p></div>
            )}
        </div>
    )
  }
}

export default Dashboard;