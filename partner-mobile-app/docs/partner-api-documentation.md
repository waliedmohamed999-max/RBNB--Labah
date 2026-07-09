# Partner API Documentation

Base URL: `http://localhost:4100`

## Available Today

| Method | Path | Permission | Notes |
| --- | --- | --- | --- |
| GET | `/health` | public | Health check |
| POST | `/auth/register-partner` | public | Multipart registration, partner status is `pending` |
| POST | `/auth/login` | public | Returns access token, refresh token, and role. Partner must be `approved` |
| POST | `/auth/refresh` | public | Rotates access and refresh tokens |
| POST | `/auth/logout` | public | Client-side logout acknowledgement |
| GET | `/partner/dashboard` | partner | Dashboard totals |
| GET | `/partner/me` | partner | Partner profile, settings, enabled features, permissions |
| GET | `/services` | `manage_services` | List partner services |
| POST | `/services` | `create_service` | Create a basic service |
| GET | `/bookings` | `view_bookings` | List partner bookings |
| POST | `/bookings` | `view_bookings` | Create internal booking |
| GET | `/invoices` | `view_invoices` | List invoices |
| GET | `/invoices/:id/pdf` | `view_invoices` | Returns PDF metadata only |

## Admin Only

| Method | Path |
| --- | --- |
| GET | `/admin/partners` |
| PATCH | `/admin/partners/:id/status` |
| GET | `/admin/packages` |
| POST | `/admin/packages` |
| GET | `/admin/partners/:id/permissions` |
| PUT | `/admin/partners/:id/permissions` |
| PUT | `/admin/partners/:id/package` |

## Missing APIs For Full Mobile Parity

- Server-side refresh-token revocation table and device/session management.
- Services full CRUD: get by id, update, delete, status toggle.
- Unit media upload, gallery ordering, image compression pipeline.
- Pricing, availability calendar, amenities, map coordinates.
- Booking status actions: accept, reject, cancel, complete, check-in.
- Customer details and invoice/payment relation per booking.
- Offers, coupons, last-minute deals.
- Experiences, events, conferences.
- Posts, pages, categories, tags.
- Push notification registration and notification inbox.
- Wallet, payouts, financial reports.
- Profile update, password change, avatar upload.
- Pagination, filters, search on list endpoints.
