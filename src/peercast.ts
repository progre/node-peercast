import events = require('events');
import path = require('path');
import log4js = require('log4js');
import pcp = require('./pcp');

var logger = log4js.getLogger();

class PeerCast extends events.EventEmitter {
    private server = pcp.createServer();

    constructor(private localPort: number) {
        super();
    }

    /**
     * クライアントから配信掲載を受け付けて、外部YPにリレーする為に接続の受付を開始する
     */
    listen() {
        this.server.on('connection', socket => {
            socket.on('hello',() => {
                socket.olleh();
            });
        });
        this.server.on('request',(req, res, socket) => {
            var url = path.normalize(req.url).split('?')[0].split('/');
            if (url[0] === 'channel') {
                if (url.length < 1 || url[1].length !== 32) {
                    res.writeHead(404);
                    res.end();
                    return;
                }
                // idにマッチする配信を持っているか？
                // 無い
                res.writeHead(404);
                res.end();
                return;
            }
            res.writeHead(404);
            res.end();
        });
        this.server.listen(this.localPort);
    }

    getStream(remoteAddress: string, remotePort: number, channelId: string) {
        return pcp.request({
            host: remoteAddress,
            port: remotePort,
            path: '/channel/' + channelId
        })
            .then(res => {
            logger.debug('status: ' + res.statusCode);
            if (res.statusCode === 404) {
                return;
            }
            var socket = res.socket;
            if (res.statusCode === 200) {
                socket.hello(0);
                socket.on('olleh',() => {
                    console.log('olleh!');
                });
                return;
            }
            if (res.statusCode === 503) {
                socket.hello(0);
                return;
            }
        });

    }

    quit() {
        logger.debug('quit()');
        this.emit('end');
    }
}

export = PeerCast;
