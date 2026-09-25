# ROTEIRO DE VISTORIA TÉCNICA — CPFL TRANSMISSÃO / SOLUÇÃO RFID

**Objeto:** PB CPFL Transmissão — Logística/Suprimentos — Aquisição de impressoras RFID, coletores RFID, portais RFID, etiquetas UHF e software de gestão.
**Rev. do PB:** 25/08/2026 | **Prazo de implantação:** 45 dias corridos | **Vigência:** 90 dias | **Pagamento:** 60 dias após NF
**Julgamento:** menor preço global **por lote** (Lote 1 = hardware/etiquetas; Lote 2 = software)

## Locais da vistoria

| Site | Endereço | Escopo local |
|---|---|---|
| Depósito Central de Pirapó | Rua Pirapó, 1221 — Igara — **Canoas/RS** — CEP 92410-240 | 1 portal RFID + etiquetagem + impressoras/coletores + treinamento |
| Depósito de Passo Fundo | Rua Pedro Luizeto, 201 — Santa Marta — **Passo Fundo/RS** — CEP 99036-020 | 1 portal RFID + etiquetagem + treinamento |

Horário dos dois: seg–sex, 08h00–12h00 e 13h00–17h00.
Contatos: **Eisler Brum Pedroso** (51) 98400-2718 — eisler.pedroso@cpfl.com.br | **Gessé Samuel Corrêa Lima** (51) 98400-4673 — gesse.lima@cpfl.com.br
Agendamento: **mínimo 3 dias úteis de antecedência** (exigência do PB, item 10).

## Quantidades contratadas (referência para dimensionar tudo na visita)

| Item | Código | Descrição | Qtde |
|---|---|---|---|
| 1 | 39380006 | Impressora industrial RFID | 3 |
| 2 | 66930005 | Coletor de dados RFID | 3 |
| 3 | 80006297 | Portal RFID (mín. 4 antenas cada) | 2 |
| 4 | 80006299 | Etiqueta RFID UHF 80x80 BOPP | 35.000 un |
| 5 | 563120004 | Software (Lote 2) | 1 |

> **Atenção de dimensionamento:** são 2 sites e apenas 3 impressoras e 3 coletores. Confirmar na visita a divisão física (ex.: 2+1 ou 3+0) — isso muda o plano de instalação, o treinamento e o deslocamento da equipe.

---

# 0. ANTES DE SAIR (preparação)

- [ ] Agendar formalmente por e-mail com Eisler e Gessé (≥3 dias úteis), pedindo **acompanhante de Logística/Suprimentos + alguém de TI/Infra + alguém de SMS** na visita.
- [ ] Perguntar **antecipadamente** os requisitos de acesso: integração de segurança, ASO, NR-10/NR-11/NR-35, ficha de EPI, lista de veículos/placas, RG/CPF dos visitantes.
- [ ] Confirmar se pode **fotografar** e se precisa de autorização prévia para câmera/celular na área.
- [ ] Levar: EPI completo (capacete c/ jugular, botina, óculos, luva, colete refletivo, protetor auricular), crachá/identificação, cópia do PB impresso.
- [ ] **Kit de teste RFID** (decisivo — ver Bloco D): leitor portátil UHF, antena, notebook, amostras de tags (BOPP comum, tag on-metal rígida, tag on-metal flexível, tag para cabo/carretel), fita dupla-face e abraçadeiras.
- [ ] Instrumentos: trena a laser + trena de 5 m, bússola/app, medidor de Wi-Fi (analisador de espectro / app de site survey), multímetro, câmera com data/hora ligada.
- [ ] Planilha/ficha de campo impressa (Anexo A deste roteiro) e bateria extra/power bank.

---

# BLOCO A — PERGUNTAS

> Marcar em cada pergunta: **[V]** = resolver na vistoria com o operacional · **[E]** = levar para pedido formal de esclarecimento ao comprador (impacta preço/risco e precisa de resposta escrita).

## A1. Operação e processo atual

