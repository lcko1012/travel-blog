import Cookies from 'js-cookie'
import { useDispatch, useSelector } from 'react-redux'
import SockJS from 'sockjs-client'
import * as Stomp from 'stompjs'
import {dispatchSetWs, dispatchSetNoti, dispatchRemoveNoti, dispatchRemovePost, dispatchSetPost} from '../redux/actions/realtimeAction'
import {dispatchIncreaseCount} from '../redux/actions/notifyAction'
import { dispatchAddCmt } from '../redux/actions/commentAction'

const useSocketDataObject = () => {
    let ws = null
    let notificationSubscription= null
    let commentSubcription = null
    const dispatch = useDispatch()
    const realtime = useSelector(state => state.realtime)

    const ConnectSocket = () => {
        const socket = new SockJS("/socket-server")
        ws = Stomp.over(socket)
        ws.debug = null
        ws.connect({}, () => {
            console.log("Kết nối thành công")
            dispatch(dispatchSetWs(ws))
        }, (err) => {
            console.log(err)
        })
    }

    const Subscribe_notify = (email) => {
        if(realtime.ws !== null && realtime.isSuccess === true){
          const token = Cookies.get("token")
          notificationSubscription = realtime.ws.subscribe(`/topic/notify/${email}`, (notify) => {
            dispatch(dispatchIncreaseCount(JSON.parse(notify.body)))
            
          }, {'Authorization': `Bearer ${token}`})
          dispatch(dispatchSetNoti(notificationSubscription))

        }
    }
    
    const Unsubscribe_notify = () => {
        console.log(realtime.notificationSubscription)
        console.log(notificationSubscription + "notifi")
        if (realtime.notificationSubscription !== null) {
          console.log("unsubscribe")
          realtime.notificationSubscription.unsubscribe();
          dispatch(dispatchRemoveNoti())
      }
  }
    const Subscribe_post = (id) => {
        if(realtime.ws !== null && realtime.isSuccess){
            commentSubcription = realtime.ws.subscribe(`/topic/post/${id}`, (comment) => {
                if(comment.body) {
                    dispatch(dispatchAddCmt(JSON.parse(comment.body)))
                }
            })
            dispatch(dispatchSetPost(commentSubcription))
        }
    }

    const Unsubscribe_post = (postSubcription) => {
        if (postSubcription !== null && realtime.isSuccess) {
          console.log("unsubscribe")
          postSubcription.unsubscribe();
          dispatch(dispatchRemovePost())
      }
      console.log(realtime.postSubcription)
  }


//   Subscribe_notify
    return {Subscribe_notify ,ConnectSocket, Unsubscribe_notify, Subscribe_post, Unsubscribe_post}

}

export default useSocketDataObject