const state = {}

const maxRows = 500

const mutations = {
  INIT (state, {id}) {
    state[id] = {
      log: [],
      status: 'unknown'
    }
  },
  LOG_LINE (state, {id, data}) {
    state[id].log.push(data)

    if (state[id].log.length > maxRows) {
      state[id].log.splice(0, state[id].log.length - maxRows)
    }
  },

  LOG_CLEAR (state, {id}) {
    state[id].log.splice(0)
  },

  SET_STATUS (state, {id, status}) {
    state[id].status = status
  }
}

const actions = {
  init ({ commit }, {id}) {
    commit('INIT', {id})
  },
  logLine ({ commit }, {id, data}) {
    // do something async
    commit('LOG_LINE', {id, data})
  },
  logClear ({ commit }, data) {
    commit('LOG_CLEAR', data)
  },
  setStatus ({ commit }, data) {
    commit('SET_STATUS', data)
  }
}

export default {
  state,
  mutations,
  actions
}
