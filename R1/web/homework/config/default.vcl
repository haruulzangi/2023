vcl 4.1;

backend default {
    .host = "127.0.0.1";
    .port = "1337";
}

sub vcl_hash {
    hash_data(req.url);

    if (req.http.host) {
        hash_data(req.http.host);
    } else {
        hash_data(server.ip);
    }
    return (lookup);
}


sub vcl_recv {
    if ( ( req.url ~ "^/static") ) {
        return(hash);
    }
}

sub vcl_backend_response {
    if (bereq.url ~ "^/$") {
        set beresp.ttl = 30s;
    } else if (bereq.url ~ "^/static") {
        if(beresp.status != 200)
        {
            set beresp.ttl = 5s;
        }
        else
        {
            set beresp.ttl = 60s;
        }
    } 
}

sub vcl_deliver {
    if (obj.hits > 0) {
        set resp.http.X-Cache = "HIT";
    } else {
        set resp.http.X-Cache = "MISS";
    }

    set resp.http.X-Cache-Hits = obj.hits;
}

