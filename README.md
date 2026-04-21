# AppAssets — GitHub Raw Link Generator

This repo stores static assets (images, covers, placeholders) for Linkyoo and related projects, served via GitHub's raw CDN.

## Usage

```bash
node generate-link.js <folder/filename>
# or
node generate-link.js <folder>
```

---

## Examples

### Get a link for a specific file

```bash
node generate-link.js app/Linkyoo-App-Cover.webp
node generate-link.js covers/Linkyoo-Cover.webp
node generate-link.js meta/Linkyoo-Editor-Cover.webp
node generate-link.js blog/Linkyoo-Editor-Blog.webp
node generate-link.js placeholders/kalya-courts.webp
```

### Get links for all files in a folder

```bash
node generate-link.js app
node generate-link.js covers
node generate-link.js meta
node generate-link.js blog
node generate-link.js placeholders
node generate-link.js demos/heybabe
```

### View available folders

```bash
node generate-link.js --help
```

---

## Folder Structure

| Folder         | Purpose                                      |
|----------------|----------------------------------------------|
| `app/`         | App cover and promotional images             |
| `covers/`      | Editor and main cover images                 |
| `meta/`        | OG / social meta images                      |
| `blog/`        | Blog post cover images                       |
| `placeholders/`| Placeholder images for demo businesses       |
| `demos/`       | Demo business images (avoid Firebase storage)|

---

## Raw URL Format

All generated links follow this pattern:

```text
https://raw.githubusercontent.com/xephas-official/AppAssets/refs/heads/main/linkyoo/<folder>/<filename>
```

### Example output

```text
https://raw.githubusercontent.com/xephas-official/AppAssets/refs/heads/main/linkyoo/app/Linkyoo-App-Cover.webp
```

---

## Adding Images

1. Place the image file inside the appropriate subfolder under `linkyoo/`
2. Commit and push to `main`
3. Run `node generate-link.js <folder/filename>` to get the raw URL
