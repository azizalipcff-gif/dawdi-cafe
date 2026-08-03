"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type {
  Category,
  GalleryItem,
  HeroSlide,
  Message,
  Order,
  OrderStatus,
  Product,
  Reservation,
  SiteSettings,
  Testimonial,
} from "@/lib/types";
import {
  createProduct as createProductAction,
  updateProduct as updateProductAction,
  deleteProduct as deleteProductAction,
} from "@/lib/admin/actions/products";
import {
  createCategory as createCategoryAction,
  updateCategory as updateCategoryAction,
  deleteCategory as deleteCategoryAction,
} from "@/lib/admin/actions/categories";
import {
  createGalleryItem as createGalleryItemAction,
  updateGalleryItem as updateGalleryItemAction,
  deleteGalleryItem as deleteGalleryItemAction,
  reorderGallery as reorderGalleryAction,
} from "@/lib/admin/actions/gallery";
import {
  createHeroSlide as createHeroSlideAction,
  updateHeroSlide as updateHeroSlideAction,
  deleteHeroSlide as deleteHeroSlideAction,
  reorderHeroSlides as reorderHeroSlidesAction,
} from "@/lib/admin/actions/hero";
import { updateSettings as updateSettingsAction } from "@/lib/admin/actions/settings";
import type { SettingsPatch } from "@/lib/admin/actions/settings";
import {
  updateOrderStatus as updateOrderStatusAction,
  deleteOrder as deleteOrderAction,
} from "@/lib/admin/actions/orders";
import type { ProductInput, ProductPatch } from "@/lib/admin/actions/products";
import type { CategoryInput, CategoryPatch } from "@/lib/admin/actions/categories";
import type { GalleryInput, GalleryPatch } from "@/lib/admin/actions/gallery";
import type { HeroInput, HeroPatch } from "@/lib/admin/actions/hero";
import type { AdminData } from "./queries";

export interface AdminCustomer {
  id: string;
  name: string;
  phone: string;
  email: string;
  created_at: string;
}

