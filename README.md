# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.\
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## Claude Code MCP Servers Configuration

This project is configured with three MCP (Model Context Protocol) servers that auto-load in Claude Code:

### Configured Servers

1. **Figma** - Design and prototype integration
   - Enables Claude to interact with Figma files and designs
   - Requires: `FIGMA_API_TOKEN` environment variable

2. **Firecrawl** - Web crawling and data extraction
   - Allows Claude to scrape and analyze web content
   - Requires: `FIRECRAWL_API_KEY` environment variable

3. **shadcn** - UI component library
   - Access to shadcn/ui components and documentation
   - No credentials required

### Setup Instructions

The MCP servers are configured in two files:

- **`.mcp.json`** - Server definitions (committed to git)
- **`.claude/settings.json`** - Project-level enablement (committed to git)
- **`.claude/settings.local.json`** - Local credentials (gitignored for security)

### Adding API Credentials

1. Open `.claude/settings.local.json`
2. Replace the placeholder values with your actual API tokens:

```json
{
  "env": {
    "FIGMA_API_TOKEN": "your-actual-figma-token",
    "FIRECRAWL_API_KEY": "your-actual-firecrawl-key"
  }
}
```

### Getting API Tokens

- **Figma API Token**: https://www.figma.com/developers/api#access-tokens
- **Firecrawl API Key**: https://www.firecrawl.dev/

### Auto-Loading

These servers automatically load when you start Claude Code. No manual configuration needed after adding credentials.

To reload the configuration mid-session, open `/hooks` or restart Claude Code.

## Optional MCP Servers (Manual Invocation)

The following servers are available but disabled by default. Enable them manually when needed:

### Available Optional Servers

1. **Supabase** - Database and backend integration
   - Requires: `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`
   - Official: https://github.com/supabase-community/supabase-mcp
   - Enables: Database queries, authentication management, real-time updates

2. **Stripe** - Payment processing integration
   - Requires: `STRIPE_API_KEY`
   - Enables: Customer lookups, invoice checks, payment management

3. **Mobbin** - Mobile design reference (via Firecrawl)
   - Requires: `FIRECRAWL_API_KEY`
   - Enables: Web scraping of Mobbin design patterns and references

### How to Enable Optional Servers

To temporarily enable an optional server during a Claude Code session:

1. Open Claude Code `/hooks` command
2. Find the server in the list (e.g., `supabase`, `stripe`, `mobbin`)
3. Enable it for the current session

Or add them to `enabledMcpjsonServers` in `.claude/settings.local.json`:

```json
{
  "enabledMcpjsonServers": ["figma", "firecrawl", "shadcn", "supabase", "stripe"]
}
```

### Adding Optional Server Credentials

Update `.claude/settings.local.json` with your API keys:

```json
{
  "env": {
    "SUPABASE_URL": "https://your-project.supabase.co",
    "SUPABASE_SERVICE_ROLE_KEY": "your-supabase-service-role-key",
    "STRIPE_API_KEY": "sk_live_your_stripe_key"
  }
}
```

### Getting Optional API Credentials

- **Supabase**: https://app.supabase.com → Project Settings → API Keys
- **Stripe**: https://dashboard.stripe.com → Developers → API Keys
- **Mobbin**: Uses Firecrawl (see Firecrawl API Key above)

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can't go back!**

If you aren't satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you're on your own.

You don't have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn't feel obligated to use this feature. However we understand that this tool wouldn't be useful if you couldn't customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
