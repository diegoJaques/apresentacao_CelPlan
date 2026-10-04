# Compõe foto de arquivo em quadro 2112x1188: fundo desfocado escuro + foto com borda creme e sombra, tom sépia leve.
import sys
from PIL import Image, ImageFilter, ImageOps, ImageEnhance
W,H=2112,1188
def sepia(im,amt=.35):
    g=ImageOps.grayscale(im).convert('RGB')
    s=ImageOps.colorize(ImageOps.grayscale(im),(30,22,14),(242,228,200)).convert('RGB')
    return Image.blend(g,s,amt)
def make(src,dst,full=False,crop=None):
    im=Image.open(src).convert('RGB')
    if crop: im=im.crop(crop)
    im=sepia(im)
    if full:
        r=max(W/im.width,H/im.height); im=im.resize((int(im.width*r)+1,int(im.height*r)+1),Image.LANCZOS)
        x=(im.width-W)//2; y=(im.height-H)//2; im.crop((x,y,x+W,y+H)).save(dst,quality=90); return
    bg=im.copy(); r=max(W/bg.width,H/bg.height); bg=bg.resize((int(bg.width*r)+1,int(bg.height*r)+1)).crop((0,0,W,H))
    bg=ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(40))).enhance(.35)
    mw,mh=int(W*.86),int(H*.86); r=min(mw/im.width,mh/im.height); ph=im.resize((int(im.width*r),int(im.height*r)),Image.LANCZOS)
    b=14; card=Image.new('RGB',(ph.width+2*b,ph.height+2*b),(236,226,204)); card.paste(ph,(b,b))
    sh=Image.new('RGBA',(card.width+60,card.height+60),(0,0,0,0)); 
    shadow=Image.new('RGBA',(card.width,card.height),(0,0,0,170)); sh.paste(shadow,(30,40)); sh=sh.filter(ImageFilter.GaussianBlur(18))
    x=(W-card.width)//2; y=(H-card.height)//2
    bg.paste(sh,(x-30,y-30),sh); bg.paste(card,(x,y)); bg.save(dst,quality=90)
if __name__=='__main__':
    make(sys.argv[1],sys.argv[2],full=len(sys.argv)>3 and sys.argv[3]=='full')
