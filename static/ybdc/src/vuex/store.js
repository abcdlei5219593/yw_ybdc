import Vue from 'vue'
import Vuex from 'vuex'
import {queryCity} from '../service/getData.js'

Vue.use(Vuex)

const state = {
	loginUser:'',
	firstMenu:[],
	cityCode:''
}

const mutations = {
	USER_LOGIN(state,result) {
		state.loginUser = result;
	},
	USER_MENU(state,result){
		state.firstMenu = result;
	},
	USER_CITY(state,result){
		state.cityCode = result;
	}
}

export default new Vuex.Store({
  state,
  mutations
})
