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

    let trace_key = env.TRACE_KEY;

    try {
        const visit_record_kv = env.VISIT_RECORD;

        let record_str = await visit_record_kv.get(trace_key);
        if (record_str === null) {
            record_str = '{}';
        }
        return new Response(record_str);
    } catch (err) {
        //flatten the error
        let json = JSON.stringify(err);
        //return the error
        return new Response(err);
    }
}