import ACTIONS from "."

export const dispatchSetWs = (ws) => {
    return {
        type: ACTIONS.SET_REALTIME_WS,
        payload: ws
    }
}

export const dispatchSetNoti = (notificationSubscription) => {
    return {
        type: ACTIONS.SET_REALTIME_NOTI,
        payload: notificationSubscription
    }
}

export const dispatchRemoveNoti = () => {
    return {
        type: ACTIONS.REMOVE_REALTIME_NOTI
    }
}

export const dispatchSetPost = (postSubcription) => {
    console.log(postSubcription)
    return {
        type: ACTIONS.SET_REALTIME_POST,
        payload: postSubcription
    }
}

export const dispatchRemovePost = () => {
    return {
        type: ACTIONS.REMOVE_REALTIME_POST
    }
}