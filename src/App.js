import React , {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo.js';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm.js';
import Rank from './components/Rank/Rank.js';
import Particle from './components/TsParticles/TsParticles';
import FaceRecognition from './components/FaceRecognition/FaceRecognition.js';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import ImageItem from './components/ImageItem/ImageItem';


const initialState = {
      newName:"",
      input:'',
      imageUrl:'',
      box:{},
      route:'signin',
      isSignedIn: false,
      itemName:'',
      user: {
        id : '',
        name: "",
        email : '',
        password : "",
        entries : 0 ,
        joined : ''
      }
}

class App extends Component {
  constructor()
  {
    super();
    this.state = initialState; 
  }

  loadUser = (data) =>{
    this.setState({user : {
      id : data.id,
      name: data.name,
      email : data.email,
      password : data.password,
      entries : data.entries,
      joined : data.joined,
    }
    })
  }
  


  findUrlName =  (data)=>{
   if(data)
   {
      return data
   }
   else 
   {
    let problem = "Manzil kiritishda xatolik yoki rasmdagi elementni topib bo'lmad :("
    return  problem;
   }
    
  }
  calculateFaceLocation = (data)=>{
  try {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage')
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol:clarifaiFace.left_col * width,
      topRow:clarifaiFace.top_row * height,
      rightCol: width-(clarifaiFace.right_col * width),
      bottomRow:height - (clarifaiFace.bottom_row * height),
      }
  } catch (error) {
    return {};
  }
    
  }

  setNewName = (name)=>{
    this.setState({itemName:name});
  }
   

  displayFaceBox = (box)=>{
    this.setState({box:box});
  }

  onInputChange = (event)=>{
    this.setState({input:event.target.value});
  }

  onButtonSubmit = ()=>{
   this.setState({imageUrl:this.state.input});
//=============================
  fetch('http://localhost:3000/imageurl',  {
    method:'post',
    headers:{'Content-Type' : 'application/json'} , 
    body: JSON.stringify({
        input:this.state.input
    })
  })
  .then(response => response.json())
  .then(response => 
      {
        if(response)
        {
          fetch('http://localhost:3000/image',  {
            method:'put',
            headers:{'Content-Type' : 'application/json'} , 
            body: JSON.stringify({
                id:this.state.user.id
            })
        })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user,{entries : count}))
          })
          .catch(console.log)
        }
         return  response;
      })
    .then(data => {
        var name = data.outputs[0].data.regions[0].data.concepts[0].name;  
        fetch(`https://api.mymemory.translated.net/get?q=${name}&langpair=en|uz&mt=0`)
        .then(response => response.json())
        .then(data =>{
          
          this.setNewName(this.findUrlName(data.responseData.translatedText));
          })  
        .catch(err => {
          this.setNewName(this.findUrlName())
          console.log(err)}) 
        // console.log(newdata)
      
      this.displayFaceBox(this.calculateFaceLocation(data))})
    .catch(error => {
       this.displayFaceBox({})
       this.setNewName(this.findUrlName())
    }); 
  //==============================
  }

  onRouteChange = (route) =>{
    if(route === 'signout')
    {
      this.setState(initialState)
    }else if (route === 'home')
    {
      this.setState({isSignedIn: true})
    }
    this.setState({route:route})
  }

  render(){
    const {isSignedIn,imageUrl,route,box , itemName} = this.state;
    return(
      <div className="App">
        <Particle className='particles' />
        <Navigation  isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />

        {
         route === 'home'
          ?<div>
          <Logo />
          <Rank 
          name={this.state.user.name}
          entries={this.state.user.entries}
          />
          <ImageLinkForm 
            onInputChange = {this.onInputChange}
            onButtonSubmit = {this.onButtonSubmit}
          />
          <ImageItem name = {itemName} />
          <FaceRecognition  box={box}  imageUrl = {imageUrl} />

        </div> 
          
          :(route === 'signin'
          ?<Signin loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
          :<Register  loadUser = {this.loadUser} onRouteChange = {this.onRouteChange} />
          ) 
         
        }
      </div>
    );
  }
}

export default App;
