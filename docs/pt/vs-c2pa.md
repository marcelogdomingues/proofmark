# proofmark vs C2PA completo

O [C2PA](https://c2pa.org) (Content Credentials) é a norma da indústria para
proveniência de conteúdo, apoiada pela Adobe, Microsoft, BBC e outros. O proofmark
partilha a ideia central — **afirmações assinadas sobre conteúdo** — mas faz
compromissos diferentes.

| | proofmark | C2PA completo |
| --- | --- | --- |
| Assinatura das afirmações | VCs W3C (EdDSA JWT) | COSE / certificados X.509 |
| Armazenamento | Sidecar destacado (ligado por hash) | Manifesto embebido (JUMBF) dentro do ficheiro |
| Raiz de confiança | DIDs que aceitas (`did:key`, `did:web`) | PKI X.509 / trust lists |
| Tratamento de media | Quaisquer bytes; sem parsing de formato | Consciente do formato (JPEG, PNG, MP4, …) |
| Footprint | Minúsculo, offline, sem PKI | Mais pesado; infraestrutura de certificados |
| Ideal para | Pipelines, APIs, texto/dados, aprender | Câmaras, editores, publicadores à escala |

## Quando usar o proofmark

- Controlas as duas pontas (o teu pipeline assina, o teu serviço verifica).
- Queres proveniência para **texto, JSON, outputs de modelos**, ou ficheiros onde
  embeber um manifesto C2PA não é prático.
- Já usas DIDs/VCs (ex.: ao lado do
  [agent-passport](https://github.com/marcelogdomingues/agent-passport)).

## Quando usar o C2PA

- Precisas de interoperabilidade com o ecossistema amplo de Content Credentials e
  visualizadores.
- Tens de embeber a proveniência *dentro* de media que passa por ferramentas de
  terceiros.

## Podem coexistir?

Sim. Um padrão comum: usar o proofmark internamente para proveniência rápida, offline
e baseada em DIDs ao longo do pipeline, e exportar um manifesto C2PA na fronteira onde
o conteúdo é publicado para o público.
