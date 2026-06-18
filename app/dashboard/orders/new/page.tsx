"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";

export default function NewOrderPage() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const form = new FormData(e.currentTarget);
      const namaPemesan = form.get("namaPemesan") as string;
      const noHp = form.get("noHp") as string;
      const statusBayar = form.get("statusBayar") as string;
      const catatan = form.get("catatan") as string;

      let fileUrl: string | undefined;
      let fileName: string | undefined;
      let fileSize: number | undefined;

      if (file) {
        if (!file.name.toLowerCase().endsWith(".zip")) {
          throw new Error("File harus berformat .zip");
        }
        setUploading(true);
        setProgress(0);
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/upload",
          onUploadProgress: (p) => setProgress(p.percentage),
        });
        fileUrl = blob.url;
        fileName = file.name;
        fileSize = file.size;
        setUploading(false);
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ namaPemesan, noHp, statusBayar, catatan, fileUrl, fileName, fileSize }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Gagal menyimpan order");
      }

      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
      setUploading(false);
    }
  }

  const busy = submitting || uploading;

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-lg font-semibold text-gray-900">Tambah Order</h1>
      <form onSubmit={handleSubmit} className="space-y-4 rounded border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Nama Pemesan</label>
          <input name="namaPemesan" required className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">No HP</label>
          <input name="noHp" required className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Status Bayar</label>
          <select name="statusBayar" defaultValue="BELUM" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900">
            <option value="BELUM">Belum Bayar</option>
            <option value="DP">DP</option>
            <option value="LUNAS">Lunas</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Catatan (opsional)</label>
          <textarea name="catatan" className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900" rows={3} />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">File Project (.zip)</label>
          <input
            type="file"
            accept=".zip"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full text-sm"
          />
          {uploading && (
            <div className="mt-2">
              <div className="h-2 w-full rounded bg-gray-200">
                <div className="h-2 rounded bg-[var(--color-primary)] transition-all" style={{ width: `${progress}%` }} />
              </div>
              <p className="mt-1 text-xs text-gray-500">Mengunggah file... {progress}%</p>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={busy}
            className="flex-1 rounded bg-[var(--color-primary)] px-3 py-2 text-sm font-medium text-white hover:bg-[var(--color-primary-hover)] disabled:opacity-60"
          >
            {uploading ? "Mengunggah file..." : submitting ? "Menyimpan..." : "Simpan Order"}
          </button>
          <Link
            href="/dashboard"
            className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Batal
          </Link>
        </div>
      </form>
    </div>
  );
}
