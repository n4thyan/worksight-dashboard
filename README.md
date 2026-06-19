# WorkSight Dashboard

WorkSight Dashboard is a practical business analytics dashboard for turning spreadsheet-style data into KPIs, charts, filters and plain-English insight notes.

It is designed as a portfolio project showing how AI-assisted workflows can support real office and business tasks without pretending the app is doing magic. The dashboard uses rule-based analysis in the browser, with clear human-review wording.

## Project status

Prototype / portfolio MVP.

The current version runs locally as a static dashboard with sample business data. It supports CSV upload, KPI cards, filters, visual charts, automated insight notes and a printable report view.

## Use cases

WorkSight is aimed at realistic office/workplace scenarios such as:

- small business sales reporting
- invoice/payment tracking
- support ticket monitoring
- marketing performance reviews
- team/project reporting
- quick spreadsheet-to-summary workflows

## Features

- Load built-in sample business data
- Upload a CSV file
- KPI cards for revenue, profit, orders, open work and satisfaction
- Filter by date range, department and status
- Revenue trend chart
- Department/category breakdown chart
- Status distribution chart
- Plain-English insight panel
- Data quality checks
- Printable/exportable report page
- No paid API keys required

## Built with

- HTML
- CSS
- JavaScript
- Chart.js
- Node.js local static server
- AI-assisted planning and documentation with human review

## Why this is in my portfolio

This project links directly to practical workplace AI use: cleaning up spreadsheet-style data, identifying useful metrics, creating visual summaries, spotting basic trends and explaining results in plain English.

The dashboard is intentionally grounded. It does not claim to replace an analyst or make decisions automatically. It helps surface useful information faster, while keeping the user responsible for checking the data and interpreting the context.

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:4173
```

The app can also be opened directly from `index.html` for basic static use.

## CSV format

The sample CSV uses these columns:

```text
date,department,category,channel,owner,status,revenue,cost,tickets,response_hours,satisfaction
```

Uploaded CSVs work best when they use the same headings.

## Future improvements

- Add more sample datasets
- Add saved dashboard views
- Add CSV validation warnings by row
- Add PDF-style report export
- Add optional AI prompt pack for external review in Gemini/ChatGPT
- Add deployment notes and screenshots