1. [V] Qual o **volume médio mensal** de recebimentos, expedições e transferências em cada depósito (notas/dia, itens/dia, paletes/dia)?
2. [V] Quantos **SKUs ativos** e quantos **itens físicos em estoque** existem hoje em cada depósito? (base para validar as 35.000 etiquetas)
3. [V] Como o material é controlado hoje — SAP puro, planilha, etiqueta de papel, plaqueta metálica, código de barras? Ver e fotografar a etiqueta/plaqueta atual.
4. [V] Existe **endereçamento** físico implantado (rua/prédio/nível/apartamento)? Está placado? É o mesmo do SAP?
5. [V] Qual a **periodicidade e a duração** do inventário hoje? Quantas pessoas envolvidas? Qual a acuracidade atual?
6. [V] Quem executa o recebimento/expedição: quantos operadores, quantos turnos, há trabalho noturno ou fim de semana?
7. [V] O material sai e retorna de obra/subestação (movimento de ida e volta)? Há material de terceiros/empreiteira no pátio?
8. [E] O escopo de **etiquetagem do estoque legado** (aplicar tag no que já está no pátio) é da CONTRATADA ou da CPFL? O PB fala em "mapear o processo de etiquetagem" e "carga inicial de dados", mas não em aplicar 35.000 etiquetas. **Isso muda o preço radicalmente.**
9. [E] Se for da CONTRATADA: qual a quantidade de itens a etiquetar, em que prazo e com que apoio (empilhadeira, operador, movimentação de material)?

## A2. Materiais e tipo de etiqueta — **ponto técnico mais crítico**

10. [V] Quais as **famílias de material** armazenadas? (estrutura metálica de torre, cabo condutor/OPGW em carretel, ferragens, isoladores, para-raios, transformadores, chaves, ferramental, EPI, consumíveis)
11. [V] Que percentual do estoque é **metálico** e que percentual fica **exposto ao tempo** (pátio descoberto)?
12. [V] Em que **superfície** a etiqueta será colada em cada família? (aço galvanizado, porcelana, polímero, madeira do carretel, caixa de papelão, plástico)
13. [V] Qual a **unidade de etiquetagem**: peça, amarrado/feixe, palete, caixa, carretel, container? (define a quantidade real de tags)
14. [E] **A etiqueta especificada é BOPP 80x80 com impressão térmica.** Etiqueta BOPP: (a) **não funciona colada em metal** sem tag on-metal/espaçador e (b) **não resiste a UV/chuva** no pátio. Confirmar se a CPFL aceita/exige o fornecimento de **tags on-metal e tags outdoor** para os itens metálicos e externos, e como isso é precificado (item adicional? substituição parcial do item 4?).
15. [E] Há exigência de **impressão de dado humano-legível** na etiqueta (código SAP, descrição, nº de série, QR/código de barras de contingência)? Qual layout?
16. [V] Qual o **padrão de numeração EPC** desejado (SGTIN, SSCC, numeração própria)? Há relação com o código SAP do material e com nº de série?
17. [V] Material com **nº de série / patrimônio / rastreabilidade individual** existe? Quais?
18. [V] Há material **perigoso, inflamável ou com restrição de área classificada** que impeça instalação elétrica no local?

## A3. Portais RFID (2 unidades — 1 por site)

19. [V] **Onde exatamente** a CPFL quer o portal? Validar fisicamente: portão do pátio, porta do galpão, doca, ou passagem interna. Definir e fotografar o ponto com marcação.
20. [V] **Vão livre** do local (largura × altura) e o que passa por ali: pedestre, empilhadeira, caminhão munck, carreta com carga longa (perfil de torre)? Medir.
21. [V] Qual a **velocidade** de passagem e a distância de recuo disponível antes/depois do portal (zona de leitura)?
22. [V] O piso é **concreto, asfalto, paver ou terra**? Aceita chumbamento/base? Há interferência de canaleta, drenagem ou dutos enterrados?
23. [E] **Obra civil** (base de concreto, fixação de pórtico, adequação de piso, sinalização horizontal) está no escopo da CONTRATADA? O PB não menciona.
24. [V] O portal fica **abrigado ou exposto ao tempo**? (define grau IP do leitor, da caixa e do cabeamento) Há cobertura possível?
25. [V] Há **estrutura metálica, portão de aço, empilhadeira, motor ou linha de transmissão energizada** próximo ao local do portal? (reflexão e EMI em UHF — medir e fotografar o entorno)
26. [V] Há **semáforo/cancela/sensor** existente a integrar? Há necessidade de sinalização luminosa/sonora de leitura OK/divergência?
27. [V] Como o portal deve **decidir direção** (entrada x saída) e o que deve acontecer em caso de divergência (alarme, bloqueio, só registro)?
28. [V] Há **CFTV** no local e a CPFL quer correlacionar a passagem com imagem?
29. [E] Em Passo Fundo o Anexo II mostra galpão de alvenaria com portas convencionais — confirmar se o portal é para **porta de pedestre/empilhadeira** ou para **acesso de veículos**; o tipo de pórtico e o número de antenas mudam.

