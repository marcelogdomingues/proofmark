# Como funciona

## Ligação ao conteúdo

O `hashContent(bytes)` produz `"sha256:<hex>"`. Cada afirmação embebe este hash, e o
`verifyManifest` recalcula-o a partir dos bytes que apresentas. Se diferirem, o
conteúdo mudou e a verificação falha — é isto que torna a proveniência *à prova de
adulteração*.

## Afirmações como Verifiable Credentials

Cada afirmação é uma VC W3C assinada pelo `did:key` do ator:

```jsonc
{
  "type": ["VerifiableCredential", "ContentProvenance"],
  "issuer": "did:key:<signatário>",
  "credentialSubject": {
    "id": "urn:content:sha256:…",
    "contentHash": "sha256:…",
    "action": "aiGenerated",
    "tool": "claude-fable-5",
    "createdAt": "2026-08-02T10:00:00.000Z"
  }
}
```

As assinaturas são EdDSA (Ed25519); a verificação usa o `key-did-resolver` — tudo
offline.

## O manifesto

Um `ProvenanceManifest` é apenas `{ contentHash, assertions: string[] }` em que cada
string é uma VC JWT assinada. É um **sidecar destacado**: guarda-o ao lado do ativo
(ex.: `foto.jpg.proofmark.json`), numa base de dados, ou num header.

## Resultado da verificação

O `verifyManifest` devolve:

- `contentMatches` — os bytes correspondem ao hash do manifesto?
- `assertions[]` — para cada uma: `issuer`, `action`, `tool`, `valid` (assinatura ok),
  `boundToContent` (o `contentHash` corresponde ao do manifesto).
- `valid` — true só se o conteúdo corresponder **e** todas as afirmações forem válidas
  e ligadas.

## Modelo de confiança

O proofmark prova *quem assinou o quê*. Acreditar numa afirmação depende de confiares
nesse DID de signatário. Na prática mantém-se uma allow-list de DIDs conhecidos de
ferramentas e organizações, ou publicam-se via `did:web`.
