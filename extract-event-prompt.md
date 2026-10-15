# Extract Laces Event JSON from a Flyer

Usage (Claude Code, from the repo root):

```
Follow extract-event-prompt.md for laces/events/<file>
```

Or in claude.ai: attach the flyer image, paste this whole file, and give the
image's path in this repo (e.g. `laces/events/zelah.png`).

---

## Task

Read the attached event flyer and produce a Laces event JSON object that
matches the template below. Then list every value you had to assume.

## Steps

1. **Cover link.** If you can run commands, run
   `node generate-link.js events/<filename>` from the repo root and use the
   printed URL. Otherwise build it as:
   `https://raw.githubusercontent.com/xephas-official/AppAssets/refs/heads/main/laces/events/<filename>`
   If the file is untracked in git, say the link only works after it is
   committed and pushed. Never run git write commands.
2. **Read the flyer.** Extract the title, edition, tagline, date, time, venue,
   phone, prices, ticket tiers, and any "what you get" / agenda bullets.
3. **Fill the template** using the rules below.
4. **Output** the JSON in a `jsonc` code block, then a short
   "Assumptions" list of every field not stated on the flyer.

## Field rules

| Field | Rule |
|---|---|
| `org_id` | Always `"{{orgId}}"` |
| `handle` | Short lowercase slug from the organizer or event name (e.g. `zelah`, `bennet`). No spaces. |
| `name` | Event title in Title Case, with the year appended (e.g. `"Makeup & Soul-Care Masterclass 2026"`). |
| `description` | One paragraph: organizer, edition, the tagline, then the "what you get" / agenda bullets joined with commas. Keep the flyer's wording. |
| `cover` | The link from step 1. |
| `event_type` | One of: `running, cycling, walking, triathlon, swimming, obstacle, multisport, fitness, dance, conference, concert, festival, workshop, other`. Masterclasses, clinics and trainings are `workshop`. |
| `gallery` | `[]` |
| `distances_km` | Only for races (running, cycling, walking, triathlon, swimming). Numbers from the flyer, e.g. `[5, 10, 21]`. Omit otherwise. |
| `venue` | Venue name as printed, Title Case. |
| `organizer_phone` | Ugandan numbers as `+256 7XX XXX XXX` (drop the leading 0). Prefer the WhatsApp/contact number. |
| `starts_at` / `ends_at` | ISO 8601 in **UTC** with `.000Z`. Kampala is UTC+3, so 9:00 AM EAT = `06:00:00.000Z`. If no year, use the next occurrence of that date from today. If no time, default to 09:00–17:00 EAT and list it as an assumption. |
| `timezone` | `"Africa/Kampala"` unless the flyer says otherwise. |
| `visibility` | `"public"` |
| `reg_opens_at` | Today at `00:00:00.000Z`. |
| `reg_closes_at` | Same as `starts_at` unless the flyer gives a deadline. |
| `currency` | From the flyer, default `"UGX"`. |
| `is_demo` | `true` |
| `ticket_types` | One entry per price tier on the flyer (see below). |

### Ticket types

- `price` is an integer in the currency's base unit: `180K` → `180000`,
  `1.5M` → `1500000`. No commas.
- `name`: the tier name from the flyer (Silver, Gold, VIP, Early Bird...).
  If there is a single unnamed price, use a sensible name such as
  `"Regular"` or `"Masterclass Pass"`.
- `description`: what the tier includes, from the flyer; otherwise
  `"Standard entry"` / `"Premium entry"` / `"Exclusive entry"`.
- `has_kit`: `true` only if the tier includes a physical item (race kit,
  t-shirt, starter pack). A "kit guide" or "kit list" is not a kit.
- `visibility`: `"public"`.

## Never invent

Do not make up phone numbers, venues, prices or tiers that are not on the
flyer. If something is missing, use the defaults above, or leave a
`// TODO` comment and call it out in Assumptions.

## Template

```jsonc
{
    "org_id": "{{orgId}}",
    "handle": "",
    "name": "",
    "description": "",
    "cover": "",
    "event_type": "", // running, cycling, walking, triathlon, swimming, obstacle, multisport, fitness, dance, conference, concert, festival, workshop, other
    "gallery": [],
    // "distances_km": [5, 10, 21],
    "venue": "",
    "organizer_phone": "",
    "starts_at": "",
    "ends_at": "",
    "timezone": "Africa/Kampala",
    "visibility": "public",
    "reg_opens_at": "",
    "reg_closes_at": "",
    "currency": "UGX",
    "is_demo": true,
    "ticket_types": [
        {
            "name": "",
            "description": "",
            "price": 0,
            "has_kit": false,
            "visibility": "public"
        }
    ]
}
```