## A4. Infraestrutura elétrica

30. [V] Existe ponto de energia a menos de quantos metros do local do portal? **Medir a distância** até o quadro mais próximo.
31. [V] **Tensão disponível**: 127 V, 220 V mono ou trifásico? Há disjuntor reserva no quadro? Fotografar o quadro e o espaço livre.
32. [E] O PB diz que a CPFL "disponibiliza infraestrutura elétrica e de rede necessária". Confirmar **o ponto de entrega exato**: tomada energizada no local do portal e ponto de rede no local do portal, ou apenas quadro/rack existente? Quem puxa o eletroduto/infra do quadro até o portal?
33. [V] Há **no-break/UPS** para os equipamentos? A CPFL fornece ou a CONTRATADA? Autonomia exigida?
34. [V] Existe **aterramento e SPDA** disponível no ponto? Qual o valor de malha? (pátio de material de transmissão → risco de tensão induzida e surto)
35. [V] Há histórico de **queda de energia**? Existe gerador?
36. [V] Onde ficarão as **3 impressoras**? Verificar mesa/bancada, tomada, rede, ambiente (poeira/umidade) e espaço para bobinas e ribbon. Fotografar.
37. [V] Onde serão **carregados os coletores** (berço/dock) e onde ficam guardados?

## A5. Rede, TI e segurança da informação

38. [V] Existe **Wi-Fi** nos galpões e no pátio? Fazer medição de sinal nos pontos de operação (ver Bloco D). Qual o padrão (a/b/g/n/ac/ax), 2,4 e/ou 5 GHz?
39. [E] Se a cobertura Wi-Fi for insuficiente no pátio, a **ampliação da rede sem fio** é responsabilidade da CPFL? (o PB diz que sim, mas convém formalizar — é um custo relevante)
40. [V] Como o coletor entra na rede: SSID corporativo, 802.1X/certificado, PSK, portal cativo, registro de MAC? Qual o processo e o prazo para liberar 3 dispositivos Android?
41. [V] Os coletores terão **chip/celular (4G)** como alternativa? A CPFL fornece a linha? Qual a operadora com cobertura no local?
42. [V] O portal RFID será conectado em **rede corporativa, VLAN segregada ou rede OT**? Existe ponto de rede ativo disponível? Fotografar o rack.
43. [E] Onde o **software** vai rodar: datacenter CPFL (on-premise/VM), nuvem da CONTRATADA (SaaS) ou nuvem CPFL? Se for on-premise, qual o **padrão de VM** (SO, vCPU, RAM, disco, banco de dados homologado, backup)?
44. [E] Se for SaaS: a CPFL aceita dado em nuvem? Há exigência de datacenter no Brasil, cláusula de LGPD, plano de saída/exportação de dados ao fim do contrato?
45. [E] Qual o **processo de homologação de segurança da informação / cibersegurança** da CPFL (análise de vulnerabilidade, pentest, questionário de fornecedor, aprovação de software de terceiro)? **Qual o prazo típico?** — isso é o principal risco contra o prazo de 45 dias.
46. [V] Regras de firewall/proxy necessárias (portas, URLs, saída para internet do leitor e do coletor)?
47. [V] Quem administra os **usuários** — haverá integração com AD/LDAP/SSO (Entra ID)? Quantos usuários e quais perfis?
48. [V] Há política que impeça instalar **aplicativo de terceiro** no Android do coletor (MDM corporativo, Intune, Workspace ONE)? Quem gerencia o MDM?

## A6. Software, dados e integração SAP

