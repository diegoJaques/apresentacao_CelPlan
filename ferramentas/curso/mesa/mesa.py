# Mesa virtual: opera um desktop Ubuntu de verdade (tela virtual :99), grava a tela e tira um print por passo.
# Uso: python3 ferramentas/curso/mesa/mesa.py <roteiro.json> <pasta_saida>
# Antes, uma vez por sessão: bash ferramentas/curso/mesa/instalar.sh
#
# Ações do roteiro (passos): mesmas ideias do captura.mjs, com "fala"/"rotulo"/"codigo" para o montar.py.
#   ligar                      liga a tela virtual e o desktop do usuário "aluno"
#   abrir_terminal             abre o terminal maximizado
#   gravar_inicio / gravar_fim grava a tela (ffmpeg x11grab, 30 fps) em <saida>/gravacao.mp4
#   digitar  {valor, enter, esperar_fim, timeout, atraso}
#            digita como gente (atraso ms por tecla); enter=true aperta Enter;
#            esperar_fim=true espera o comando terminar (marcador do prompt), até timeout s
#   tecla    {valor}           ex.: "ctrl+l", "Return"
#   clicar   {x, y}
#   esperar  {ms}
# Todo passo gera NN.png; se a gravação estiver ligada, passos.json guarda t_ini/t_fim (s) do trecho do passo.
import json, os, subprocess, sys, time

ROT, OUT = sys.argv[1], sys.argv[2]
os.makedirs(OUT, exist_ok=True)
FFMPEG = os.path.expanduser('~/bin/ffmpeg') if os.path.exists(os.path.expanduser('~/bin/ffmpeg')) else 'ffmpeg'
D = ':99'
ENV = dict(os.environ, DISPLAY=D)
MARCA = '/tmp/mesa_fim'

def sh(cmd, **k): return subprocess.run(cmd, shell=True, env=ENV, **k)
def xdo(*a): subprocess.run(['xdotool', *a], env=ENV, check=False)
def como_aluno(cmd): return subprocess.Popen(['su', '-', 'aluno', '-c', f'DISPLAY={D} {cmd}'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL, start_new_session=True)

def print_tela(caminho):
    subprocess.run([FFMPEG, '-y', '-loglevel', 'error', '-f', 'x11grab', '-video_size', '1920x1080', '-i', D, '-frames:v', '1', caminho], env=ENV, check=True)

def marca(): return os.path.getmtime(MARCA) if os.path.exists(MARCA) else 0

grav, t0 = None, None
def agora(): return round(time.time() - t0, 2) if t0 else None

passos = json.load(open(ROT))['passos']
out = []
for i, s in enumerate(passos):
    a = s['acao']; t_ini = agora()
    if a == 'ligar':
        if subprocess.run(['xdotool', 'getdisplaygeometry'], env=ENV, capture_output=True).returncode != 0:
            subprocess.Popen(['Xvfb', D, '-screen', '0', '1920x1080x24', '-ac', '-nolisten', 'tcp'], stdout=subprocess.DEVNULL,
                             stderr=open('/tmp/xvfb.log', 'w'), start_new_session=True)
            time.sleep(2)
        como_aluno('dbus-launch --exit-with-session startxfce4'); time.sleep(s.get('espera', 8000) / 1000)
    elif a == 'abrir_terminal':
        como_aluno('xfce4-terminal --maximize --working-directory=/home/aluno'); time.sleep(3)
        xdo('mousemove', '1900', '1060')   # tira o cursor do meio do texto
        sh('wmctrl -a Terminal')
    elif a == 'gravar_inicio':
        grav = subprocess.Popen([FFMPEG, '-y', '-loglevel', 'error', '-f', 'x11grab', '-framerate', '30', '-video_size', '1920x1080', '-i', D,
                                 '-c:v', 'libx264', '-preset', 'ultrafast', '-crf', '20', '-pix_fmt', 'yuv420p', f'{OUT}/gravacao.mp4'],
                                stdin=subprocess.PIPE, env=ENV)
        t0 = time.time(); t_ini = 0.0; time.sleep(0.5)
    elif a == 'gravar_fim' and grav:
        time.sleep(0.5); grav.communicate(b'q', timeout=60); grav = None
    elif a == 'digitar':
        antes = marca()
        xdo('type', '--delay', str(s.get('atraso', 55)), s['valor'])
        if s.get('enter', True):
            time.sleep(0.3); xdo('key', 'Return')
        if s.get('esperar_fim'):
            fim = time.time() + s.get('timeout', 900)
            while marca() == antes and time.time() < fim: time.sleep(0.5)
            if marca() == antes: print('  aviso: comando não terminou no tempo', i + 1)
    elif a == 'tecla': xdo('key', s['valor'])
    elif a == 'clicar': xdo('mousemove', str(s['x']), str(s['y']), 'click', '1')
    time.sleep(s.get('espera', 1200) / 1000 if a != 'ligar' else 0)
    nome = f'{i+1:02d}.png'
    if a != 'gravar_fim': print_tela(f'{OUT}/{nome}')
    reg = {**s, 'img': nome, 'url_atual': 'file:terminal', 'caixa': s.get('caixa_fixa')}
    if t0 and a not in ('gravar_inicio', 'gravar_fim'): reg.update(gravacao='gravacao.mp4', t_ini=t_ini, t_fim=agora())
    out.append(reg)
    print(i + 1, a, s.get('valor', '')[:60], f'[{t_ini}-{reg.get("t_fim")}]' if t0 else '')
if grav: grav.communicate(b'q', timeout=60)
json.dump(out, open(f'{OUT}/passos.json', 'w'), ensure_ascii=False, indent=1)