function uid(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

interface AdminStore {
  products: Product[];
  categories: Category[];
  orders: Order[];
  gallery: GalleryItem[];
  heroSlides: HeroSlide[];
  reservations: Reservation[];
  messages: Message[];
  testimonials: Testimonial[];
  settings: SiteSettings;
  customers: AdminCustomer[];

  addProduct: (input: ProductInput) => void;
  updateProduct: (id: string, patch: ProductPatch) => void;
  deleteProduct: (id: string) => void;

  addCategory: (input: CategoryInput) => void;
  updateCategory: (id: string, patch: CategoryPatch) => void;
  deleteCategory: (id: string) => void;

  addGalleryItem: (input: GalleryInput) => void;
  updateGalleryItem: (id: string, patch: GalleryPatch) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGallery: (items: { id: string; sort_order: number }[]) => void;

  addHeroSlide: (input: HeroInput) => void;
  updateHeroSlide: (id: string, patch: HeroPatch) => void;
  deleteHeroSlide: (id: string) => void;
  reorderHeroSlides: (items: { id: string; sort_order: number }[]) => void;

  updateOrderStatus: (id: string, status: OrderStatus) => void;
  deleteOrder: (id: string) => void;

  updateSettings: (patch: SettingsPatch) => void;
}

const AdminStoreContext = createContext<AdminStore | null>(null);

export function AdminStoreProvider({
  initialData,
  children,
}: {
  initialData: AdminData;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [data, setData] = useState<AdminData>(initialData);

  // Re-sync with the server whenever the layout refetches after a mutation.
  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const reportError = useCallback(
    (res: { error?: string } | undefined) => {
      if (res?.error) {
        toast.error(res.error);
        router.refresh();
      }
    },
    [router]
  );

  // ---------- Products ----------
  const addProduct = useCallback(
    (input: ProductInput) => {
      const tempId = uid();
      const temp: Product = { ...input, id: tempId, created_at: now(), updated_at: now() };
      setData((d) => ({ ...d, products: [temp, ...d.products] }));
      void createProductAction(input).then((res) => {
        if (res?.error) {
          reportError(res);
          return;
        }
        if (res.data) {
          setData((d) => ({
            ...d,
            products: d.products.map((p) => (p.id === tempId ? res.data! : p)),
          }));
        }
      });
    },
    [reportError]
  );

  const updateProduct = useCallback(
    (id: string, patch: ProductPatch) => {
      setData((d) => ({
        ...d,
        products: d.products.map((p) => (p.id === id ? { ...p, ...patch, updated_at: now() } : p)),
      }));
      void updateProductAction(id, patch).then(reportError);
    },
    [reportError]
  );

  const deleteProduct = useCallback(
    (id: string) => {
      const previous = data.products;
      setData((d) => ({ ...d, products: d.products.filter((p) => p.id !== id) }));
      void deleteProductAction(id).then((res) => {
        if (res?.error) {
          setData((d) => ({ ...d, products: previous }));
          reportError(res);
        }
      });
    },
    [data.products, reportError]
  );

  // ---------- Categories ----------
  const addCategory = useCallback(
    (input: CategoryInput) => {
      const tempId = uid();
      const temp: Category = { ...input, id: tempId, created_at: now(), updated_at: now() };
      setData((d) => ({ ...d, categories: [...d.categories, temp] }));
      void createCategoryAction(input).then((res) => {
        if (res?.error) {
          reportError(res);
          return;
        }
        if (res.data) {
          setData((d) => ({
            ...d,
            categories: d.categories.map((c) => (c.id === tempId ? res.data! : c)),
          }));
        }
      });
    },
    [reportError]
  );

  const updateCategory = useCallback(
    (id: string, patch: CategoryPatch) => {
      setData((d) => ({
        ...d,
        categories: d.categories.map((c) => (c.id === id ? { ...c, ...patch, updated_at: now() } : c)),
      }));
      void updateCategoryAction(id, patch).then(reportError);
    },
    [reportError]
  );

  const deleteCategory = useCallback(
    (id: string) => {
      const previous = data.categories;
      setData((d) => ({
        ...d,
        categories: d.categories.filter((c) => c.id !== id),
        products: d.products.map((p) => (p.category_id === id ? { ...p, category_id: null } : p)),
      }));
      void deleteCategoryAction(id).then((res) => {
        if (res?.error) {
          setData((d) => ({ ...d, categories: previous }));
          reportError(res);
        }
      });
    },
    [data.categories, reportError]
  );

  // ---------- Gallery ----------
  const addGalleryItem = useCallback(
    (input: GalleryInput) => {
      const tempId = uid();
      const temp: GalleryItem = { ...input, id: tempId, created_at: now(), updated_at: now() };
      setData((d) => ({ ...d, gallery: [temp, ...d.gallery] }));
      void createGalleryItemAction(input).then((res) => {
        if (res?.error) {
          reportError(res);
          return;
        }
        if (res.data) {
          setData((d) => ({
            ...d,
            gallery: d.gallery.map((g) => (g.id === tempId ? res.data! : g)),
          }));
        }
      });
    },
    [reportError]
  );

  const updateGalleryItem = useCallback(
    (id: string, patch: GalleryPatch) => {
      setData((d) => ({
        ...d,
        gallery: d.gallery.map((g) => (g.id === id ? { ...g, ...patch, updated_at: now() } : g)),
      }));
      void updateGalleryItemAction(id, patch).then(reportError);
    },
    [reportError]
  );

  const deleteGalleryItem = useCallback(
    (id: string) => {
      const previous = data.gallery;
      setData((d) => ({ ...d, gallery: d.gallery.filter((g) => g.id !== id) }));
      void deleteGalleryItemAction(id).then((res) => {
        if (res?.error) {
          setData((d) => ({ ...d, gallery: previous }));
          reportError(res);
        }
      });
    },
    [data.gallery, reportError]
  );

  const reorderGallery = useCallback(
    (items: { id: string; sort_order: number }[]) => {
      const map = new Map(items.map((i) => [i.id, i.sort_order]));
      setData((d) => ({
        ...d,
        gallery: d.gallery
          .map((g) => ({ ...g, sort_order: map.get(g.id) ?? g.sort_order }))
          .sort((a, b) => a.sort_order - b.sort_order),
      }));
      void reorderGalleryAction(items).then(reportError);
    },
    [reportError]
  );

  // ---------- Hero slides ----------
  const addHeroSlide = useCallback(
    (input: HeroInput) => {
      const tempId = uid();
      const temp: HeroSlide = { ...input, id: tempId, created_at: now(), updated_at: now() };
      setData((d) => ({ ...d, heroSlides: [temp, ...d.heroSlides] }));
      void createHeroSlideAction(input).then((res) => {
        if (res?.error) {
          reportError(res);
          return;
        }
        if (res.data) {
          setData((d) => ({
            ...d,
            heroSlides: d.heroSlides.map((h) => (h.id === tempId ? res.data! : h)),
          }));
        }
      });
    },
    [reportError]
  );

  const updateHeroSlide = useCallback(
    (id: string, patch: HeroPatch) => {
      setData((d) => ({
        ...d,
        heroSlides: d.heroSlides.map((h) => (h.id === id ? { ...h, ...patch, updated_at: now() } : h)),
      }));
      void updateHeroSlideAction(id, patch).then(reportError);
    },
    [reportError]
  );

  const deleteHeroSlide = useCallback(
    (id: string) => {
      const previous = data.heroSlides;
      setData((d) => ({ ...d, heroSlides: d.heroSlides.filter((h) => h.id !== id) }));
      void deleteHeroSlideAction(id).then((res) => {
        if (res?.error) {
          setData((d) => ({ ...d, heroSlides: previous }));
          reportError(res);
        }
      });
    },
    [data.heroSlides, reportError]
  );

  const reorderHeroSlides = useCallback(
    (items: { id: string; sort_order: number }[]) => {
      const map = new Map(items.map((i) => [i.id, i.sort_order]));
      setData((d) => ({
        ...d,
        heroSlides: d.heroSlides
          .map((h) => ({ ...h, sort_order: map.get(h.id) ?? h.sort_order }))
          .sort((a, b) => a.sort_order - b.sort_order),
      }));
      void reorderHeroSlidesAction(items).then(reportError);
    },
    [reportError]
  );

  // ---------- Orders ----------
  const updateOrderStatus = useCallback(
    (id: string, status: OrderStatus) => {
      setData((d) => ({
        ...d,
        orders: d.orders.map((o) => (o.id === id ? { ...o, status, updated_at: now() } : o)),
      }));
      void updateOrderStatusAction(id, status).then(reportError);
    },
    [reportError]
  );

  const deleteOrder = useCallback(
    (id: string) => {
      const previous = data.orders;
      setData((d) => ({ ...d, orders: d.orders.filter((o) => o.id !== id) }));
      void deleteOrderAction(id).then((res) => {
        if (res?.error) {
          setData((d) => ({ ...d, orders: previous }));
          reportError(res);
        }
      });
    },
    [data.orders, reportError]
  );

  // ---------- Settings ----------
  const updateSettings = useCallback(
    (patch: SettingsPatch) => {
      setData((d) => ({ ...d, settings: mergeSettings(d.settings, patch) }));
      void updateSettingsAction(patch).then(reportError);
    },
    [reportError]
  );

  const value = useMemo<AdminStore>(
    () => ({
      ...data,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      reorderGallery,
      addHeroSlide,
      updateHeroSlide,
      deleteHeroSlide,
      reorderHeroSlides,
      updateOrderStatus,
      deleteOrder,
      updateSettings,
    }),
    [
      data,
      addProduct,
      updateProduct,
      deleteProduct,
      addCategory,
      updateCategory,
      deleteCategory,
      addGalleryItem,
      updateGalleryItem,
      deleteGalleryItem,
      reorderGallery,
      addHeroSlide,
      updateHeroSlide,
      deleteHeroSlide,
      reorderHeroSlides,
      updateOrderStatus,
      deleteOrder,
      updateSettings,
    ]
  );

  return <AdminStoreContext.Provider value={value}>{children}</AdminStoreContext.Provider>;
}

// Deep-merge a settings patch into the current settings (used for the optimistic
// update on the client).
function mergeSettings(
  current: SiteSettings,
  patch: SettingsPatch
): SiteSettings {
  const merged = { ...current };
  for (const key of Object.keys(patch) as (keyof SiteSettings)[]) {
    const section = patch[key];
    if (!section || typeof section !== "object") continue;
    merged[key] = { ...merged[key], ...section } as never;
  }
  return merged;
}

// Local alias so the client helper does not shadow the imported server action.
export function useAdminStore(): AdminStore {
  const ctx = useContext(AdminStoreContext);
  if (!ctx) throw new Error("useAdminStore must be used within AdminStoreProvider");
  return ctx;
}
