#!/bin/bash
# Prepara a "mesa virtual": desktop Ubuntu leve (xfce4) numa tela virtual, para gravar aulas reais.
# Rodar uma vez por sessão (o container é novo a cada sessão): bash ferramentas/curso/mesa/instalar.sh
set -e
export DEBIAN_FRONTEND=noninteractive
command -v xdotool >/dev/null || { apt-get update -qq; apt-get install -y -qq --no-install-recommends \
  xfce4 xfce4-terminal xdotool wmctrl dbus-x11 fonts-ubuntu xfwm4 xfdesktop4 adwaita-icon-theme-full >/dev/null; }

# usuário do "aluno", com sudo sem senha (o prompt fica aluno@ubuntu:~$ como no PC de quem assiste)
id aluno >/dev/null 2>&1 || useradd -m -s /bin/bash aluno
echo 'aluno ALL=(ALL) NOPASSWD:ALL' > /etc/sudoers.d/aluno
# o sudo mantém o proxy e o certificado deste ambiente (os mesmos que o terminal do agente já usa)
echo 'Defaults env_keep += "HTTPS_PROXY https_proxy NO_PROXY no_proxy SSL_CERT_FILE CURL_CA_BUNDLE NODE_EXTRA_CA_CERTS REQUESTS_CA_BUNDLE npm_config_https_proxy npm_config_noproxy"' > /etc/sudoers.d/aluno-env
chmod 440 /etc/sudoers.d/aluno /etc/sudoers.d/aluno-env

H=/home/aluno
install -o aluno -m 644 "${SSL_CERT_FILE:-/root/.ccr/ca-bundle.crt}" $H/.ca-ambiente.crt
cat > $H/.ambiente <<E
export HTTPS_PROXY=$HTTPS_PROXY https_proxy=$HTTPS_PROXY NO_PROXY="$NO_PROXY" no_proxy="$NO_PROXY"
export SSL_CERT_FILE=$H/.ca-ambiente.crt CURL_CA_BUNDLE=$H/.ca-ambiente.crt NODE_EXTRA_CA_CERTS=$H/.ca-ambiente.crt REQUESTS_CA_BUNDLE=$H/.ca-ambiente.crt
export npm_config_https_proxy=$HTTPS_PROXY npm_config_noproxy="$NO_PROXY"
E
grep -q '.ambiente' $H/.bashrc || cat >> $H/.bashrc <<'E'
# terminal "de fábrica": este container traz Node, nvm, Java etc. para todos os usuários; o aluno não tem isso
export PATH=/usr/sbin:/usr/bin:/sbin:/bin:/usr/games:/usr/local/games
unset NVM_DIR NVM_BIN NVM_INC BUN_INSTALL RBENV_ROOT JAVA_HOME MAVEN_HOME GRADLE_HOME
[ -f ~/.ambiente ] && . ~/.ambiente
PS1='\[\e[1;32m\]aluno@ubuntu\[\e[0m\]:\[\e[1;34m\]\w\[\e[0m\]\$ '
# marcador para a mesa saber quando o comando terminou (não aparece na tela)
PROMPT_COMMAND='echo $? > /tmp/mesa_fim'
E

# terminal grande e limpo para vídeo
mkdir -p $H/.config/xfce4/terminal
cat > $H/.config/xfce4/terminal/terminalrc <<'E'
[Configuration]
FontName=Ubuntu Mono 22
MiscMenubarDefault=FALSE
MiscToolbarDefault=FALSE
ScrollingBar=TERMINAL_SCROLLBAR_NONE
MiscCursorBlinks=TRUE
ColorForeground=#E6EDF3
ColorBackground=#1E1E2E
ColorCursor=#A6E3A1
MiscDefaultGeometry=110x30
MiscConfirmClose=FALSE
E
chown -R aluno:aluno $H
echo "mesa instalada"
