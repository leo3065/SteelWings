export async function onRequestGet(context) {
    // Contents of context object
    const {
        request, // same as existing Worker API
        env, // same as existing Worker API
        params, // if filename includes [id] or [[path]]
        waitUntil, // same as ctx.waitUntil in existing Worker API
        next, // used for middleware or to fetch assets
        data, // arbitrary space for passing data between middlewares
    } = context;

    let image_path = 'https://via.placeholder.com/150.png';
    // image_path = './assets/images/1x1.png';

    let latest_visit = {
        time: new Date().getTime(),
        headers: Object.fromEntries(request.headers.entries()),
        method: request.method,
        url: request.url,
    };

    let record_str = VISIT_RECORD.get(params);
    if (record_str === null) {
        let record = [];
    }else{
        let record = json.parse(record_str);
    }

    record.push(latest_visit);
    record = record.slice(-10);

    VISIT_RECORD.put(
        params, value,
        {expirationTtl: /* expire time in seconds */ 60*60*24*28 /* 28 days */}
    );

    return Response.redirect(image_path, 301);
}