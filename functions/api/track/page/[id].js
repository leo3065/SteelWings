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

    let trace_key = 'visit_trace'

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

        let record_str = await visit_record_kv.get(trace_key);
        let record_all = {}, record_cur = [];
        if (record_str !== null) {
            record_all = JSON.parse(record_str);
            if (params.id in record_all){
                record_cur = record_all[params.id];
            }
        }

        record_cur.push(latest_visit);
        record_cur = record_cur.slice(-10);

        record_all[params.id] = record_cur

        await visit_record_kv.put(
            trace_key, JSON.stringify(record_all),
            {'expirationTtl': /* expire time in seconds */ 60*60*24*28 /* 28 days */}
        );

        //return new Response(JSON.stringify(record));
        return Response.redirect(image_path, 302);
    } catch (err) {
        //flatten the error
        let json = JSON.stringify(err)
        //return the error
        return new Response(err, {'status': 418});
    }
}