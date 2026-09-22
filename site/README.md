# Tech Miner Experience Web v01

This is a locally frozen static deployment package, not evidence of an online deployment.

## Deploy

Serve this directory from a domain root or any subpath. The generated HTML and asset references are relative.

The server must return correct MIME types for JavaScript, CSS, WOFF2 fonts, and SVG files. Configure `index.html` with `Cache-Control: no-cache` or equivalent revalidation. Files under `assets/` are content-hashed and may use `Cache-Control: public, max-age=31536000, immutable`.

Apply the exact Content-Security-Policy in `CSP.json` as an HTTP response header. The declared `style-src-attr 'unsafe-inline'` is a compatibility allowance for the Runtime's dynamic positioning and animation styles; it is not a claim that inline style attributes are forbidden.

Entrypoint: `index.html`
Source commit: `d801b3895b9aa4383e9a91dcd06771345639de0a`