49. [V] Qual **SAP** está em uso (ECC ou S/4HANA) e qual módulo (MM, WM, EWM)? Qual release?
50. [E] O PB diz "permitir integração **futura** com SAP". Confirmar: **a integração está fora do escopo deste contrato?** Se estiver dentro, definir escopo, transações/BAPIs, ambiente de teste e quem desenvolve o lado SAP.
51. [V] Como será a **carga inicial**: a CPFL entrega cadastro de materiais e saldos em qual formato (CSV/XLSX/XML/TXT)? Quem extrai? Em que prazo?
52. [V] Quantos **materiais, depósitos, endereços, fornecedores e transportadoras** serão carregados?
53. [V] Quais **documentos operacionais** serão usados na conferência (NF-e, pedido, reserva, ordem de transporte, requisição)? Como chegam ao sistema — digitados, importados ou via SAP?
54. [V] Quais **relatórios e indicadores** são obrigatórios no painel gerencial? Pedir modelo de relatório atual.
55. [V] A CPFL exige o software em **português**, com manual em português e trilha de auditoria (log de quem fez o quê)?
56. [V] Há exigência de **retenção de dados** e de backup com que periodicidade e responsabilidade de quem?
57. [E] Há **demonstração prática / PoC** prevista (item 5 do PB)? Quando, onde, com qual roteiro e com qual material de teste? Será eliminatória?

## A7. Acesso, SMS e condições de trabalho

58. [V] Qual a **integração de segurança** obrigatória (duração, local, periodicidade, presencial ou online)? Vale para os dois sites?
59. [V] Quais **documentos** são exigidos da equipe: ASO, NR-10, NR-11 (empilhadeira), NR-12, NR-35, NR-33?, ficha de EPI, PGR/PCMSO, certificado de treinamento, ART?
60. [V] Haverá **trabalho em altura** (NR-35) na instalação do pórtico? Acima de 2 m? Precisa de plataforma elevatória/andaime — quem fornece?
61. [V] Há necessidade de **empilhadeira/munck/plataforma** para a instalação? A CPFL empresta com operador ou a CONTRATADA mobiliza?
62. [V] Existe **permissão de trabalho (PT)** diária? Quanto tempo consome por dia? Há bloqueio/etiquetagem (LOTO) elétrico?
63. [V] Há restrição de **horário** para trabalho que pare a operação (parada de doca, corte de energia)?
64. [V] Existe **sistema de gestão de terceiros** (portal do fornecedor, GRS, ex.: SOC/Nexo) para envio de documentos? Qual o prazo médio de liberação?
65. [V] Há **almoxarifado/sala** disponível para guarda de material e ferramenta da equipe durante a obra? Vestiário, refeitório, banheiro?
66. [V] Acesso de **veículo próprio** ao pátio é permitido? Precisa de cadastro de placa?

## A8. Treinamento e homologação

67. [V] **Quantos usuários** treinar por site e de quais áreas? Quantas turmas e em quais horários (turno)?
68. [V] Existe **sala com projetor e rede** para o treinamento? Fotografar.
69. [V] O treinamento é só operacional ou também **administrador/TI** (configuração, layout de etiqueta, permissões)?
70. [E] Qual é o **roteiro/critério de aceite** dos "testes de homologação"? Quem assina o termo de recebimento e em quanto tempo? (impacta o faturamento)
71. [V] Haverá **operação assistida** após o go-live? Por quantos dias? Está incluída nos 45 dias ou é adicional?

## A9. Comercial, contratual e logística

72. [E] Os **45 dias corridos** contam da OC até o go-live? Equipamento RFID industrial tem lead time de importação frequentemente superior a isso — a CPFL aceita cronograma com marco de entrega e implantação, ou penaliza atraso de fornecedor de fábrica?
73. [E] A **vigência de 90 dias** é compatível com a **garantia de 12 meses** e com o suporte? Como fica o suporte após o encerramento contratual?
74. [E] O julgamento é **por lote**: é permitido participar de apenas um lote? Há exigência de que o mesmo fornecedor leve os dois?
75. [E] Há **exigência de SLA** de atendimento (prazo de resposta e de solução, remoto e presencial) e de equipamento reserva (backup) durante a garantia?
76. [E] Qual a **quantidade e o local de entrega** de cada item (tudo em Canoas ou dividido entre os dois depósitos)?
77. [E] Há **retenção de pagamento, garantia contratual (seguro), multa ou nível de serviço** definidos? Pagamento em 60 dias exige capital de giro — confirmar se é 60 dias corridos da emissão da NF.
78. [E] **Quem paga deslocamento/hospedagem** entre Canoas e Passo Fundo (≈290 km)? Está embutido no preço — quantas viagens serão necessárias?
79. [V] Há preferência/restrição de **marca** de leitor (Zebra, Impinj, Honeywell) por padrão corporativo CPFL já existente?
80. [V] A CPFL já tem **contrato de RFID/etiquetas** em outra unidade do grupo (CPFL Paulista/Piratininga)? Qual solução? (evita reinventar e ajuda no discurso comercial)

