#!/usr/bin/env python3
"""MCP (stdio) gratuito para métricas dos canais do YouTube — sem dependências externas.

Usa a YouTube Data API v3 e a YouTube Analytics API (gratuitas, cota diária do Google Cloud).
Credenciais lidas de variáveis de ambiente (nunca coloque no código):
  YT_CLIENT_ID, YT_CLIENT_SECRET          -> cliente OAuth do Google Cloud
  YT_REFRESH_TOKEN_<CANAL>                -> um refresh token por canal (ex.: YT_REFRESH_TOKEN_REBOBINA)

Modos:
  python3 server.py                       -> servidor MCP via stdio
  python3 server.py cli <ferramenta> '{"canal":"rebobina"}'   -> teste rápido no terminal
"""
import json, os, sys, urllib.parse, urllib.request, datetime

DATA = 'https://www.googleapis.com/youtube/v3/'
ANALYTICS = 'https://youtubeanalytics.googleapis.com/v2/reports'
_tokens = {}


def canais():
    return sorted(k[len('YT_REFRESH_TOKEN_'):].lower() for k in os.environ if k.startswith('YT_REFRESH_TOKEN_'))


def token(canal):
    canal = (canal or (canais() or [''])[0]).lower()
    if canal in _tokens:
        return _tokens[canal]
    rt = os.environ.get('YT_REFRESH_TOKEN_' + canal.upper())
    if not rt:
        raise RuntimeError(f'Canal "{canal}" sem refresh token. Canais configurados: {canais() or "nenhum"}')
    body = urllib.parse.urlencode({'client_id': os.environ['YT_CLIENT_ID'], 'client_secret': os.environ['YT_CLIENT_SECRET'],
                                   'refresh_token': rt, 'grant_type': 'refresh_token'}).encode()
    r = json.load(urllib.request.urlopen('https://oauth2.googleapis.com/token', body, timeout=20))
    _tokens[canal] = r['access_token']
    return r['access_token']


def get(url, params, canal):
    req = urllib.request.Request(url + '?' + urllib.parse.urlencode(params), headers={'Authorization': 'Bearer ' + token(canal)})
    try:
        return json.load(urllib.request.urlopen(req, timeout=30))
    except urllib.error.HTTPError as e:
        raise RuntimeError(f'{e.code}: {e.read().decode()[:400]}')


def report(canal, metrics, start, end, **kw):
    p = {'ids': 'channel==MINE', 'startDate': start, 'endDate': end, 'metrics': metrics}
    p.update({k: v for k, v in kw.items() if v})
    r = get(ANALYTICS, p, canal)
    cols = [c['name'] for c in r.get('columnHeaders', [])]
    return [dict(zip(cols, row)) for row in r.get('rows', [])]


def datas(dias):
    end = datetime.date.today() - datetime.timedelta(days=1)
    return str(end - datetime.timedelta(days=int(dias) - 1)), str(end)


# ---------------- ferramentas ----------------
def t_canais(a):
    return {'canais_configurados': canais()}


def t_resumo_canal(a):
    c = a.get('canal'); s, e = datas(a.get('dias', 28))
    ch = get(DATA + 'channels', {'part': 'snippet,statistics', 'mine': 'true'}, c)['items'][0]
    tot = report(c, 'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained,subscribersLost,likes,comments,shares', s, e)
    return {'canal': ch['snippet']['title'], 'estatisticas_totais': ch['statistics'], 'periodo': [s, e], 'periodo_metricas': tot[0] if tot else {}}


def t_videos_recentes(a):
    c = a.get('canal'); n = int(a.get('quantidade', 15))
    up = get(DATA + 'channels', {'part': 'contentDetails', 'mine': 'true'}, c)['items'][0]['contentDetails']['relatedPlaylists']['uploads']
    items = get(DATA + 'playlistItems', {'part': 'contentDetails', 'playlistId': up, 'maxResults': min(n, 50)}, c)['items']
    ids = ','.join(i['contentDetails']['videoId'] for i in items)
    vs = get(DATA + 'videos', {'part': 'snippet,statistics,contentDetails', 'id': ids}, c)['items']
    return [{'id': v['id'], 'titulo': v['snippet']['title'], 'publicado': v['snippet']['publishedAt'][:10],
             'duracao': v['contentDetails']['duration'], **{k: int(x) for k, x in v['statistics'].items() if x.isdigit()}} for v in vs]


