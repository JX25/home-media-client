import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
//VIDEO
import VideoList from '../components/Video/VideoList.vue'
import AddVideo from '../components/Video/AddVideo'
import EditVideo from '../components/Video/EditVideo'
//AUDIO
import AddAudio from '../components/Audio/AddAudio.vue'
import EditAudio from '../components/Audio/EditAudio'
import AudioList from '../components/Audio/AudioList.vue'
//IMAGE
import ImageList from '../components/Image/ImageList.vue'
import AddImage from '../components/Image/AddImage.vue'
import EditImage from '../components/Image/EditImage.vue'
//USER
import UserSettings from '../components/User/UserSettings.vue'
import SignIn from '../components/Login/SignIn.vue'
import SignUp from '../components/Login/SignUp.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/home',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  //USER
 {
    path: '/settings',
    name: 'UserSettings',
    component: UserSettings
  },
  {
    path: '/sign_in',
    name: 'SignIn',
    component: SignIn
  },
  {
    path: '/sign_up',
    name: 'SignUp',
    component: SignUp
  },
  //VIDEO
  {
    path: '/admin/video',
    name: 'VideoList',
    component: VideoList
  },
  {
    path: '/admin/video/add',
    name: 'AddVideo',
    component: AddVideo
  },
  {
    path: '/admin/video/edit/:slug',
    name: 'EditVideo',
    component: EditVideo
  },
  //AUDIO
  {
    path: '/admin/audio',
    name: 'AudioList',
    component: AudioList
  },
  {
    path: '/admin/audio/add',
    name: 'AddAudio',
    component: AddAudio
  },
  {
    path: '/admin/audio/edit/:slug',
    name: 'EditAudio',
    component: EditAudio
  },
  //IMAGE
  {
    path: '/admin/image',
    name: 'ImageList',
    component: ImageList
  },
  {
    path: '/admin/image/add',
    name: 'AddImage',
    component: AddImage
  },
  {
    path: '/admin/image/edit',
    name: 'EditImage',
    component: EditImage
  },


]

const router = new VueRouter({
  routes
})

export default router