import {videoApi, authHeader} from '../api'

export default {
    namespaced: true,
    state:{
        videos: [],
        video: {},
        videoToEdit: {},
        uploadVideo: '',
        uploadVideoThumbnail: '',
        uploadMetaData: {},
        info: [],
        showInfo: false,
    },
    mutations:{
        setVideos(state, videos){
            state.videos = videos
        },
        setVideo(state, video){
            state.video = video
        },
        setVideoToUpload(state, data){
            state.uploadVideo = data
        },
        setVideoThumbnailToUpload(state, data){
            state.uploadVideoThumbnail = data
        },
        setVideoMetaData(state, data){
            state.uploadMetaData = data
        },
        clearUpload(state){
            state.uploadVideo = ''
            state.uploadVideoThumbnail = ''
            state.uploadMetaData = ''
        },
        setVideoToEdit(state, data){
            state.videoToEdit = data
        },
        removeVideo(state, slug){
            state.videos.filter(x => x.slug != slug)
        },
        setInfo(state, info){
            state.info.push(info)
        },
        infoVisible(state, value){
            state.showInfo = value
        },
        clearInfo(state){
            state.info = []
        }
    },
    getters:{
        editVideo: state => {return state.videoToEdit},
        getVideo: state => {return state.video},
        getVideoBySlug: (state, slug) => {return state.videos.filter(video => {video.slug === slug})},
        videos: state => {return state.videos},
        uploadVideo: state => {return state.uploadVideo},
        uploadThumbnail: state => {return state.uploadVideoThumbnail},
        uploadMetaData: state => {return state.uploadMetaData},
        infoVisibility: state => {return state.showInfo},
        videoInfo: state => {return state.info}
    },
    actions:{
        hideInfo : ({commit}) => {
            commit("infoVisible", false)
        },
        showInfo : ({commit}) => {
            commit("infoVisible", true)
        },
        setInfo : ({commit}, info) => {
            commit("setInfo", info)
        },
        clearInfo : ({commit}) => {
            commit("clearInfo")
        },
        videoToEdit: ({commit}, video) => {
            commit("setVideoToEdit", video)
        },
        videoBySlug: ({commit}, slug) => {
            return new Promise( (res, rej) => {
                videoApi.get(slug + '/detail', authHeader())
                .then(result => {
                    //console.log(result.data.response)
                    commit('setVideo', result.data.response)
                    res(result)
                })
                .catch(error => {
                    rej(error)
                })
            })
        },
        allVideos: ({commit}, age) => {
            return new Promise( (res, rej) => {
                videoApi.get('/with-age-rate/all/' + age, authHeader())
                    .then(result => {
                        console.log(result.data.response)
                        commit('setVideos', result.data.response)
                        res(result)
                    })
                    .catch(error => {
                        rej(error)
                    })
            })
        },
        uploadMetaData: ({commit}, payload)=>{
            return new Promise( (res, rej) => {
                videoApi.post("", payload, authHeader())
                    .then(result => {
                        commit('setVideoMetaData', result)
                        res(result.data.response)
                    })
                    .catch(error => {
                        rej(error)
                    })
            })
        },
        updateMetaData: ({commit}, payload)=>{
            return new Promise( (res, rej) => {
                videoApi.put(payload.OLDslug, payload, authHeader())
                    .then(result => {
                        //console.log(result)
                        commit('setVideoMetaData', result)
                        res(result.data.response)
                    })
                    .catch(error => {
                        rej(error)
                    })
            })
        },
        uploadThumbnail: ({commit},  payload)=>{
            let formData = new FormData()
            formData.append("thumbnail", payload.thumbnail)
            return new Promise( (res, rej) => {
                videoApi.patch('upload-thumbnail/'+payload.slug, formData, authHeader())
                .then(result => {
                    commit('setVideoThumbnailToUpload', result)
                    res(result)
                })
                .catch(error => {
                    rej(error)
                })              
            })
        },
        uploadVideo: ({commit}, payload)=>{
            let formData = new FormData()
            formData.append("file", payload.file)
            return new Promise( (res, rej) => {
                videoApi.patch('upload/'+ payload.slug, formData, authHeader())
                .then(result => {
                    commit('setVideoToUpload', result)
                    res(result)
                })
                .catch(error => {
                    rej(error)
                })              
            })
        },
        deleteVideo: ({commit}, slug) => {
            return new Promise( (res, rej) => {
                videoApi.delete(slug, authHeader())
                .then(result => {
                    //console.log(result)
                    commit('removeVideo', slug)
                    res(result)
                })
                .catch(error => {
                    rej(error)
                })
            })
        }
    }
}