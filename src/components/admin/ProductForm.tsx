"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clsx } from "clsx";
import {
  ArrowLeft,
  Star,
  Trash2,
  Plus,
  Wand2,
  ImageOff,
  X,
  Search,
  FolderOpen,
} from "lucide-react";
import { Card, Field, Input, Textarea, Select, Button, Toggle } from "./ui";
import { Uploader } from "./Uploader";
import { MediaPicker } from "./MediaPicker";
import { slugify } from "@/lib/slug";
import {
  saveProductAction,
  deleteProductAction,
  quickCreateCollectionAction,
} from "@/app/admin/actions";
import type {
  Product,
  ProductImage,
  ProductPayload,
  ProductStatus,
  Variant,
  Collection,
  MediaFile,
} from "@/lib/types";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

export function ProductForm({
  product,
  collections: initialCollections,
}: {
  product?: Product;
  collections: Collection[];
}) {
  const router = useRouter();
  const [saving, startSave] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(product?.name ?? "");
  const [material, setMaterial] = useState(product?.material ?? "");
  const [sku, setSku] = useState(product?.sku ?? "");
  const [shortDesc, setShortDesc] = useState(product?.shortDesc ?? "");
  const [fullDesc, setFullDesc] = useState(product?.fullDesc ?? "");
  const [price, setPrice] = useState(String(product?.price ?? ""));
  const [comparePrice, setComparePrice] = useState(
    product?.comparePrice != null ? String(product.comparePrice) : "",
  );
  const [weight, setWeight] = useState(
    product?.weight != null ? String(product.weight) : "",
  );
  const [images, setImages] = useState<ProductImage[]>(product?.images ?? []);
  const [videos, setVideos] = useState<string[]>(product?.videos ?? []);
  const [variants, setVariants] = useState<Variant[]>(product?.variants ?? []);
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [status, setStatus] = useState<ProductStatus>(product?.status ?? "draft");
  const [featured, setFeatured] = useState(product?.featured ?? false);
  const [seoTitle, setSeoTitle] = useState(product?.seoTitle ?? "");
  const [seoDesc, setSeoDesc] = useState(product?.seoDesc ?? "");

  const [picker, setPicker] = useState<null | "image" | "video">(null);

  const [collections, setCollections] = useState(initialCollections);
  const [collectionIds, setCollectionIds] = useState<string[]>(
    product?.collectionIds ?? [],
  );
  const [colQuery, setColQuery] = useState("");
  const [newCol, setNewCol] = useState("");
  const [creatingCol, startCreateCol] = useTransition();

  // ── image helpers ──
  function addImages(files: MediaFile[]) {
    setImages((prev) => {
      const next = [...prev];
      for (const f of files) {
        if (f.type === "image") next.push({ url: f.url, primary: false });
      }
      if (!next.some((i) => i.primary) && next[0]) next[0].primary = true;
      return next;
    });
  }
  function setPrimary(url: string) {
    setImages((prev) => prev.map((i) => ({ ...i, primary: i.url === url })));
  }
  function removeImage(url: string) {
    setImages((prev) => {
      const next = prev.filter((i) => i.url !== url);
      if (!next.some((i) => i.primary) && next[0]) next[0].primary = true;
      return next;
    });
  }
  function addVideos(files: MediaFile[]) {
    setVideos((prev) => {
      const next = [...prev];
      for (const f of files) {
        if (f.type === "video" && !next.includes(f.url)) next.push(f.url);
      }
      return next;
    });
  }

  // ── variant helpers ──
  function addVariant() {
    setVariants((v) => [
      ...v,
      { id: uid(), title: "", sku: "", price: Number(price) || 0, inventory: 0, available: true },
    ]);
  }
  function updateVariant(id: string, patch: Partial<Variant>) {
    setVariants((v) => v.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }
  function removeVariant(id: string) {
    setVariants((v) => v.filter((x) => x.id !== id));
  }

  // ── collection helpers ──
  function toggleCollection(id: string) {
    setCollectionIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id],
    );
  }
  function createCollectionInline() {
    const n = newCol.trim();
    if (!n) return;
    startCreateCol(async () => {
      const col = await quickCreateCollectionAction(n);
      setCollections((c) => [col, ...c]);
      setCollectionIds((ids) => [...ids, col.id]);
      setNewCol("");
    });
  }

  // ── seo / slug autogen ──
  function genSeo() {
    setSeoTitle(`${name.trim() || "Jewellery"} | By Areeqaan`.slice(0, 60));
    setSeoDesc(
      (shortDesc || fullDesc || `Shop ${name} at By Areeqaan.`).slice(0, 160),
    );
  }

  function save() {
    setError(null);
    const payload: ProductPayload = {
      id: product?.id,
      name,
      material,
      sku,
      shortDesc,
      fullDesc,
      price: Number(price) || 0,
      comparePrice: comparePrice === "" ? null : Number(comparePrice),
      weight: weight === "" ? null : Number(weight),
      slug: slug || slugify(name),
      status,
      featured,
      seoTitle,
      seoDesc,
      images,
      videos,
      variants,
      collectionIds,
    };
    startSave(async () => {
      const res = await saveProductAction(payload);
      if (res.ok) router.push("/admin/products");
      else setError(res.error ?? "Could not save");
    });
  }

  function remove() {
    if (!product) return;
    if (!confirm(`Delete "${product.name}"?`)) return;
    startSave(async () => {
      await deleteProductAction(product.id);
      router.push("/admin/products");
    });
  }

  const filteredCols = collections.filter((c) =>
    c.name.toLowerCase().includes(colQuery.trim().toLowerCase()),
  );

  return (
    <div className="space-y-5 pb-10">
      {/* Header / save bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/products"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-black/10 bg-white text-muted hover:text-ink"
          >
            <ArrowLeft size={16} />
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink">
            {product ? "Edit product" : "New product"}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {product && (
            <Button variant="danger" onClick={remove} disabled={saving}>
              <Trash2 size={15} /> Delete
            </Button>
          )}
          <Button onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save product"}
          </Button>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <div className="grid gap-5 lg:grid-cols-3">
        {/* Main column */}
        <div className="space-y-5 lg:col-span-2">
          <Card className="space-y-4">
            <Field label="Product name">
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Lina Layered Necklace"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Material">
                <Input value={material} onChange={(e) => setMaterial(e.target.value)} placeholder="e.g. 18k gold-plated" />
              </Field>
              <Field label="SKU">
                <Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="e.g. BA-NK-001" />
              </Field>
            </div>
            <Field label="Short description">
              <Textarea
                value={shortDesc}
                onChange={(e) => setShortDesc(e.target.value)}
                rows={2}
                placeholder="One-line teaser shown on cards"
              />
            </Field>
            <Field label="Full description">
              <Textarea
                value={fullDesc}
                onChange={(e) => setFullDesc(e.target.value)}
                rows={5}
                placeholder="Detailed description, materials, care…"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-3">
              <Field label="Price (Rs)">
                <Input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="0" />
              </Field>
              <Field label="Compare price">
                <Input type="number" value={comparePrice} onChange={(e) => setComparePrice(e.target.value)} placeholder="optional" />
              </Field>
              <Field label="Weight (g)">
                <Input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="optional" />
              </Field>
            </div>
          </Card>

          {/* Images */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Images</h3>
              <Button
                variant="secondary"
                onClick={() => setPicker("image")}
                className="px-3 py-1.5 text-xs"
              >
                <FolderOpen size={14} /> Choose from library
              </Button>
            </div>
            {images.length > 0 && (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {images.map((img) => (
                  <div
                    key={img.url}
                    className={clsx(
                      "group relative aspect-square overflow-hidden rounded-xl border",
                      img.primary ? "border-violet ring-2 ring-violet/20" : "border-black/[0.06]",
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                    {img.primary && (
                      <span className="absolute left-1.5 top-1.5 rounded-md bg-violet-deep px-1.5 py-0.5 text-[10px] font-medium text-white">
                        Primary
                      </span>
                    )}
                    <div className="absolute inset-x-1.5 bottom-1.5 flex justify-between opacity-0 transition-opacity group-hover:opacity-100">
                      {!img.primary && (
                        <button
                          onClick={() => setPrimary(img.url)}
                          title="Set as primary"
                          className="rounded-md bg-white/90 p-1 text-violet-deep shadow"
                        >
                          <Star size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => removeImage(img.url)}
                        title="Remove"
                        className="ml-auto rounded-md bg-white/90 p-1 text-red-600 shadow"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <Uploader onUploaded={addImages} accept="image/*" compact label="Upload images" />
          </Card>

          {/* Videos */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Videos</h3>
              <Button
                variant="secondary"
                onClick={() => setPicker("video")}
                className="px-3 py-1.5 text-xs"
              >
                <FolderOpen size={14} /> Choose from library
              </Button>
            </div>
            {videos.length > 0 && (
              <ul className="space-y-2">
                {videos.map((v) => (
                  <li key={v} className="flex items-center gap-2 rounded-lg border border-black/[0.06] bg-black/[0.02] px-3 py-2">
                    <span className="min-w-0 flex-1 truncate text-sm text-ink">{v}</span>
                    <button onClick={() => setVideos((p) => p.filter((x) => x !== v))} className="text-red-500">
                      <X size={15} />
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <Uploader
              onUploaded={(files) => setVideos((p) => [...p, ...files.filter((f) => f.type === "video").map((f) => f.url)])}
              accept="video/*"
              compact
              label="Upload videos"
            />
          </Card>

          {/* Variants */}
          <Card className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">Variants</h3>
              <Button variant="secondary" onClick={addVariant} className="px-3 py-1.5 text-xs">
                <Plus size={14} /> Add variant
              </Button>
            </div>
            {variants.length === 0 ? (
              <p className="text-sm text-muted">No variants. Add sizes, colours, etc.</p>
            ) : (
              <div className="space-y-2">
                {variants.map((v) => (
                  <div key={v.id} className="grid grid-cols-2 items-end gap-2 rounded-xl border border-black/[0.06] p-3 sm:grid-cols-[1.4fr_1fr_0.8fr_0.8fr_auto_auto]">
                    <Field label="Title"><Input value={v.title} onChange={(e) => updateVariant(v.id, { title: e.target.value })} placeholder="e.g. Gold / S" /></Field>
                    <Field label="SKU"><Input value={v.sku} onChange={(e) => updateVariant(v.id, { sku: e.target.value })} /></Field>
                    <Field label="Price"><Input type="number" value={v.price} onChange={(e) => updateVariant(v.id, { price: Number(e.target.value) })} /></Field>
                    <Field label="Stock"><Input type="number" value={v.inventory} onChange={(e) => updateVariant(v.id, { inventory: Number(e.target.value) })} /></Field>
                    <div className="pb-2.5"><Toggle checked={v.available} onChange={(c) => updateVariant(v.id, { available: c })} /></div>
                    <button onClick={() => removeVariant(v.id)} className="mb-1 rounded-lg p-2 text-red-500 hover:bg-red-50"><Trash2 size={15} /></button>
                  </div>
                ))}
              </div>
            )}
          </Card>

          {/* SEO */}
          <Card className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-ink">SEO</h3>
              <Button variant="secondary" onClick={genSeo} className="px-3 py-1.5 text-xs">
                <Wand2 size={14} /> Auto-generate
              </Button>
            </div>
            <Field
              label="SEO title"
              hint={<CharCount value={seoTitle} max={60} />}
            >
              <Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </Field>
            <Field
              label="Meta description"
              hint={<CharCount value={seoDesc} max={160} />}
            >
              <Textarea value={seoDesc} onChange={(e) => setSeoDesc(e.target.value)} rows={2} />
            </Field>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <Card className="space-y-4">
            <Field label="Status">
              <Select value={status} onChange={(e) => setStatus((e.target as HTMLSelectElement).value as ProductStatus)}>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </Select>
            </Field>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-plum">Featured</span>
              <Toggle checked={featured} onChange={setFeatured} />
            </div>
          </Card>

          <Card className="space-y-3">
            <Field
              label="URL slug"
              hint={
                <button onClick={() => setSlug(slugify(name))} className="text-violet-deep hover:underline">
                  Generate
                </button>
              }
            >
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" />
            </Field>
            <p className="text-xs text-muted">/products/{slug || slugify(name) || "…"}</p>
          </Card>

          <Card className="space-y-3">
            <h3 className="text-sm font-semibold text-ink">Collections</h3>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
              <Input value={colQuery} onChange={(e) => setColQuery(e.target.value)} placeholder="Filter…" className="pl-8" />
            </div>
            <div className="max-h-48 space-y-1 overflow-auto">
              {filteredCols.length === 0 ? (
                <p className="px-1 py-2 text-xs text-muted">No collections.</p>
              ) : (
                filteredCols.map((c) => (
                  <label key={c.id} className="flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-black/[0.03]">
                    <input
                      type="checkbox"
                      checked={collectionIds.includes(c.id)}
                      onChange={() => toggleCollection(c.id)}
                      className="h-4 w-4 accent-violet-deep"
                    />
                    <span className="text-sm text-ink">{c.name}</span>
                  </label>
                ))
              )}
            </div>
            <div className="flex gap-2 border-t border-black/[0.06] pt-3">
              <Input
                value={newCol}
                onChange={(e) => setNewCol(e.target.value)}
                placeholder="New collection name"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    createCollectionInline();
                  }
                }}
              />
              <Button variant="secondary" onClick={createCollectionInline} disabled={creatingCol} className="shrink-0 px-3">
                <Plus size={15} />
              </Button>
            </div>
          </Card>

          {images.length === 0 && (
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2.5 text-xs text-amber-700">
              <ImageOff size={15} /> Add at least one image before publishing.
            </div>
          )}
        </div>
      </div>

      {picker && (
        <MediaPicker
          accept={picker}
          onClose={() => setPicker(null)}
          onSelect={(picked) =>
            picker === "image" ? addImages(picked) : addVideos(picked)
          }
        />
      )}
    </div>
  );
}

function CharCount({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <span className={over ? "text-red-500" : "text-muted"}>
      {value.length}/{max}
    </span>
  );
}
