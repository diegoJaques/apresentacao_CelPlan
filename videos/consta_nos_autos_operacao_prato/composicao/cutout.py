import sys, numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage as nd
def cut(src, dst):
    im=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
    mx=im.max(2); mn=im.min(2); sat=(mx-mn)
    bg=(mx>150)&(sat<28)
    lab,n=nd.label(bg)
    border=set(np.unique(np.concatenate([lab[0],lab[-1],lab[:,0],lab[:,-1]])))-{0}
    bgc=np.isin(lab,list(border))
    fg=~bgc
    fg=nd.binary_fill_holes(nd.binary_opening(fg,iterations=2))
    # keep largest fg component
    l2,n2=nd.label(fg); 
    if n2>1:
        sz=nd.sum(fg,l2,range(1,n2+1)); fg=l2==(np.argmax(sz)+1)
    a=Image.fromarray((fg*255).astype(np.uint8)).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1.6))
    # despill: darken light fringe
    rgba=Image.open(src).convert('RGB'); rgba.putalpha(a); rgba.save(dst)
if __name__=='__main__': cut(sys.argv[1],sys.argv[2])
