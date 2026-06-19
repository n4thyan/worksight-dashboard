# WorkSight Dashboard

WorkSight Dashboard is a practical office analytics dashboard for turning spreadsheet-style CSV data into KPIs, charts, filters, data-quality notes and short plain-English summaries.

It is a portfolio project focused on realistic workplace use cases: sales review, invoice/payment monitoring, support-ticket tracking, admin reporting and quick spreadsheet-to-summary workflows.

## Project status

Portfolio MVP. The current version runs locally and is ready for static deployment.

The dashboard includes sample business data and CSV upload. Uploaded CSV files are processed in the browser. No uploaded spreadsheet data is sent to a server.

## Live demo

Planned live path:

```text
https://nathm.net/worksight/
```

Until deployment, run it locally with the commands below.

## What it does

- Loads built-in sample business data
- Accepts CSV uploads using the same column format
- Calculates revenue, profit, average order value, open/overdue work and satisfaction
- Filters by date range, department and status
- Shows revenue trend, department revenue and status split charts
- Generates rule-based insight notes
- Highlights basic data-quality checks
- Shows the filtered rows used in the view
- Copies a short summary to the clipboard
- Provides a clean print report view

## Built with

- HTML
- CSS
- JavaScript
- Chart.js
- Node.js local static server
- AI-assisted planning and documentation with human review

## Why this is in my portfolio

This project links directly to practical workplace AI and data-analysis skills: cleaning up spreadsheet-style data, selecting useful metrics, creating visual summaries, spotting basic trends and explaining results in plain English.

The dashboard is intentionally grounded. It does not claim to replace an analyst or make decisions automatically. It helps surface useful information faster, while keeping the user responsible for checking the data and interpreting the business context.

## Run locally

```bash
npm install
npm start
```

Then open:

```text
http://localhost:4173
```

On Windows PowerShell, use `npm.cmd` if script execution policy blocks `npm`:

```powershell
npm.cmd install
npm.cmd start
```

The app can also be opened directly from `index.html` for basic static use.

## CSV format

The sample CSV uses these columns:

```text
date,department,category,channel,owner,status,revenue,cost,tickets,response_hours,satisfaction
```

Uploaded CSVs work best when they use the same headings.

## Example use cases

- A small business checking monthly revenue and overdue work
- A freelancer reviewing invoices, cost and job status
- An admin team preparing a quick meeting summary
- A support team spotting slow-response items
- A portfolio example showing practical data workflows

## Notes on responsible use

WorkSight creates rule-based summaries from the rows currently shown in the dashboard. The notes are designed to help review the data faster, not to make final decisions.

Users should check the source spreadsheet, confirm missing or unusual values and apply their own business context before acting on the output.

## Future improvements

- Add more sample datasets
- Add saved dashboard views
- Add row-level CSV validation warnings
- Add downloadable filtered CSV export
- Add screenshots after deployment
- Add optional prompt templates for reviewing exported summaries in Gemini or ChatGPT