---

# BLOCO B — LEVANTAMENTOS E MEDIÇÕES (preencher em campo, por site)

## B1. Local do portal
- [ ] Coordenada GPS do ponto: ____________________
- [ ] Largura do vão: ______ m | Altura livre: ______ m | Profundidade útil antes/depois: ______ m
- [ ] Tipo de piso: ______________ | Espessura/condição: ______________
- [ ] Coberto? ( ) Sim ( ) Não — se não, insolação/chuva direta
- [ ] Distância até quadro elétrico: ______ m | Tensão: ______ V | Disjuntor livre? ( )
- [ ] Distância até ponto de rede/rack: ______ m | Tipo de ponto: __________
- [ ] Obstáculos metálicos em até 5 m: ______________________________________
- [ ] Tráfego típico pelo vão: ( ) pedestre ( ) empilhadeira ( ) caminhão ( ) carreta longa
- [ ] Caminho de infra possível (eletrocalha/eletroduto/aéreo/enterrado): ________________

## B2. Elétrica e rede
- [ ] Foto e identificação do quadro que alimentará o portal e as impressoras
- [ ] Existência de no-break: ( ) Sim, modelo ______ ( ) Não
- [ ] Aterramento disponível no ponto: ( ) Sim ( ) Não — valor de malha, se informado: ______
- [ ] Medição de Wi-Fi (RSSI/SNR) nos pontos: recebimento ___ dBm | expedição ___ dBm | corredor central ___ dBm | fundo do galpão ___ dBm | pátio externo ___ dBm
- [ ] SSID(s) disponíveis e método de autenticação: ____________________
- [ ] Rack: quantidade de U livres ______ | switch com porta livre? ( ) | PoE disponível? ( )

## B3. Layout e estoque
- [ ] Dimensões aproximadas de cada galpão (C × L × pé-direito): ______________
- [ ] Quantidade de galpões/áreas e área total de pátio descoberto: ______________
- [ ] Tipo de armazenagem: ( ) porta-palete ( ) cantilever ( ) prateleira leve ( ) blocado no chão ( ) pátio a céu aberto
- [ ] Quantidade de ruas/posições endereçadas: ______
- [ ] Altura máxima de estocagem: ______ m
- [ ] Iluminação e condição do piso para circulação de coletor

## B4. Materiais (preencher 1 linha por família encontrada)

| # | Família de material | Superfície | Fica exposto? | Unidade de etiquetagem | Tag proposta | Leitura OK? |
|---|---|---|---|---|---|---|
| 1 | | | | | | |
| 2 | | | | | | |
| 3 | | | | | | |
| 4 | | | | | | |
| 5 | | | | | | |

---

# BLOCO C — FOTOS OBRIGATÓRIAS

> Padrão de nome: `SITE_BLOCO_NN_descricao.jpg` (ex.: `CANOAS_PORTAL_03_vao-portao-principal.jpg`).
> Sempre incluir **referência de escala** na foto (trena aberta, pessoa ou caixa) e fotografar o **conjunto + o detalhe**.

## C1. Acessos e entorno (6–8 fotos por site)
1. Fachada/portaria e identificação do depósito
2. Portão de acesso de veículos, com trena mostrando a largura
3. Via de acesso interna (pavimento, raio de curva para carreta)
4. Vista geral do pátio (panorâmica, 2 a 3 ângulos)
5. Vista geral de cada galpão, externa
6. Pontos de descarga/doca

