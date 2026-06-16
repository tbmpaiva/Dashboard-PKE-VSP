# PKE FAP Dashboard

Dashboard de performance das Video Sales Pages FAP da PKE Automotive.

## Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **Recharts**
- **Google Sheets** como fonte de dados (CSV export público)

## Setup local

```bash
npm install
npm run dev
```

Abrir em `http://localhost:3000`

## Deploy no Vercel

1. Criar repositório privado no GitHub e fazer push deste código
2. Ligar o repositório ao Vercel (Import Project)
3. Framework: Next.js (detectado automaticamente)
4. Deploy — sem variáveis de ambiente necessárias

## Estrutura das Google Sheets

O dashboard lê duas sheets do ficheiro:
- **Visão VSP Diária** (gid=1881326090) — dados diários
- **Visão VSP Semanal** (gid=0 ou primeira sheet) — dados semanais

Colunas esperadas (A a R):
| Col | Campo |
|-----|-------|
| A | Ano |
| B | Dia / Semana |
| C | Leads SoluçõesFAP |
| D | Leads FAPLuz |
| E | Leads FAPEmergência |
| F | Leads FAPOrçamento |
| G | Leads ScorecardFAP |
| H | Total Leads FAP |
| I | Tráfego SoluçõesFAP |
| J | Tráfego FAPLuz |
| K | Tráfego FAPEmergência |
| L | Tráfego FAPOrçamento |
| M | Tráfego ScorecardFAP |
| N | Tx Conv SoluçõesFAP |
| O | Tx Conv FAPLuz |
| P | Tx Conv FAPEmergência |
| Q | Tx Conv FAPOrçamento |
| R | Tx Conv ScorecardFAP |

## Ajuste do GID da sheet semanal

Se a sheet semanal não for a primeira (gid=0), verificar o URL da sheet no browser e actualizar `GID_SEMANAL` em `src/lib/sheets.ts`.

## Refresh automático

Os dados actualizam automaticamente a cada 5 minutos. O indicador no header mostra a última actualização e o estado (verde = ok, amarelo = a carregar).
