# FAQ & resolução de problemas

### O proofmark deteta se algo foi gerado por IA?

Não — a deteção à posteriori é pouco fiável. O proofmark prova o sentido oposto: *quem
assinou uma afirmação* (criado / editado / `aiGenerated` / revisto) ligada aos bytes exatos. É
atestação, não deteção.

### Isto é C2PA a sério?

Partilha o modelo do C2PA de afirmações assinadas, mas usa **VCs W3C portáteis num sidecar
destacado** em vez de um manifesto embebido no media. Ver [proofmark vs C2PA completo](vs-c2pa.md).

### O `verifyManifest` diz `contentMatches: false`

Os bytes que passaste não fazem hash igual ao `contentHash` do manifesto — o conteúdo mudou
(mesmo um byte), ou verificaste contra um ficheiro diferente. É a prova de adulteração a
funcionar.

### Onde guardo o manifesto?

Onde quiseres: ao lado do ativo (ex.: `foto.jpg.proofmark.json`), numa base de dados, ou num
header. É apenas `{ contentHash, assertions }`.

### Uma assinatura válida significa que a afirmação é verdadeira?

Não. Prova *quem a assinou*. Acreditar na afirmação depende de confiares no DID desse
signatário — mantém uma allow-list de DIDs conhecidos de ferramentas/organizações.

### Funciona com imagens e binários?

Sim — o `stamp`/`verifyManifest` aceitam `Uint8Array`, por isso quaisquer bytes (imagens,
PDFs, ficheiros) funcionam, não só texto.
