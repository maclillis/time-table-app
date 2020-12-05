<br />
<p align="center">
  <a href="https://github.com/othneildrew/Best-README-Template">
    <img src="https://user-images.githubusercontent.com/13959025/101261155-67406580-3735-11eb-8068-74ebe12c5353.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Råcksta T-Table-App</h3>

  <p align="center">
    An SPA Real time Dashboard of Råcksta subway station with<br/> arrivals and departures using Trafik Labs open API
    <br />
  </p>
</p>

<!-- ABOUT THE PROJECT -->
## About The Project

<img width="803" alt="Råcksta T-Table App" src="https://user-images.githubusercontent.com/13959025/101261786-08311f80-373a-11eb-9520-bf92ff77d6e4.png">


### The Back story
So everythings stared with me continuing running late to the subway every morning. On top of that, the official SL App has a UX/UI-design from hell so to actually get the current time table for Råcksta Subway station takes about as long as it takes walk to the plattform... I just don't have that kind of time. Knowing that there is an open API from Trafik Lab with all of the Subway arrivals/departues that exist I though it would be good time to actually make an app of my own, with a design that need. 

It took me about 3 weeks from the starting on the mockup to actually get a stable version out, much thanks to alot of studying and problem solving and here we are. 

### Built With

The backbone of the app is developed in ReactJS and the wonderful "Create-A-An-App"-package with some fetching help from AXIOS, I have also used GSAP for the minor animations and icons from Font Awesome. In order to make life a bit easier while working with JavaScript objects, I have also worked a bit with ._lodash. SASS for preprocessing CSS and Flexbox with Flexbox Grid for layout stability.

* [React](https://reactjs.org/)
* [GreensockJS](https://greensock.com)
* [Axios](https://www.npmjs.com/package/axios)
* [._lodash](https://lodash.com)
* [Flexbox Grid](https://flexboxgrid.com)

<!-- LICENSE -->
## Usage

You are free to fork, share and devour this project as much as you want. I believe in sharing for the masses but in order for this project to work you have to create your own API key at Trafik Lab, create an .env file and insert the key there. Links below.

* [Trafik Lab open API](https://www.trafiklab.se/)
* [Work with API Keys in React](https://dev.to/thepuskar/how-to-hide-your-api-keys-in-react-4k55)

## FAQ

**Q:** Will this be publicy released on App Store or Google Play?

**A:** No. This was purely for fun and a test challenge myself. Also, I was bored okay?

**Q:** Any plans to add an options menu where you can add the station closest to you?

**A:** Maybe, maybe not. The challenge is intriguing but the time? Not so much.