## C2. Local candidato de cada portal (10–12 fotos — **as mais importantes**)
7. Vão do portal, frontal, com trena na largura
8. Vão do portal, com trena na altura livre
9. Vista de quem entra (10 m antes) e vista de quem sai (10 m depois)
10. Piso no local exato (close), mostrando tipo e condição
11. Teto/estrutura superior no ponto (onde fixaria a travessa)
12. Lateral esquerda e lateral direita (onde ficariam os montantes)
13. Entorno metálico: portão de aço, colunas, telha, empilhadeira estacionada
14. Passagem real acontecendo (empilhadeira ou veículo cruzando o vão)
15. Tomada/quadro mais próximo, com a distância anotada
16. Ponto de rede mais próximo
17. Caminho de infraestrutura proposto (eletrocalha, parede, poste)

## C3. Elétrica e TI (6–8 fotos por site)
18. Quadro elétrico aberto (com autorização), mostrando disjuntores e espaço reserva
19. Etiqueta/identificação do quadro e tensão
20. No-break existente (placa de identificação)
21. Rack de rede aberto: switch, patch panel, portas livres
22. Access points Wi-Fi existentes (posição e modelo)
23. Aterramento/barra de equipotencialização visível

## C4. Armazenagem e materiais (12–15 fotos por site)
24. Corredor principal do galpão (panorâmica)
25. Porta-palete/cantilever, com altura de referência
26. Placa de endereçamento existente (close legível)
27. **Cada família de material**, em close: estrutura metálica de torre, cabo/carretel, isolador, ferragem, transformador/equipamento, caixa de pequenos itens, ferramental
28. Material armazenado **no pátio descoberto** (mostrando exposição ao tempo/ferrugem)
29. Amarrados/feixes de perfil metálico (para decidir a unidade de etiquetagem)
30. Etiqueta/plaqueta/identificação atual do material (close legível) — frente e verso
31. Material com número de série ou patrimônio
32. Área de recebimento e mesa de conferência
33. Área de expedição

## C5. Área operacional e de trabalho (5–6 fotos por site)
34. Mesa/bancada onde ficaria a impressora RFID (com tomada e rede no quadro)
35. Computadores/terminais existentes na operação
36. Local de guarda e carga dos coletores
37. Sala disponível para treinamento
38. Empilhadeira/munck disponível (placa de identificação e capacidade)
39. Quadro de avisos / procedimento de SMS afixado (para entender exigências locais)

## C6. Documentação de risco (3–5 fotos)
40. Linhas de transmissão ou subestação próximas ao local do portal
41. Área classificada/inflamáveis, se houver
42. Ponto de alagamento/drenagem no piso do portal
43. Qualquer condição que impeça o previsto no PB (registrar para o pedido de esclarecimento)

> **Meta por site: 45 a 60 fotos.** Melhor sobrar do que voltar.

---

# BLOCO D — TESTES DE CAMPO A EXECUTAR (leve o kit)

Estes testes valem mais que qualquer pergunta — eles é que definem se a solução do PB funciona.

- [ ] **D1 — Leitura em metal:** colar tag BOPP comum direto em perfil de torre galvanizado e tentar ler. Registrar distância de leitura (provavelmente ~0). Repetir com tag **on-metal**. Fotografar e anotar: BOPP ____ m | on-metal ____ m.
- [ ] **D2 — Leitura em carretel de cabo:** tag em madeira/flange metálica. Distância: ____ m.
- [ ] **D3 — Leitura em caixa/papelão e em isolador (porcelana/polímero):** distância: ____ m.
- [ ] **D4 — Leitura de feixe/amarrado:** colocar 10 tags juntas em um amarrado e verificar quantas são lidas em uma passada. Lidas: ____ /10.
- [ ] **D5 — Zona de leitura no local do portal:** com leitor e antena posicionados como ficaria o portal, verificar leitura no centro do vão, nas bordas e além do vão (**leitura indevida / stray read** de material parado ao lado). Anotar até onde lê fora do vão: ____ m.
- [ ] **D6 — Ruído de RF:** medir o espectro em 902–907,5 / 915–928 MHz no ponto do portal, buscando interferência. Registrar.
- [ ] **D7 — Cobertura Wi-Fi:** medir RSSI nos pontos do B2 caminhando com o coletor/celular e anotar onde cai a conexão.
- [ ] **D8 — Teste de impressão/codificação:** se possível, imprimir e codificar uma etiqueta no layout pretendido e mostrar ao cliente (ótimo efeito comercial).
- [ ] **D9 — Cronometrar** uma conferência de recebimento real do jeito atual, para comparar com o ganho RFID na proposta.

