# Sobe arquivos grandes para o Google Drive (upload resumable), sem passar pelo chat.
# Uso: python3 ferramentas/drive/subir.py "<nome da pasta no Drive>" arquivo1 [arquivo2 ...]
# Credenciais (variáveis do ambiente): YT_CLIENT_ID, YT_CLIENT_SECRET, GDRIVE_REFRESH_TOKEN (escopo drive.file).
# Com drive.file o app só enxerga o que ele mesmo criou: a pasta é criada aqui e o Diego a move uma vez
# para dentro da pasta do curso; depois disso os envios continuam caindo nela.
import json, mimetypes, os, sys, urllib.parse, urllib.request

API = 'https://www.googleapis.com/drive/v3/files'
UP = 'https://www.googleapis.com/upload/drive/v3/files'
PEDACO = 8 * 1024 * 1024


def token():
    dados = urllib.parse.urlencode({
        'client_id': os.environ['YT_CLIENT_ID'], 'client_secret': os.environ['YT_CLIENT_SECRET'],
        'refresh_token': os.environ['GDRIVE_REFRESH_TOKEN'], 'grant_type': 'refresh_token'}).encode()
    with urllib.request.urlopen('https://oauth2.googleapis.com/token', dados) as r:
        return json.load(r)['access_token']


def req(url, tk, metodo='GET', corpo=None, cab=None):
    h = {'Authorization': f'Bearer {tk}', **(cab or {})}
    r = urllib.request.Request(url, data=corpo, headers=h, method=metodo)
    return urllib.request.urlopen(r)


def pasta(tk, nome):
    q = f"name = '{nome}' and mimeType = 'application/vnd.google-apps.folder' and trashed = false"
    with req(API + '?' + urllib.parse.urlencode({'q': q, 'fields': 'files(id,webViewLink)'}), tk) as r:
        achou = json.load(r)['files']
    if achou:
        return achou[0]
    meta = json.dumps({'name': nome, 'mimeType': 'application/vnd.google-apps.folder'}).encode()
    with req(API + '?fields=id,webViewLink', tk, 'POST', meta, {'Content-Type': 'application/json'}) as r:
        return json.load(r)


def existe(tk, pid, nome):
    q = f"name = '{nome}' and '{pid}' in parents and trashed = false"
    with req(API + '?' + urllib.parse.urlencode({'q': q, 'fields': 'files(id,size)'}), tk) as r:
        return json.load(r)['files']


def subir(tk, pid, caminho):
    nome = os.path.basename(caminho)
    tam = os.path.getsize(caminho)
    ja = existe(tk, pid, nome)
    if ja and int(ja[0].get('size', -1)) == tam:
        print(f'  = {nome} já está no Drive'); return
    tipo = mimetypes.guess_type(nome)[0] or 'application/octet-stream'
    meta = json.dumps({'name': nome, 'parents': [pid]}).encode()
    with req(UP + '?uploadType=resumable&fields=id', tk, 'POST', meta,
             {'Content-Type': 'application/json; charset=UTF-8', 'X-Upload-Content-Type': tipo,
              'X-Upload-Content-Length': str(tam)}) as r:
        sessao = r.headers['Location']
    with open(caminho, 'rb') as f:
        ini = 0
        while ini < tam:
            bloco = f.read(PEDACO); fim = ini + len(bloco) - 1
            try:
                with req(sessao, tk, 'PUT', bloco, {'Content-Range': f'bytes {ini}-{fim}/{tam}'}) as r:
                    r.read()
            except urllib.error.HTTPError as e:
                if e.code != 308:  # 308 = "continue mandando"
                    raise
            ini = fim + 1
            print(f'  {nome}: {ini * 100 // tam}%', end='\r')
    print(f'  ✓ {nome} ({tam / 1e6:.1f} MB)        ')


if __name__ == '__main__':
    tk = token()
    p = pasta(tk, sys.argv[1])
    print('Pasta:', p.get('webViewLink'))
    for c in sys.argv[2:]:
        subir(tk, p['id'], c)