def t_top_videos(a):
    c = a.get('canal'); s, e = datas(a.get('dias', 28))
    rows = report(c, 'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,subscribersGained', s, e,
                  dimensions='video', sort='-views', maxResults=int(a.get('quantidade', 10)))
    if rows:
        tit = {v['id']: v['snippet']['title'] for v in get(DATA + 'videos', {'part': 'snippet', 'id': ','.join(r['video'] for r in rows)}, c)['items']}
        for r in rows: r['titulo'] = tit.get(r['video'], '')
    return {'periodo': [s, e], 'videos': rows}


def t_metricas_video(a):
    c = a.get('canal'); v = a['video_id']; s, e = datas(a.get('dias', 365))
    tot = report(c, 'views,estimatedMinutesWatched,averageViewDuration,averageViewPercentage,likes,comments,shares,subscribersGained', s, e, filters='video==' + v)
    trafego = report(c, 'views', s, e, dimensions='insightTrafficSourceType', filters='video==' + v, sort='-views')
    return {'video_id': v, 'totais': tot[0] if tot else {}, 'origem_trafego': trafego}


def t_retencao_video(a):
    c = a.get('canal'); v = a['video_id']; s, e = datas(a.get('dias', 365))
    rows = report(c, 'audienceWatchRatio,relativeRetentionPerformance', s, e, dimensions='elapsedVideoTimeRatio', filters='video==' + v)
    return {'video_id': v, 'explicacao': 'elapsedVideoTimeRatio = posição no vídeo (0–1); audienceWatchRatio = fração do público ainda assistindo', 'curva': rows}


TOOLS = {
    'canais': (t_canais, 'Lista os canais configurados (Rebobina, Consta nos Autos...).', {}),
    'resumo_canal': (t_resumo_canal, 'Totais do canal e métricas do período (views, minutos, duração média, % assistida, inscritos).',
                     {'canal': 'string', 'dias': 'integer'}),
    'videos_recentes': (t_videos_recentes, 'Últimos vídeos publicados com views, likes e comentários.', {'canal': 'string', 'quantidade': 'integer'}),
    'top_videos': (t_top_videos, 'Vídeos com mais views no período, com retenção média.', {'canal': 'string', 'dias': 'integer', 'quantidade': 'integer'}),
    'metricas_video': (t_metricas_video, 'Métricas de um vídeo e origem do tráfego (Shorts feed, busca, sugeridos...).',
                       {'canal': 'string', 'video_id': 'string', 'dias': 'integer'}),
    'retencao_video': (t_retencao_video, 'Curva de retenção de um vídeo (onde o público sai).', {'canal': 'string', 'video_id': 'string', 'dias': 'integer'}),
}


def schema(props):
    req = ['video_id'] if 'video_id' in props else []
    return {'type': 'object', 'properties': {k: {'type': t} for k, t in props.items()}, 'required': req}


def handle(msg):
    m, i = msg.get('method'), msg.get('id')
    if m == 'initialize':
        res = {'protocolVersion': msg['params'].get('protocolVersion', '2025-06-18'), 'capabilities': {'tools': {}},
               'serverInfo': {'name': 'youtube-metricas', 'version': '1.0'}}
    elif m == 'tools/list':
        res = {'tools': [{'name': n, 'description': d, 'inputSchema': schema(p)} for n, (_, d, p) in TOOLS.items()]}
    elif m == 'tools/call':
        fn = TOOLS[msg['params']['name']][0]
        try:
            out = fn(msg['params'].get('arguments') or {})
            res = {'content': [{'type': 'text', 'text': json.dumps(out, ensure_ascii=False, indent=1)}]}
        except Exception as ex:
            res = {'content': [{'type': 'text', 'text': f'Erro: {ex}'}], 'isError': True}
    elif m == 'ping':
        res = {}
    else:
        if i is None:
            return None
        return {'jsonrpc': '2.0', 'id': i, 'error': {'code': -32601, 'message': f'método não suportado: {m}'}}
    return None if i is None else {'jsonrpc': '2.0', 'id': i, 'result': res}


def main():
    if len(sys.argv) > 2 and sys.argv[1] == 'cli':
        args = json.loads(sys.argv[3]) if len(sys.argv) > 3 else {}
        print(json.dumps(TOOLS[sys.argv[2]][0](args), ensure_ascii=False, indent=1)); return
    for line in sys.stdin:
        if not line.strip():
            continue
        out = handle(json.loads(line))
        if out is not None:
            sys.stdout.write(json.dumps(out) + '\n'); sys.stdout.flush()


if __name__ == '__main__':
    main()
