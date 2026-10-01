# Trilha original (piano + pad) para a homenagem. Sem samples de terceiros.
import numpy as np, wave
SR=44100; DUR=266.0; N=int(SR*DUR)
out=np.zeros(N)
def f(m): return 440*2**((m-69)/12)
def piano(t0,m,v,d=3.5):
    s=int(t0*SR); n=int(d*SR)
    if s>=N: return
    n=min(n,N-s); t=np.arange(n)/SR; fr=f(m)
    env=np.exp(-t*1.6)*(1-np.exp(-t*200))
    w=(np.sin(2*np.pi*fr*t)+.45*np.sin(2*np.pi*2*fr*t)*np.exp(-t*2.5)+.2*np.sin(2*np.pi*3*fr*t)*np.exp(-t*4)+.08*np.sin(2*np.pi*4.01*fr*t)*np.exp(-t*6))
    out[s:s+n]+=v*env*w
def pad(t0,ms,v,d):
    s=int(t0*SR); n=min(int(d*SR),N-s)
    if n<=0: return
    t=np.arange(n)/SR; env=np.minimum(1,t/2.5)*np.minimum(1,(d-t)/2.5)
    for m in ms:
        fr=f(m); out[s:s+n]+=v*env*(np.sin(2*np.pi*fr*t)+.5*np.sin(2*np.pi*fr*1.003*t))/len(ms)
# progressões (4 s por acorde, 60 bpm em colcheias lentas)
Dm=[50,57,62,65,69]; Bb=[46,53,58,62,65]; F=[41,53,57,60,65]; C=[48,55,60,64,67]; Gm=[43,55,58,62,67]; A=[45,52,57,61,64]
prog=[Dm,Bb,F,C]
def bar(t,ch,dens=1.0,vel=.16):
    pat=[0,2,3,4,3,2] if dens>=1 else [0,3,4]
    step=4/len(pat)
    for i,k in enumerate(pat): piano(t+i*step,ch[k],vel*(1.1 if i==0 else .8))
    pad(t,[ch[1],ch[2],ch[3]],.05,4.2)
t=0
# seções aproximadas ao roteiro
sec=[(0,88,prog,0.6),(88,143,[F,C,Dm,Bb],1.0),(143,197,[Bb,F,C,Dm],1.0),(197,241,[Dm,Gm,Bb,A],0.6),(241,258,[Bb,F,C,F],0.6)]
for a,b,pr,d in sec:
    t=a; i=0
    while t<b-0.01:
        bar(t,pr[i%4],d); t+=4; i+=1
# acorde final em Fá maior, longo
piano(258.2,41,.2,8); piano(258.2,53,.15,8); piano(258.2,57,.14,8); piano(258.4,60,.13,8); piano(258.6,65,.13,8); piano(259.0,69,.12,8)
pad(258,[53,57,60],.07,8)
# reverb simples
ir=np.zeros(int(SR*2.2)); 
rng=np.random.default_rng(3); ir=rng.standard_normal(len(ir))*np.exp(-np.arange(len(ir))/SR*3.2)*.02; ir[0]=1
from numpy.fft import rfft,irfft
L=1<<int(np.ceil(np.log2(N+len(ir))))
wet=irfft(rfft(out,L)*rfft(ir,L),L)[:N]
mix=wet; mix[-int(SR*3):]*=np.linspace(1,0,int(SR*3))
mix/=np.max(np.abs(mix))*1.12
st=np.stack([mix,np.roll(mix,int(SR*0.012))],1)
with wave.open('assets/audio/piano.wav','wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes((st*32767).astype(np.int16).tobytes())
print('ok')
