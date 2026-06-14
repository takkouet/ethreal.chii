import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AdminNav } from "@/components/admin-nav";
import { ProductForm } from "@/components/product-form";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await prisma.product.findUnique({ where: { id } });
  if (!product) notFound();

  return (
    <>
      <AdminNav />
      <h1 className="text-3xl font-bold mb-6">Edit product</h1>
      <ProductForm
        initial={{
          id: product.id,
          name: product.name,
          description: product.description,
          priceVnd: product.priceVnd,
          imageUrl: product.imageUrl,
          stock: product.stock,
          active: product.active,
        }}
      />
    </>
  );
}
