"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { upload } from "@vercel/blob/client";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  profilePicUrl: string | null;
};

export default function UserDetailForm({ user, isSelf }: { user: User; isSelf: boolean }) {
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
      const name = form.get("name") as string;
      const email = form.get("email") as string;
      const password = form.get("password") as string;
      const role = form.get("role") as string;

      let profilePicUrl: string | undefined;

      if (file) {
        setUploading(true);
        const blob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/blob/avatar",
          onUploadProgress: (p) => setProgress(p.percentage),
        });
        profilePicUrl = blob.url;
        setUploading(false);
      }

      const res = await fetch(`/api/users/${user.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role,
          profilePicUrl,
          ...(password ? { password } : {}),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Gagal menyimpan perubahan");
      }

      router.push("/dashboard/users");
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
    <form onSubmit={handleSubmit} className="space-y-4 rounded-lg border border-gray-200 bg-white p-6">
      <div className="flex items-center gap-3">
        {user.profilePicUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.profilePicUrl} alt={user.name} className="h-12 w-12 rounded-full object-cover" />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-200 text-sm font-medium text-gray-600">
            {user.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Ganti Foto Profil</label>
          <input
            type="file"
            accept=".jpg,.jpeg,.png,.webp"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="text-sm"
          />
        </div>
      </div>
      {uploading && (
        <div>
          <div className="h-2 w-full rounded bg-gray-200">
            <div className="h-2 rounded bg-blue-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
          <p className="mt-1 text-xs text-gray-500">Mengunggah foto... {progress}%</p>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Nama</label>
        <input
          name="name"
          defaultValue={user.name}
          required
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          defaultValue={user.email}
          required
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Password Baru (opsional)</label>
        <input
          type="password"
          name="password"
          minLength={6}
          placeholder="Kosongkan jika tidak diubah"
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900"
        />
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium text-gray-700">Role</label>
        {isSelf ? (
          <input type="hidden" name="role" value={user.role} />
        ) : null}
        <select
          name={isSelf ? undefined : "role"}
          defaultValue={user.role}
          disabled={isSelf}
          className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 disabled:bg-gray-100"
        >
          <option value="ADMIN">ADMIN</option>
          <option value="CEO">CEO</option>
        </select>
        {isSelf && <p className="mt-1 text-xs text-gray-400">Tidak bisa ubah role akun sendiri.</p>}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={busy}
          className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
        >
          {uploading ? "Mengunggah foto..." : submitting ? "Menyimpan..." : "Simpan Perubahan"}
        </button>
        <Link
          href="/dashboard/users"
          className="rounded-md border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Batal
        </Link>
      </div>
    </form>
  );
}
