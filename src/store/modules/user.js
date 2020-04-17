const user = {
  state: {
    wxscToken: "",//访问token
    wxuser:null,
    agentRoleId: null
  },
  getters: {
    wxscToken(state) {
      if (state.wxscToken == "") {
        state.wxscToken = localStorage.getItem('wxscToken');
      }
      return state.wxscToken ? state.wxscToken : "";
    },
    agentRoleId(state) {
      if (!state.agentRoleId) {
        state.agentRoleId = localStorage.getItem('agentRoleId');
      }
      return state.agentRoleId ? state.agentRoleId : null;
    },
    wxuser(state){
      if (!state.wxuser) {
        state.wxuser = JSON.parse(localStorage.getItem('wxuser'));
      }
      return state.wxuser ? state.wxuser : null;
    }
  },
  mutations: {
    logout (state, vm) {
      //Cookies.remove('token');
      localStorage.removeItem('wxscToken');
      localStorage.removeItem('agentRoleId');
      localStorage.clear();
      state.wxscToken = "";
    },
    saveToken(state, token){
      //Cookies.set("token",token);
      localStorage.setItem('wxscToken', token);
      state.wxscToken = token;
    },
    saveAgentRoleId(state,roleId){
      localStorage.setItem('agentRoleId',roleId);
      state.agentRoleId = roleId;
    },
    saveWxuser(state,wxuser){
      localStorage.setItem('wxuser',JSON.stringify(wxuser));
      state.wxuser = wxuser;
    }
  }
};

export default user;
