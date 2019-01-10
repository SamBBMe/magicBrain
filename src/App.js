import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Clarifai from 'clarifai';
import Navigation from './components/Navigation/Navigation';
//import SignIn from './components/SignIn/SignIn';
import FaceRecognition from './components/FaceRecognition/FaceRecognition'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import './App.css';


const app = new Clarifai.App({
  apiKey: 'af3693f50e63422b9fd45c9693719bca'
 });

const particlesOptions = {
  particles: {
    number: {
      value: 100,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      input: 'https://s17-us2.startpage.com/cgi-bin/serveimage?url=https:%2F%2Fsteamuserimages-a.akamaihd.net%2Fugc%2F478895272571535117%2F507261AA2503E9BEEB71D35BD43BA88320B1AD78%2F%3Finterpolation%3Dlanczos-none%26amp;output-format%3Djpeg%26amp;output-quality%3D95%26amp;fit%3Dinside%257C637%253A358%26amp;composite-to%3D*,*%257C637%253A358%26amp;background-color%3Dblack&sp=e2dc7e026b27f2d0d957fc6f0dd0d845',
      imageUrl: '',
      box: {}
    }
  }

  calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});
  }
  
  onButtonSubmit = () => {
    this.setState({imageUrl: this.state.input});
    app.models
      .predict(
        Clarifai.FACE_DETECT_MODEL,
        this.state.input)
      .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
      .catch(err => console.log(err));
  }

  render() {
    return (
      <div className="App" onLoad={this.onButtonSubmit}>
        <Particles 
          className='particles' 
          params={particlesOptions}/>
        <Navigation />
        <Logo />
        <Rank />
        <ImageLinkForm 
          onInputChange={this.onInputChange} 
          onButtonSubmit={this.onButtonSubmit}/>
        <FaceRecognition
          imageUrl = {this.state.imageUrl}
          box = {this.state.box}/>
      </div>
    );
  }
}




export default App;
