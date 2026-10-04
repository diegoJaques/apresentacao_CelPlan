"""Trilhas e efeitos sintetizados (sem direitos autorais). Uso: python3 trilha.py <tipo> <saida.wav> <segundos> [inicio_tensao fim_tensao]
tipos: pad (acordes Am-F-C-G suaves + grave), piano (arpejo lento e calmo, para vídeo longo), alerta (3 bipes), clique, gelo (estalos)."""
import sys, wave, numpy as np
sr = 44100
def save(n, x):
    x = np.clip(x, -1, 1); d = (np.repeat(x[:, None], 2, 1) * 32767).astype('<i2')
    w = wave.open(n, 'wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(sr); w.writeframes(d.tobytes()); w.close()
def pad(D, t0=None, t1=None):
    t = np.arange(int(sr * D)) / sr; x = np.zeros_like(t); note = lambda f: 440 * 2 ** ((f - 69) / 12)
    ch = [[45, 52, 57, 60], [41, 48, 53, 57], [48, 55, 60, 64], [43, 50, 55, 59]]; L = 8.0
    for i in range(int(D / L) + 1):
        s = i * L; m = (t >= s) & (t < s + L + 2); tt = t[m] - s; env = np.minimum(1, tt / 2.5) * np.clip((L + 2 - tt) / 2.5, 0, 1)
        for k, n in enumerate(ch[i % 4]):
            f = note(n); x[m] += .05 * env * (np.sin(2 * np.pi * f * tt) + .3 * np.sin(4 * np.pi * f * tt + .4)) * (.8 if k else 1.2)
    x += .04 * np.sin(2 * np.pi * 55 * t) * (.6 + .4 * np.sin(2 * np.pi * .05 * t))
    if t0 is not None:  # batida de coração acelerando até o clímax
        b = t0
        while b < t1:
            m = (t >= b) & (t < b + .25); tt = t[m] - b; x[m] += .2 * np.sin(2 * np.pi * 48 * tt) * np.exp(-tt * 18); b += .95 - .45 * (b - t0) / (t1 - t0)
    return x / np.max(np.abs(x)) * .8
def piano(D):
    """Arpejo de piano lento (~66 bpm) sobre pad suave; progressão de 8 acordes para não cansar em vídeos longos."""
    t = np.arange(int(sr * D)) / sr; x = np.zeros_like(t); note = lambda f: 440 * 2 ** ((f - 69) / 12)
    prog = [[48, 52, 55, 60], [45, 48, 52, 57], [41, 45, 48, 53], [43, 47, 50, 55], [45, 48, 52, 57], [40, 43, 47, 52], [41, 45, 48, 53], [48, 52, 55, 60]]
    beat = 60 / 66; bar = beat * 4; patt = [0, 2, 1, 3, 2, 1, 3, 2]
    for i in range(int(D / bar) + 1):
        c = prog[i % len(prog)]; s0 = i * bar
        for j, k in enumerate(patt):
            s = s0 + j * beat / 2; n = c[k] + 12; f = note(n); m = (t >= s) & (t < s + 3.5); tt = t[m] - s
            x[m] += .05 * np.exp(-tt * 1.6) * (np.sin(2 * np.pi * f * tt) + .35 * np.sin(4 * np.pi * f * tt) + .1 * np.sin(6 * np.pi * f * tt)) * np.minimum(1, tt * 300)
        m = (t >= s0) & (t < s0 + bar + 1.5); tt = t[m] - s0; env = np.minimum(1, tt / 1.5) * np.clip((bar + 1.5 - tt) / 1.5, 0, 1)
        for n in c[:2]: x[m] += .025 * env * np.sin(2 * np.pi * note(n - 12) * tt)
    fade = np.minimum(1, t / 3) * np.clip((D - t) / 4, 0, 1)
    return x * fade / np.max(np.abs(x)) * .7
if __name__ == '__main__':
    tipo, out = sys.argv[1], sys.argv[2]
    if tipo == 'pad':
        a = [float(v) for v in sys.argv[3:]]; save(out, pad(a[0], *(a[1:3] if len(a) >= 3 else [None, None])))
    elif tipo == 'piano':
        save(out, piano(float(sys.argv[3])))
    elif tipo == 'alerta':
        t = np.arange(int(sr * 1.6)) / sr; x = np.zeros_like(t)
        for k in range(3):
            m = (t >= k * .5) & (t < k * .5 + .28); tt = t[m] - k * .5
            x[m] += .22 * np.sign(np.sin(2 * np.pi * 880 * tt)) * np.minimum(1, tt * 80) * np.minimum(1, (.28 - tt) * 80)
        save(out, x)
    elif tipo == 'clique':
        t = np.arange(int(sr * .12)) / sr; save(out, .6 * (.8 * np.random.RandomState(1).randn(len(t)) * np.exp(-t * 90) + .5 * np.sin(2 * np.pi * 2400 * t) * np.exp(-t * 60)))
    elif tipo == 'gelo':
        t = np.arange(int(sr * .5)) / sr; r = np.random.RandomState(2); x = np.zeros_like(t)
        for k in range(9):
            s = int(r.uniform(0, .3) * sr); n = int(.04 * sr); x[s:s + n] += r.randn(n) * np.exp(-np.arange(n) / sr * 120) * .6
        save(out, x)