---

# BLOCO E — PONTOS DO PB QUE JÁ NASCEM COMO RISCO (levar como esclarecimento formal)

| # | Ponto do PB | Risco | Encaminhamento |
|---|---|---|---|
| E1 | Etiqueta **BOPP 80x80** como item único (35.000 un) | Não funciona sobre metal e não resiste a intempérie; a maior parte do estoque de transmissão é metálica e fica no pátio | Propor mix de etiquetas (BOPP + on-metal + outdoor) e pedir aceitação formal |
| E2 | Escopo de **aplicação** das 35.000 etiquetas não está definido | Pode ser mão de obra de semanas não precificada | Perguntar se é fornecimento apenas ou fornecimento + aplicação |
| E3 | **45 dias corridos** para implantação completa | Lead time de importação de leitor/portal + homologação de segurança da CPFL costuma estourar o prazo | Pedir cronograma por marcos ou prazo contado da entrega |
| E4 | **Vigência de 90 dias** x **garantia de 12 meses** | Incoerência contratual: garantia sobrevive ao contrato? | Pedir esclarecimento |
| E5 | "Integração **futura** com SAP" | Ambiguidade: se virar escopo, muda o preço em ordem de grandeza | Confirmar por escrito que está fora do escopo |
| E6 | CPFL fornece "infraestrutura elétrica e de rede" | Sem definição do ponto de entrega, a CONTRATADA pode herdar a infra até o portal | Definir ponto de entrega por escrito |
| E7 | **Obra civil** do portal não citada | Base, chumbamento e adequação de piso podem cair no colo da CONTRATADA | Perguntar responsabilidade |
| E8 | Portal exposto ao tempo (provável) | Exige IP e proteção não especificados | Definir na vistoria e registrar em ata |
| E9 | Software sem definição de **hospedagem** | On-premise x SaaS muda custo, prazo e homologação | Definir por escrito |
| E10 | **2 sites a 290 km** com 3 impressoras e 3 coletores | Divisão dos equipamentos e nº de viagens afeta custo de implantação e treinamento | Definir a distribuição por site |
| E11 | Sem **SLA** de suporte definido | Exposição em garantia | Propor SLA e pedir confirmação |
| E12 | Possível **demonstração prática** (item 5) | Custo e prazo de PoC não previstos | Perguntar formato, prazo e se é eliminatória |

---

# ANEXO A — FICHA DE CAMPO (1 por site)

**Site:** ( ) Canoas — Pirapó  ( ) Passo Fundo
**Data:** ____/____/______  **Hora início:** ______  **Hora fim:** ______
**Equipe CelPlan:** ______________________________________________
**Participantes CPFL (nome / área / e-mail / telefone):**
1. ______________________________________________
2. ______________________________________________
3. ______________________________________________

**Ponto definido para o portal (descrição + coordenada):**
________________________________________________________________

**Decisões tomadas na visita:**
________________________________________________________________
________________________________________________________________

**Pendências deixadas com a CPFL (com responsável e prazo):**
| # | Pendência | Responsável | Prazo |
|---|---|---|---|
| 1 | | | |
| 2 | | | |
| 3 | | | |

**Fotos tiradas:** ______ | **Testes RFID executados:** D1 ( ) D2 ( ) D3 ( ) D4 ( ) D5 ( ) D6 ( ) D7 ( ) D8 ( ) D9 ( )

**Assinaturas (ata de visita técnica):**
CelPlan: _______________________  CPFL: _______________________

---

# CHECKLIST DE SAÍDA — não ir embora sem:

- [ ] Ponto do portal **definido e fotografado com trena** nos dois sites
- [ ] Resposta sobre **quem aplica as 35.000 etiquetas**
- [ ] Teste D1 (leitura em metal) executado e registrado
- [ ] Ponto de energia e de rede **confirmados com distância medida**
- [ ] Prazo do processo de **homologação de segurança da informação** da CPFL
- [ ] Definição de **on-premise x nuvem** para o software
- [ ] Lista de **documentos e prazo de integração de segurança** para mobilizar a equipe
- [ ] **Ata de visita assinada** pelo representante da CPFL (vale como prova de visita e como registro das premissas)
- [ ] Contatos de **TI/Infra** e de **SMS** da CPFL, além do contato de Suprimentos
