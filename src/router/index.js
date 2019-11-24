import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import SignIn from '../components/Login/SignIn.vue'
import SignUp from '../components/Login/SignUp.vue'
import Movie from '../components/Movie/Movie.vue'
import Music from '../components/Music/Music.vue'
import Photo from '../components/Photo/Photo.vue'
import UserSettings from '../components/User/UserSettings.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
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
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/movie',
    name: 'Movie',
    component: Movie
  },
  {
    path: '/music',
    name: 'About',
    component: Music
  },
  {
    path: '/photo',
    name: 'Photo',
    component: Photo
  },
  {
    path: '/settings',
    name: 'UserSettings',
    component: UserSettings
  },

]

const router = new VueRouter({
  routes
})

export default router