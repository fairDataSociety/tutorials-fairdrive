# FDP Spreadsheet Demo dApp

This application demonstrates how to use FDP tools and libraries.

## Running

```bash
npm install
```

And to run local dev server:

```bash
npm run dev
```

## Environment Variables

The application expects the `.env` file to be created in the root directory with the following variables:

- `VITE_BEE_NODE_URL` - URL of a Bee node
- `VITE_POSTAGE_STAMP_ID` - A valid Postage Stamp ID

## Deployment

To build the application for deployment:

```bash
npm run build
```
