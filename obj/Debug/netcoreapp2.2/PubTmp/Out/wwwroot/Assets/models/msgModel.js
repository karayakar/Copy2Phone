var msgModel = {
    from: null,
    fromService: null,
    to: null,
    toService: null,
    path: null,
    isPublic: false,
    contentType: null,
    accept: null,
    timeOut: 0,
    requestedTime: null,
    proxy: {
        server: null,
        ip: null,
        timeIn: null,
        timeOut: null
    },
    routes: {
        order: 0,
        host: null,
        ip: null,
        port: null,

    },

    syncAllRoutes: null
    ,
    auth: {
        type: null,
        key: null
    }
    ,
    message: {
        raw: null,
        type: null
    }
}

