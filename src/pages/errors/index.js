import App from './errors'
import Vue from 'vue'

const app = new Vue(App)

app.$mount()

export default {
    config: {
        navigationBarBackgroundColor: '#fffefb',
        navigationBarTextStyle: 'black',
        navigationBarTitleText: '美停',
        backgroundColor: '#FFFEFB',
        disableScroll: false
    }
}