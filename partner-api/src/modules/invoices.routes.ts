import { Router } from "express";
import { requireAuth, requirePermission, requireRole } from "../auth.js";
import { query } from "../db.js";
import { HttpError } from "../http.js";

export const invoicesRouter = Router();

type InvoicePdfRow = {
  id: string;
  invoice_number: string;
  amount: string;
  status: string;
  issued_at: string;
};

invoicesRouter.use(requireAuth, requireRole("partner"));

invoicesRouter.get("/", requirePermission("view_invoices"), async (request, response, next) => {
  try {
    const result = await query<InvoicePdfRow>(
      "SELECT * FROM invoices WHERE partner_id = $1 ORDER BY issued_at DESC LIMIT 100",
      [request.user?.partnerId],
    );
    response.json({ ok: true, data: result.rows });
  } catch (error) {
    next(error);
  }
});

invoicesRouter.get("/:id/pdf", requirePermission("view_invoices"), async (request, response, next) => {
  try {
    const result = await query(
      "SELECT id, invoice_number, amount, status, issued_at FROM invoices WHERE id = $1 AND partner_id = $2",
      [request.params.id, request.user?.partnerId],
    );
    const invoice = result.rows[0];
    if (!invoice) throw new HttpError(404, "Invoice not found.");

    response.json({
      ok: true,
      data: {
        invoice,
        pdf: {
          format: "PDF",
          downloadUrl: `/invoices/${invoice.id}/pdf`,
        },
      },
    });
  } catch (error) {
    next(error);
  }
});
