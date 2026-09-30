# LogSentinel Memory Guard

[![CI Status](https://github.com/FelipeMadson/logsentinel-memory-guard/actions/workflows/ci.yml/badge.svg)](https://github.com/FelipeMadson/logsentinel-memory-guard/actions)
[![Latest Release](https://img.shields.io/github/v/release/FelipeMadson/logsentinel-memory-guard?color=145e4d&logo=github)](https://github.com/FelipeMadson/logsentinel-memory-guard/releases)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-GitHub%20Pages-145e4d?logo=github)](https://felipemadson.github.io/logsentinel-memory-guard/)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-yellow.svg)](https://conventionalcommits.org)
[![SemVer 2.0.0](https://img.shields.io/badge/semver-2.0.0-blue.svg)](https://semver.org)
[![ADRs](https://img.shields.io/badge/ADRs-5%20Decisions%20Documented-blue)](docs/adr)
[![C4 Architecture](https://img.shields.io/badge/Architecture-C4%20Model-indigo)](docs/architecture/c4-model.md)
[![Mutation Score](https://img.shields.io/badge/Mutation%20Score-100%25%20Staff%20Grade-success)](tests/fuzz.test.ts)
[![Security: CodeQL](https://img.shields.io/badge/Security-CodeQL%20Passed-success)](.github/workflows/codeql.yml)
[![API Collections](https://img.shields.io/badge/API-Postman%20%7C%20Insomnia-orange)](docs/api)
[![Node.js Version](https://img.shields.io/badge/Node.js-22%20%7C%2024%20LTS-brightgreen.svg)](https://nodejs.org)
[![Test Suite](https://img.shields.io/badge/Tests-100%25%20Passing%20(18%20tests%20node%3Atest)-success.svg)](tests)
[![Security](https://img.shields.io/badge/Security-TimingSafeEqual%20%7C%20Zero--Leak-success.svg)](src/security)
[![Zero Runtime Dependencies](https://img.shields.io/badge/dependencies-0%20runtime-brightgreen.svg)](package.json)
[![License](https://img.shields.io/badge/License-MIT-lightgrey.svg)](LICENSE)

> **Vazamento silencioso de memória em serviços Node.js devido a listeners de stream acumulados.**

---

## 📐 Arquitetura do Sistema & Fluxo de Dados

<p align="center">
  <img src="docs/assets/architecture.svg" alt="Arquitetura & Fluxo de Dados - Logsentinel Memory Guard" width="920" />
</p>

---

## 🎮 Live Interactive Playground (No Backend Required)

Experimente o simulador em tempo real executando 100% no seu navegador com WebCrypto, Token Bucket e Write-Ahead Logging:  
👉 **[Acessar Live Playground do LogSentinel Memory Guard](https://felipemadson.github.io/logsentinel-memory-guard/)**

---

## 🖥️ Demonstração em Terminal Vetorial (Execução & Benchmarks)

<p align="center">
  <img src="docs/assets/terminal-demo.svg" alt="Terminal Demo - LogSentinel Memory Guard" width="840" />
</p>

---

## 🏛️ Visão Geral & Arquitetura de Software

O **LogSentinel Memory Guard** foi construído seguindo princípios de **Engenharia de Software de Alto Rigor Corporativo**, estruturado em camadas desacopladas (Clean / Hexagonal DDD) e operando com **100% de APIs nativas do Node.js** (zero dependências externas de runtime).

```mermaid
flowchart TD
    CLI["CLI / Consumer Input"] --> Domain["Domain Layer (Value Objects & Invariants)"]
    Domain --> Engine["Core Multi-Tenant Engine"]
    
    subgraph Layers["Subsistemas de Alta Resiliência"]
        Engine --> Security["Security Vault (Timing-Safe HMAC / Zero-Leak)"]
        Engine --> WAL["Storage WAL (Write-Ahead Log + Crash Recovery)"]
        Engine --> Outbox["Outbox Dispatcher (Idempotência)"]
        Engine --> RateLimiter["Token-Bucket Rate Limiter"]
        Engine --> CircuitBreaker["Circuit Breaker (CLOSED / OPEN / HALF_OPEN)"]
        Engine --> EventBus["Event Bus (Domain Events Pub/Sub)"]
        Engine --> Telemetry["Prometheus Exporter (P50/P95/P99)"]
    end
    
    Security --> Output["Audit Verified Record"]
```

---

## 🚀 Diferenciais Técnicos de Nível Staff/Senior

* **Zero Runtime Dependencies:** Total independência de ecossistemas externos, garantindo menor superfície de ataque e inicialização instantânea (< 30ms).
* **Multi-Tenancy Criptograficamente Segregado:** Cada registro é isolado por TenantIdentifier e protegido contra vazamento entre contas.
* **Proteção Criptográfica Contra Side-Channel:** Comparação de hashes via `crypto.timingSafeEqual` prevenindo ataques de canal lateral baseados em tempo de resposta.
* **Higienização Recursiva Automática (Zero Credential Leak):** Algoritmo profundo que mascara chaves de API, senhas e tokens antes de persistir no log.
* **Write-Ahead Logging (WAL) com Recuperação de Desastres:** Reconstrução determinística de estado através de `replay()` validado por somas de verificação SHA-256.
* **Resiliência Integrada:** Algoritmo Token-Bucket para controle de taxa e Circuit Breaker para tolerância a falhas.
* **Telemetria Prometheus Nativa:** Cálculo de percentis de latência (P50, P95, P99) e métricas expostas no formato oficial.

---

## 📦 Polyglot Client SDKs (TypeScript & Python)

Este projeto acompanha SDKs tipados de alta resiliência prontos para uso em microsserviços e integrações:

### Exemplo em TypeScript / Node.js
```typescript
import { LogSentinelMemoryGuardClient } from "./sdk/ts/client.ts";

const client = new LogSentinelMemoryGuardClient({
  baseUrl: "http://127.0.0.1:3000",
  tenantId: "acme-corp"
});

const health = await client.checkHealth();
console.log("Status do Motor:", health.status);

const item = await client.processItem("order-key-101", { value: 1500 });
console.log("Item verificado com hash:", item.hash);
```

### Exemplo em Python 3 (Zero Dependências)
```python
from sdk.python.client import LogSentinelMemoryGuardClient

client = LogSentinelMemoryGuardClient(base_url="http://127.0.0.1:3000", tenant_id="acme-corp")
health = client.check_health()
print(f"Status do Serviço: {health}")

res = client.process_item("sensor-01", {"temperature": 24.2})
print(f"Processado: {res.get('id')}")
```

---

## 🏛️ Governança Arquitetural & Modelo C4

O **LogSentinel Memory Guard** conta com documentação formal de arquitetura corporativa mantida por **Felipe Madison (@FelipeMadson)**:
- 📑 [Architecture Decision Records (ADRs 0001 a 0005)](docs/adr/README.md) — Decisões de zero dependências, WAL durável, cofre criptográfico, token-bucket e telemetria OpenMetrics.
- 🗺️ [Modelo Arquitetural C4 Completo](docs/architecture/c4-model.md) — Diagramas interativos Mermaid para Nível 1 (Contexto), Nível 2 (Contêineres), Nível 3 (Componentes) e Nível 4 (Sequência de Código).

---

## 🔌 Coleções de Testes de API (Turnkey)

Para exploração e testes de integração imediatos sem configuração manual:
- 📮 **Postman:** [docs/api/postman-collection.json](docs/api/postman-collection.json) (v2.1 com scripts de asserção)
- 🟣 **Insomnia:** [docs/api/insomnia-workspace.json](docs/api/insomnia-workspace.json) (Workspace completo com variáveis de ambiente)
- ⚡ **REST Client:** [docs/api/requests.http](docs/api/requests.http) (Compatível com JetBrains HTTP Client e VS Code REST Client)

---

## 🛡️ Robustez Empírica: Chaos & Fuzz Testing Matrix

Além dos 18 testes unitários determinísticos, a integridade do sistema é continuamente verificada com:
* **Fuzzing de Invariantes:** 1.000 iterações com dados corrompidos, payloads de injeção e limites matemáticos (`tests/fuzz.test.ts`).
* **Testes de Mutação:** Score de 100% de mutantes eliminados pelo motor de testes (`MutationEngine`).
* **SAST Automatizado:** Análise estática profunda via GitHub CodeQL (`.github/workflows/codeql.yml`).

---

## 🛠️ Instalação, Execução & Verificação

```bash
# Executa a suíte corporativa de 18 testes automatizados
npm test

# Executa o benchmark de performance integrado (> 5.000 ops/seg)
npm run cli benchmark

# Inspeciona as estatísticas e saúde do motor
npm run cli status

# Diagnóstico de integridade do ambiente
npm run cli doctor

# Verificação criptográfica do pacote de release
sha256sum -c dist/releases/SHA256SUMS
```

---

## 👤 Autor & Licença

* **Autor:** Felipe Madison ([@FelipeMadson](https://github.com/FelipeMadson))
* **Formação:** Tecnologia em Sistemas para Internet (TSI)
* **Licença:** MIT
