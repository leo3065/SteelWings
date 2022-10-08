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

    try {
        let image_path = 'https://via.placeholder.com/150.png';
        // image_path = './assets/images/1x1.png';

        const visit_record_kv = env.VISIT_RECORD;

        let latest_visit = {
            'time': new Date(),
            'headers': Object.fromEntries(request.headers.entries()),
            'method': request.method,
            'url': request.url,
        };

        let record_str = await visit_record_kv.get(params.id);
        let record;
        if (record_str === null) {
            record = [];
        }else{
            record = JSON.parse(record_str);
        }

        record.push(latest_visit);
        record = record.slice(-10);

        await visit_record_kv.put(
            params.id, JSON.stringify(record),
            {'expirationTtl': /* expire time in seconds */ 60*60*24*28 /* 28 days */}
        );

        return Response.redirect(image_path, 301);
    } catch (err) {
        //flatten the error
        let json = JSON.stringify(err)
        //return the error
        return new Response(err);
    }
}